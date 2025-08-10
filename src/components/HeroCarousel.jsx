// src/components/HeroCarousel.jsx
import React, { useMemo, useRef, useLayoutEffect, useEffect, useState } from 'react';
import './HeroCarousel.css';

/**
 * Props (all optional):
 *  - speed: seconds for one full loop (default 50s)
 *  - itemWidth: CSS length (default '18vw')
 *  - aspect: [w, h] for aspect-ratio (default [230, 510])
 */
export default function HeroCarousel({
  speed = 30,
  itemWidth = '18vw',
  aspect = [230, 510],
}) {
  // Load images from folder: support both Vite and Webpack/CRA
  const imgs = useMemo(() => {
    try {
      if (typeof import.meta !== 'undefined' && typeof import.meta.glob === 'function') {
        const modules = import.meta.glob('../assets/img-hero-carousel/*.{png,jpg,jpeg,webp,gif,svg}', { eager: true });
        return Object.keys(modules).sort().map((k) => modules[k]?.default ?? modules[k]);
      }
    } catch (_) {}
    try {
      const ctx = require.context('../assets/img-hero-carousel', false, /\.(png|jpe?g|webp|gif|svg)$/i);
      return ctx.keys().sort().map((k) => ctx(k)?.default ?? ctx(k));
    } catch (e) {
      console.warn('[HeroCarousel] No images found in src/assets/img-hero-carousel', e);
      return [];
    }
  }, []);

  const trackRef = useRef(null);
  const groupRef = useRef(null);

  // measured width of one group, and animation state
  const halfRef = useRef(0);
  const xRef = useRef(0);
  const lastRef = useRef(0);
  const rafRef = useRef(0);
  const pausedRef = useRef(false);

  // Measure group width -> set halfRef
  useLayoutEffect(() => {
    const setHalf = () => {
      if (!groupRef.current) return;
      const half = groupRef.current.offsetWidth;
      halfRef.current = half;
    };
    setHalf();
    const ro = new ResizeObserver(setHalf);
    if (groupRef.current) ro.observe(groupRef.current);
    window.addEventListener('resize', setHalf);
    return () => {
      window.removeEventListener('resize', setHalf);
      ro.disconnect();
    };
  }, []);

  // rAF animation (seamless, no keyframe reset)
  useEffect(() => {
    if (!trackRef.current) return;
    let running = true;

    const step = (ts) => {
      if (!running) return;
      if (!pausedRef.current) {
        const half = halfRef.current || 1;
        const pxPerSec = half / Math.max(speed, 0.001); // pixels per second
        const last = lastRef.current || ts;
        const dt = Math.min(0.05, (ts - last) / 1000);  // clamp to avoid jumps if tab was inactive
        lastRef.current = ts;

        // advance by velocity
        xRef.current += pxPerSec * dt;

        // wrap seamlessly (handle overshoot in one frame)
        if (xRef.current >= half) {
          xRef.current = xRef.current % half;
        }

        // apply transform
        trackRef.current.style.transform = `translate3d(${-xRef.current}px, 0, 0)`;
      } else {
        // update lastRef so dt is correct after pause
        lastRef.current = ts;
      }

      rafRef.current = requestAnimationFrame(step);
    };

    // init
    xRef.current = 0;
    lastRef.current = 0;
    rafRef.current = requestAnimationFrame(step);

    return () => {
      running = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [speed]); // re-run if speed changes

  // Provide sizing vars to items
  const itemStyle = {
    ['--item-width']: itemWidth,
    ['--item-aspect-w']: aspect[0],
    ['--item-aspect-h']: aspect[1],
  };

  const handleMouseEnter = () => {
    pausedRef.current = true;
  };

  const handleMouseLeave = () => {
    pausedRef.current = false;
  };

  return (
    <section className="carousel full-bleed" aria-label="Work previews" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div className="carousel__track" ref={trackRef}>
        <div className="carousel__group" ref={groupRef}>
          {imgs.map((src, i) => (
            <div className="carousel__item" key={`g1-${i}`} style={itemStyle}>
              <img src={src} alt={`Work ${i + 1}`} loading="lazy" />
            </div>
          ))}
        </div>
        <div className="carousel__group">
          {imgs.map((src, i) => (
            <div className="carousel__item" key={`g2-${i}`} style={itemStyle}>
              <img src={src} alt={`Work ${i + 1}`} loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}