// src/components/HeroCarousel.jsx
import React, { useMemo } from "react";
import "./HeroCarousel.css";

export default function HeroCarousel({
  speed = "30s",        // CSS animation duration
  item = "240px",       // fixed px = zero jumps
  gap = "48px",
  aspect = [230, 510],  // w/h for aspect-ratio
}) {
  // Load images from folder
  const imgs = useMemo(() => {
    try {
      if (typeof import.meta !== "undefined" && typeof import.meta.glob === "function") {
        const modules = import.meta.glob(
          "../assets/img-hero-carousel/*.{png,jpg,jpeg,webp,gif,svg}",
          { eager: true }
        );
        return Object.keys(modules)
          .sort()
          .map((k) => modules[k]?.default ?? modules[k]);
      }
    } catch (_) {}
    try {
      const ctx = require.context(
        "../assets/img-hero-carousel",
        false,
        /\.(png|jpe?g|webp|gif|svg)$/i
      );
      return ctx.keys().sort().map((k) => ctx(k)?.default ?? ctx(k));
    } catch (e) {
      console.warn("[HeroCarousel] No images found", e);
      return [];
    }
  }, []);

  // Duplicate once for seamless belt
  const dup = [...imgs];

  const style = {
    "--speed": speed,
    "--gap": gap,
    "--item": item,
    "--ar-w": aspect[0],
    "--ar-h": aspect[1],
  };

  return (
    <section className="scroller" style={style} aria-label="Work carousel">
      <div className="scroller__belt">
        <ul className="scroller__group">
          {imgs.map((src, i) => (
            <li className="scroller__item" key={`g1-${i}`}>
              <img src={src} alt={`Work ${i + 1}`} loading="lazy" />
            </li>
          ))}
        </ul>
        <ul className="scroller__group scroller__group--clone" aria-hidden="true">
          {dup.map((src, i) => (
            <li className="scroller__item" key={`g2-${i}`}>
              <img src={src} alt="" loading="lazy" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}