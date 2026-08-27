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

function matrixForQuad(width, height, [topLeft, topRight, bottomRight, bottomLeft]) {
  const dx1 = topRight.x - bottomRight.x;
  const dx2 = bottomLeft.x - bottomRight.x;
  const dx3 = topLeft.x - topRight.x + bottomRight.x - bottomLeft.x;
  const dy1 = topRight.y - bottomRight.y;
  const dy2 = bottomLeft.y - bottomRight.y;
  const dy3 = topLeft.y - topRight.y + bottomRight.y - bottomLeft.y;
  const determinant = (dx1 * dy2) - (dx2 * dy1);

  let projectX = 0;
  let projectY = 0;
  if (Math.abs(determinant) > 0.00001) {
    projectX = ((dx3 * dy2) - (dx2 * dy3)) / determinant;
    projectY = ((dx1 * dy3) - (dx3 * dy1)) / determinant;
  }

  const scaleX = topRight.x - topLeft.x + (projectX * topRight.x);
  const skewX = bottomLeft.x - topLeft.x + (projectY * bottomLeft.x);
  const scaleY = topRight.y - topLeft.y + (projectX * topRight.y);
  const skewY = bottomLeft.y - topLeft.y + (projectY * bottomLeft.y);

  const h11 = scaleX / width;
  const h12 = skewX / height;
  const h13 = topLeft.x;
  const h21 = scaleY / width;
  const h22 = skewY / height;
  const h23 = topLeft.y;
  const h31 = projectX / width;
  const h32 = projectY / height;

  return `matrix3d(${[
    h11, h21, 0, h31,
    h12, h22, 0, h32,
    0, 0, 1, 0,
    h13, h23, 0, 1,
  ].join(',')})`;
}

function PhoneHardware({ onReady, onError, screenRef }) {
  const canvasRef = useRef(null);
  const stageRef = useRef(null);
  const orbitSurfaceRef = useRef(null);

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

    // The projected DOM surface includes one clean black bezel around the
    // live website. Keeping it out of WebGL avoids stacking another 3D edge
    // on top of the bezel already present in the source model.
    const screenWidth = 0.0672;
    const screenHeight = 0.1447;
    const screenDepth = -0.00682;
    const screenCorners = [
      new THREE.Vector3(screenWidth / 2, screenHeight / 2, screenDepth),
      new THREE.Vector3(-screenWidth / 2, screenHeight / 2, screenDepth),
      new THREE.Vector3(-screenWidth / 2, -screenHeight / 2, screenDepth),
      new THREE.Vector3(screenWidth / 2, -screenHeight / 2, screenDepth),
    ];
    const projectedCorner = new THREE.Vector3();

    let rotationX = 0;
    let rotationY = 0;
    let dragStartX = 0;
    let dragStartY = 0;
    let dragRotationX = 0;
    let dragRotationY = 0;
    let dragging = false;

    const projectScreen = () => {
      const screenElement = screenRef.current;
      if (!screenElement) return;

      rig.updateMatrixWorld(true);
      const width = stage.clientWidth;
      const height = stage.clientHeight;
      const device = stage.parentElement;
      const deviceWidth = device?.clientWidth || width;
      const deviceHeight = device?.clientHeight || height;
      const stageOffsetX = stage.offsetLeft;
      const stageOffsetY = stage.offsetTop;
      const quad = screenCorners.map((corner) => {
        projectedCorner.copy(corner).applyMatrix4(rig.matrixWorld).project(camera);
        return {
          x: ((projectedCorner.x * 0.5 + 0.5) * width) + stageOffsetX,
          y: ((-projectedCorner.y * 0.5 + 0.5) * height) + stageOffsetY,
        };
      });

      const baseWidth = deviceWidth * 0.843;
      const baseHeight = deviceHeight * 0.907;
      const facing = Math.cos(rotationX) * Math.cos(rotationY);
      screenElement.style.width = `${baseWidth}px`;
      screenElement.style.height = `${baseHeight}px`;
      screenElement.style.transform = matrixForQuad(baseWidth, baseHeight, quad);
      screenElement.style.opacity = facing > 0.07 ? '1' : '0';
      screenElement.style.pointerEvents = facing > 0.2 ? 'auto' : 'none';
    };

    const setDragging = (active) => {
      dragging = active;
      stage.classList.toggle('is-dragging', active);
      orbitSurfaceRef.current?.classList.toggle('is-dragging', active);
    };

    const onPointerDown = (event) => {
      if (event.button !== 0) return;
      event.preventDefault();
      dragStartX = event.clientX;
      dragStartY = event.clientY;
      dragRotationX = rotationX;
      dragRotationY = rotationY;
      setDragging(true);
      event.currentTarget.setPointerCapture(event.pointerId);
    };

    const onPointerMove = (event) => {
      if (!dragging) return;
      event.preventDefault();
      rotationY = dragRotationY + ((event.clientX - dragStartX) * 0.009);
      rotationX = THREE.MathUtils.clamp(
        dragRotationX - ((event.clientY - dragStartY) * 0.006),
        -0.62,
        0.62,
      );
      rig.rotation.set(rotationX, rotationY, 0);
      projectScreen();
    };

    const onPointerUp = (event) => {
      if (!dragging) return;
      setDragging(false);
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    };

    const resetRotation = () => {
      rotationX = 0;
      rotationY = 0;
      rig.rotation.set(0, 0, 0);
      projectScreen();
    };

    const dragTargets = [stage, orbitSurfaceRef.current].filter(Boolean);
    dragTargets.forEach((target) => {
      target.addEventListener('pointerdown', onPointerDown);
      target.addEventListener('pointermove', onPointerMove);
      target.addEventListener('pointerup', onPointerUp);
      target.addEventListener('pointercancel', onPointerUp);
      target.addEventListener('dblclick', resetRotation);
    });

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
      const deviceHeight = stage.parentElement?.clientHeight || height;
      renderer.setSize(width, height, false);
      camera.position.z = -0.288 * (height / Math.max(deviceHeight, 1));
      camera.lookAt(0, 0, 0);
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
      camera.updateMatrixWorld(true);
      projectScreen();
      renderer.render(scene, camera);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(stage);
    resize();

    let frame = 0;
    const render = () => {
      projectScreen();
      renderer.render(scene, camera);
      frame = window.requestAnimationFrame(render);
    };
    render();

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      dragTargets.forEach((target) => {
        target.removeEventListener('pointerdown', onPointerDown);
        target.removeEventListener('pointermove', onPointerMove);
        target.removeEventListener('pointerup', onPointerUp);
        target.removeEventListener('pointercancel', onPointerUp);
        target.removeEventListener('dblclick', resetRotation);
      });
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
  }, [onError, onReady, screenRef]);

  return (
    <>
      <div ref={orbitSurfaceRef} className="phone-mode__orbit-surface" aria-hidden="true" />
      <div ref={stageRef} className="phone-mode__hardware" aria-hidden="true">
        <canvas ref={canvasRef} />
      </div>
    </>
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
  const screenRef = useRef(null);
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
                screenRef={screenRef}
              />

              <div ref={screenRef} className="phone-mode__screen">
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

          <p className="phone-mode__hint">Drag around the phone to rotate · scroll and tap inside</p>
        </section>
      )}
    </>
  );
}
