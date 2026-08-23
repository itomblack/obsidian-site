import React, { useEffect, useRef } from 'react';

const LINE_COUNT = 6;

export default function AmbientGrid() {
  const gridRef = useRef(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined;

    let frame = null;
    let latestEvent = null;

    const paint = () => {
      frame = null;
      if (!latestEvent) return;

      const lines = grid.querySelectorAll('.ambient-grid__line');
      grid.style.setProperty('--grid-light-y', `${latestEvent.pageY}px`);

      lines.forEach((line) => {
        const x = line.getBoundingClientRect().left;
        const distance = Math.abs(latestEvent.clientX - x);
        const strength = Math.max(0, 1 - (distance / 180));
        line.style.setProperty('--grid-light-opacity', (strength * 0.72).toFixed(3));
      });
    };

    const move = (event) => {
      latestEvent = event;
      if (!frame) frame = window.requestAnimationFrame(paint);
    };

    const release = () => {
      grid.querySelectorAll('.ambient-grid__line').forEach((line) => {
        line.style.setProperty('--grid-light-opacity', '0');
      });
    };

    window.addEventListener('pointermove', move, { passive: true });
    document.documentElement.addEventListener('mouseleave', release);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', move);
      document.documentElement.removeEventListener('mouseleave', release);
    };
  }, []);

  return (
    <div className="ambient-grid" ref={gridRef} aria-hidden="true">
      {Array.from({ length: LINE_COUNT }, (_, index) => (
        <span className="ambient-grid__line" key={index}>
          <span className="ambient-grid__mobile-light" />
        </span>
      ))}
    </div>
  );
}
