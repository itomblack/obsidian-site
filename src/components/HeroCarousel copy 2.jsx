// src/components/HeroCarousel.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import "./HeroCarousel.css";

/**
 * Scroll-linked horizontal carousel
 * - Starts static
 * - Begins once 75% of the strip is visible
 * - Horizontal position is mapped to window scroll progress
 * - Stops when the final item is fully in view (inside padded viewport)
 */
export default function HeroCarousel() {
  const scrollerRef = useRef(null); // viewport wrapper
  const beltRef = useRef(null);     // the long horizontal belt

  const [isMobile, setIsMobile] = useState(false);

  // ---- editable variables (desktop vs mobile) ----
  const MOBILE_ITEM = 180;    // px
  const DESKTOP_ITEM = 330;   // px
  const MOBILE_GAP = 16;      // px
  const DESKTOP_GAP = 48;     // px

  const MAX_CONTENT = 1440;

  // “How much vertical scroll to move across the full belt?”
  // Higher = slower sideways movement.
  const MOBILE_SCROLL_FACTOR = 1.2;   // try 1.0–2.0
  const DESKTOP_SCROLL_FACTOR = 1.0;

  // 75% visibility trigger (0..1)
  const VIS_TRIGGER = 0.75;

  // measure breakpoint
  useEffect(() => {
    const set = () => setIsMobile(window.innerWidth < 720);
    set();
    window.addEventListener("resize", set);
    return () => window.removeEventListener("resize", set);
  }, []);

  // load images from folder
  const imgs = useMemo(() => {
    try {
      if (typeof import.meta !== "undefined" && typeof import.meta.glob === "function") {
        const m = import.meta.glob(
          "../assets/img-hero-carousel/*.{png,jpg,jpeg,webp,gif,svg}",
          { eager: true }
        );
        return Object.keys(m).sort().map((k) => m[k]?.default ?? m[k]);
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

  // keep some metrics we recalc on resize/images loaded
  const metricsRef = useRef({
    startY: 0,     // window.scrollY at which motion begins
    rangeY: 1,     // vertical scroll distance over which we traverse the belt
    maxShift: 0,   // px to translateX at 100% progress
    startShift: 0, // initial shift to avoid clipping first item
  });

  // helper to (re)calculate geometry
  const recalc = () => {
    const scroller = scrollerRef.current;
    const belt = beltRef.current;
    if (!scroller || !belt) return;

    // read current gap (px) as a number; fallback to our JS knobs
    const styles = getComputedStyle(scroller);
    const gapVar = parseFloat(styles.getPropertyValue("--gap")) || 0;
    const gap = gapVar || (isMobile ? MOBILE_GAP : DESKTOP_GAP);

    // total belt width (sum of items + gaps)
    const beltWidth = belt.scrollWidth;

    // the visible content box *inside* the scroller’s left/right padding
    const innerWidth = scroller.clientWidth;
    // clamp the content box to the site max width so the carousel aligns with other sections
    const contentWidth = Math.max(0, Math.min(MAX_CONTENT, innerWidth - 2 * gap));

    // how far we can move the belt so the last item is fully visible
    const maxShift = Math.max(0, beltWidth - contentWidth);

    // Calculate startShift to avoid clipping the first item
    const first = belt.querySelector('.scrollCarousel__item');
    const padLeft = parseFloat(styles.paddingLeft) || gap;
    const pageX = window.scrollX || window.pageXOffset;
    const scrollerLeft = scroller.getBoundingClientRect().left + pageX + padLeft;
    // If viewport is wider than the clamped contentWidth, center the content
    const viewportW = window.innerWidth;
    const centeredLeft = pageX + Math.max(0, (viewportW - contentWidth) / 2);
    // choose whichever is greater so we never start before the actual scroller padding
    const contentLeft = Math.max(scrollerLeft, centeredLeft);
    const firstLeft = first ? (first.getBoundingClientRect().left + (window.scrollX || window.pageXOffset)) : contentLeft;
    const startShift = Math.max(0, contentLeft - firstLeft); // positive means move belt right

    // When should animation start? Once 75% of scroller is in view
    const rect = scroller.getBoundingClientRect();
    const pageY = window.scrollY || window.pageYOffset;
    const viewportH = window.innerHeight;

    const scrollerTop = rect.top + pageY;
    const scrollerHeight = rect.height;
    const triggerOffset = scrollerHeight * (1 - VIS_TRIGGER);
    const startY = scrollerTop - (viewportH - triggerOffset);

    // vertical distance that maps to the full horizontal travel
    const factor = isMobile ? MOBILE_SCROLL_FACTOR : DESKTOP_SCROLL_FACTOR;
    const rangeY = Math.max(1, maxShift * factor);

    metricsRef.current = { startY, rangeY, maxShift, startShift };
  };

  // Recalculate on mount/resize/images loaded
  useEffect(() => {
    recalc();
    const onResize = () => recalc();

    const imgsInDom = Array.from(
      (beltRef.current ?? document.createElement("div")).querySelectorAll("img")
    );
    let pending = imgsInDom.length;
    const onImg = () => {
      pending -= 1;
      if (pending <= 0) recalc();
    };
    imgsInDom.forEach((im) => {
      if (im.complete) return;
      im.addEventListener("load", onImg);
      im.addEventListener("error", onImg);
    });

    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      imgsInDom.forEach((im) => {
        im.removeEventListener("load", onImg);
        im.removeEventListener("error", onImg);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile, imgs.length]);

  // Tie horizontal translate to vertical scroll progress
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;

        const { startY, rangeY, maxShift, startShift } = metricsRef.current;
        const y = window.scrollY || window.pageYOffset;
        const progress = Math.min(1, Math.max(0, (y - startY) / rangeY));

        const shift = startShift - maxShift * progress;
        if (beltRef.current) {
          beltRef.current.style.transform = `translate3d(${shift}px,0,0)`;
        }
      });
    };

    // set initial position
    {
      const { startY, rangeY, maxShift, startShift } = metricsRef.current;
      const y = window.scrollY || window.pageYOffset;
      const progress = Math.min(1, Math.max(0, (y - startY) / rangeY));
      const initialShift = startShift - maxShift * progress;
      if (beltRef.current) {
        beltRef.current.style.transform = `translate3d(${initialShift}px,0,0)`;
      }
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // feed CSS vars
  const styleVars = {
    "--item": `${isMobile ? MOBILE_ITEM : DESKTOP_ITEM}px`,
    "--gap": `${isMobile ? MOBILE_GAP : DESKTOP_GAP}px`,
  };

  return (
    <section className="scrollCarousel" ref={scrollerRef} style={styleVars}>
      <div className="scrollCarousel__belt" ref={beltRef}>
        {imgs.map((src, i) => (
          <div className="scrollCarousel__item" key={i}>
            <img src={src} alt={`Work ${i + 1}`} loading="lazy" />
          </div>
        ))}
      </div>
    </section>
  );
}