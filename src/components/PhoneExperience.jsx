import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import './PhoneExperience.scss';

const silverMaterials = new Set([
  'SLmJkLdkhbbuEfG',
  'VXTclbUnoLmmPoD',
  'YQFhPSFSryEqJMp',
  'ooxVuxObmmqIeuh',
  'JKTmNomFyvfvVAj',
]);

function tuneMaterial(material) {
  if (!(material instanceof THREE.MeshStandardMaterial)) return material;

  if (silverMaterials.has(material.name)) {
    material.color.set(0xd9d8d3);
    material.metalness = Math.max(0.78, material.metalness);
    material.roughness = 0.28;
    material.envMapIntensity = 1.85;
  } else {
    material.envMapIntensity = 1.4;
  }

  if (material.name === 'nypJRzXNHbmJCqR') {
    return new THREE.MeshPhysicalMaterial({
      name: material.name,
      color: 0x071326,
      roughness: 0.07,
      metalness: 0,
      clearcoat: 1,
      clearcoatRoughness: 0.025,
      iridescence: 0.28,
      iridescenceIOR: 1.35,
      iridescenceThicknessRange: [120, 420],
      envMapIntensity: 2.2,
    });
  }

  material.needsUpdate = true;
  return material;
}

function PhoneHardware({ onReady, onError }) {
  const canvasRef = useRef(null);
  const stageRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!canvas || !stage) return undefined;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(31, 0.5, 0.01, 20);
    camera.position.set(0, 0, -0.288);
    camera.lookAt(0, 0, 0);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    const environment = pmrem.fromScene(room, 0.035).texture;
    scene.environment = environment;
    room.dispose();
    pmrem.dispose();

    const warmKey = new THREE.DirectionalLight(0xffffff, 4.3);
    warmKey.position.set(-2.4, 3.2, -4.5);
    scene.add(warmKey);

    const coolFill = new THREE.DirectionalLight(0xb9d8ff, 2.4);
    coolFill.position.set(3.2, 0.4, -2.2);
    scene.add(coolFill);
    scene.add(new THREE.HemisphereLight(0xffffff, 0x2a3142, 1.5));

    const rig = new THREE.Group();
    scene.add(rig);

    const loader = new GLTFLoader();
    let model;
    let disposed = false;

    loader.load(
      '/iphone-17-pro-silver.glb',
      (gltf) => {
        if (disposed) return;
        model = gltf.scene;
        const modelBox = new THREE.Box3().setFromObject(model);
        const modelCenter = modelBox.getCenter(new THREE.Vector3());
        const modelSize = modelBox.getSize(new THREE.Vector3());
        model.position.sub(modelCenter);
        if (modelSize.y > 0) model.scale.setScalar(0.14956 / modelSize.y);

        model.traverse((object) => {
          if (!(object instanceof THREE.Mesh)) return;
          object.material = Array.isArray(object.material)
            ? object.material.map(tuneMaterial)
            : tuneMaterial(object.material);
        });

        rig.add(model);
        onReady();
      },
      undefined,
      () => onError(),
    );

    const resize = () => {
      const width = stage.clientWidth;
      const height = stage.clientHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(stage);
    resize();

    let frame = 0;
    const render = () => {
      renderer.render(scene, camera);
      frame = window.requestAnimationFrame(render);
    };
    render();

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      if (model) {
        model.traverse((object) => {
          if (!(object instanceof THREE.Mesh)) return;
          object.geometry?.dispose();
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => material?.dispose());
        });
      }
      environment.dispose();
      renderer.dispose();
    };
  }, [onError, onReady]);

  return (
    <div ref={stageRef} className="phone-mode__hardware" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="6.5" y="2.5" width="11" height="19" rx="2.6" />
      <path d="M10 5h4M11.3 18.7h1.4" />
    </svg>
  );
}

export default function PhoneExperience() {
  const location = useLocation();
  const triggerRef = useRef(null);
  const closeRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [frameUrl, setFrameUrl] = useState('');
  const [modelStatus, setModelStatus] = useState('loading');
  const [pageReady, setPageReady] = useState(false);

  const handleModelReady = useCallback(() => setModelStatus('ready'), []);
  const handleModelError = useCallback(() => setModelStatus('error'), []);

  const isEmbedded = window.self !== window.top
    || new URLSearchParams(location.search).get('phonePreview') === '1';

  const openPhone = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('phonePreview', '1');
    setFrameUrl(url.toString());
    setModelStatus('loading');
    setPageReady(false);
    setIsOpen(true);
  };

  const closePhone = () => setIsOpen(false);

  useEffect(() => {
    if (!isOpen) return undefined;

    const triggerNode = triggerRef.current;
    const priorOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.body.classList.add('is-phone-mode');
    closeRef.current?.focus();

    const onKeyDown = (event) => {
      if (event.key === 'Escape') closePhone();
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = priorOverflow;
      document.body.classList.remove('is-phone-mode');
      window.requestAnimationFrame(() => triggerNode?.focus());
    };
  }, [isOpen]);

  if (isEmbedded) return null;

  return (
    <>
      <button
        ref={triggerRef}
        className="phone-mode-trigger"
        type="button"
        onClick={openPhone}
        aria-label="Browse this site inside a phone"
      >
        <PhoneIcon />
        <span>Phone mode</span>
      </button>

      {isOpen && (
        <section className="phone-mode" role="dialog" aria-modal="true" aria-label="Mobile site preview">
          <div className="phone-mode__atmosphere" aria-hidden="true" />

          <header className="phone-mode__bar">
            <p><span>Obsidian Lab</span> · mobile site</p>
            <button ref={closeRef} type="button" onClick={closePhone}>
              <span>Exit phone</span>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
            </button>
          </header>

          <div className="phone-mode__scene">
            <div className="phone-mode__shadow" aria-hidden="true" />
            <div className={`phone-mode__device ${modelStatus === 'ready' ? 'is-ready' : ''}`}>
              <PhoneHardware
                onReady={handleModelReady}
                onError={handleModelError}
              />

              <div className="phone-mode__screen">
                <iframe
                  src={frameUrl}
                  title="Obsidian Lab mobile website"
                  onLoad={() => setPageReady(true)}
                />
                <div className="phone-mode__glass" aria-hidden="true" />
                <div className="phone-mode__island" aria-hidden="true" />
              </div>
            </div>

            {(!pageReady || modelStatus === 'loading') && (
              <div className="phone-mode__loading" role="status" aria-live="polite">
                <span /> Preparing phone mode…
              </div>
            )}
            {modelStatus === 'error' && (
              <p className="phone-mode__error">The 3D shell could not load, but the live mobile site is still available.</p>
            )}
          </div>

          <p className="phone-mode__hint">Scroll, tap and follow links inside the phone</p>
        </section>
      )}
    </>
  );
}
