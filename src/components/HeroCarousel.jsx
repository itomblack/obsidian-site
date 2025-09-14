// src/components/HeroCarousel.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import "./HeroCarousel.scss";

export default function HeroCarousel() {
  const scrollerRef = useRef(null); // the .scrollCarousel (visible area)
  const beltRef = useRef(null);     // the .scrollCarousel__belt (moves)
  const xRef = useRef(0);           // current horizontal position
  const maxXRef = useRef(0);        // clamp (computed)
  const lastYRef = useRef(0);       // last vertical scroll pos for delta calc
  const startedRef = useRef(false); // becomes true once threshold is first met

  const [isMobile, setIsMobile] = useState(false);

  // ---------- knobs you can tweak ----------
  const MOBILE_ITEM = 180;  // px
  const DESKTOP_ITEM = 330; // px
  const MOBILE_GAP  = 16;   // px
  const DESKTOP_GAP = 48;   // px

  // Start when this much of the carousel is visible (0..1)
  const START_VISIBILITY = 0.4;

  // Horizontal pixels moved per 1px vertical scroll
  const MOBILE_SPEED  = 0.55;
  const DESKTOP_SPEED = 0.85;
  // -----------------------------------------

  // helper that’s reliable on iOS Safari too
  const getScrollY = () =>
    window.pageYOffset ??
    document.documentElement.scrollTop ??
    document.body.scrollTop ??
    0;

  // breakpoint watcher
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 720);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Load Desktop/Mobile variants if present and pair them by base filename
  // e.g., 01-Desktop.jpg and 01-Mobile.jpg -> { key: '01', desktop, mobile }
  const items = useMemo(() => {
    const makePairsFromMaps = (mobileMap, desktopMap) => {
      const toUrl = (v) => (v && v.default) ? v.default : v;
      const pairs = {};
      const normBase = (p) => {
        const file = p.split('/').pop();
        const noExt = file.replace(/\.(png|jpe?g|webp|avif|gif|svg)$/i, '');
        return noExt.replace(/-(Mobile|Desktop)$/i, '');
      };

      Object.entries(mobileMap || {}).forEach(([path, mod]) => {
        const base = normBase(path);
        pairs[base] = pairs[base] || {};
        pairs[base].mobile = toUrl(mod);
      });
      Object.entries(desktopMap || {}).forEach(([path, mod]) => {
        const base = normBase(path);
        pairs[base] = pairs[base] || {};
        pairs[base].desktop = toUrl(mod);
      });

      const keys = Object.keys(pairs).sort((a, b) => {
        const na = parseInt(a, 10);
        const nb = parseInt(b, 10);
        if (!Number.isNaN(na) && !Number.isNaN(nb)) return na - nb;
        return a.localeCompare(b);
      });

      return keys.map((k) => {
        const pair = pairs[k];
        const mobile = pair.mobile ?? pair.desktop;
        const desktop = pair.desktop ?? pair.mobile;
        return { key: k, mobile, desktop };
      });
    };

    // Vite / import.meta.glob
    try {
      if (typeof import.meta !== "undefined" && typeof import.meta.glob === "function") {
        const mobileMap = import.meta.glob(
          "../assets/img-hero-carousel/*-Mobile.{png,jpg,jpeg,webp,avif}",
          { eager: true }
        );
        const desktopMap = import.meta.glob(
          "../assets/img-hero-carousel/*-Desktop.{png,jpg,jpeg,webp,avif}",
          { eager: true }
        );
        const pairs = makePairsFromMaps(mobileMap, desktopMap);
        if (pairs.length) return pairs;
      }
    } catch (_) {}

    // CRA / webpack require.context
    try {
      const mobileCtx = require.context(
        "../assets/img-hero-carousel",
        false,
        /-Mobile\.(png|jpe?g|webp|avif)$/i
      );
      const desktopCtx = require.context(
        "../assets/img-hero-carousel",
        false,
        /-Desktop\.(png|jpe?g|webp|avif)$/i
      );
      const mobileMap = Object.fromEntries(mobileCtx.keys().map((k) => [k, mobileCtx(k)]));
      const desktopMap = Object.fromEntries(desktopCtx.keys().map((k) => [k, desktopCtx(k)]));
      const pairs = makePairsFromMaps(mobileMap, desktopMap);
      if (pairs.length) return pairs;
    } catch (_) {}

    // Fallback: any images (legacy names like 01.jpg)
    try {
      if (typeof import.meta !== "undefined" && typeof import.meta.glob === "function") {
        const anyMap = import.meta.glob(
          "../assets/img-hero-carousel/*.{png,jpg,jpeg,webp,gif,svg}",
          { eager: true }
        );
        const toUrl = (v) => (v && v.default) ? v.default : v;
        return Object.keys(anyMap).sort().map((k) => ({ key: k, mobile: toUrl(anyMap[k]), desktop: toUrl(anyMap[k]) }));
      }
    } catch (_) {}
    try {
      const ctx = require.context(
        "../assets/img-hero-carousel",
        false,
        /\.(png|jpe?g|webp|gif|svg)$/i
      );
      return ctx.keys().sort().map((k) => {
        const v = ctx(k);
        const url = (v && v.default) ? v.default : v;
        return { key: k, mobile: url, desktop: url };
      });
    } catch (e) {
      console.warn("[HeroCarousel] No images found", e);
      return [];
    }
  }, []);

  // CSS custom properties for size/gap
  const styleVars = {
    "--item": `${isMobile ? MOBILE_ITEM : DESKTOP_ITEM}px`,
    "--gap":  `${isMobile ? MOBILE_GAP  : DESKTOP_GAP }px`,
  };

  // compute clamp (maxX) so the last card aligns with the right edge
  const recomputeBounds = () => {
    const scroller = scrollerRef.current;
    const belt = beltRef.current;
    if (!scroller || !belt) return;

    // how much extra padding we add on the right to meet the viewport edge
    // (this matches --edge-bleed in CSS)
    const edgeBleed = Math.max(0, (window.innerWidth - scroller.clientWidth) / 2);

    const beltWidth = belt.scrollWidth;          // total width of cards & gaps
    const viewWidth = scroller.clientWidth;      // visible area (the inset section)
    const maxX = Math.max(0, beltWidth - viewWidth + edgeBleed);
    maxXRef.current = maxX;

    // keep current X inside new bounds (e.g., when resizing)
    xRef.current = Math.min(xRef.current, maxXRef.current);
    applyX();
  };

  // apply transform to the belt (single place = no layout thrash)
  const applyX = () => {
    const belt = beltRef.current;
    if (!belt) return;
    belt.style.transform = `translate3d(${-xRef.current}px, 0, 0)`;
  };

  // intersection observer: arm once when threshold is reached
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!startedRef.current && entry.intersectionRatio >= START_VISIBILITY) {
          startedRef.current = true;              // arm once when visible enough
          lastYRef.current = getScrollY();        // anchor to avoid an initial jump
        }
      },
      {
        root: null,
        threshold: [0, 0.25, 0.5, 0.75, 1],
        // small negative bottom margin helps on tiny mobile viewports
        rootMargin: "0px 0px -10% 0px",
      }
    );
    io.observe(scroller);
    return () => io.disconnect();
  }, [START_VISIBILITY]);

  // couple vertical scroll deltas to horizontal movement
  useEffect(() => {
    const onScroll = () => {
      if (!startedRef.current) {
        // Not armed yet; keep anchor in sync to avoid jump when arming
        lastYRef.current = getScrollY();
        return;
      }

      const y = getScrollY();
      const dy = y - lastYRef.current;
      lastYRef.current = y;

      if (dy === 0) return;

      const speed = isMobile ? MOBILE_SPEED : DESKTOP_SPEED;
      const next = Math.min(
        Math.max(0, xRef.current + dy * speed),
        maxXRef.current
      );

      if (next !== xRef.current) {
        xRef.current = next;
        applyX();
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isMobile, MOBILE_SPEED, DESKTOP_SPEED]);

  // recalc bounds when images load / resize
  useEffect(() => {
    recomputeBounds();
    const ro = new ResizeObserver(recomputeBounds);
    if (scrollerRef.current) ro.observe(scrollerRef.current);
    if (beltRef.current) ro.observe(beltRef.current);

    window.addEventListener("load", recomputeBounds);
    window.addEventListener("resize", recomputeBounds);

    return () => {
      ro.disconnect();
      window.removeEventListener("load", recomputeBounds);
      window.removeEventListener("resize", recomputeBounds);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, isMobile]);

  return (
    <div className="section-inset">
      <section className="scrollCarousel" style={styleVars} ref={scrollerRef}>
        <div className="scrollCarousel__belt" ref={beltRef}>
          {items.map(({ mobile, desktop }, i) => (
            <div className="scrollCarousel__item" key={i}>
              <picture>
                {desktop && (
                  <source media="(min-width: 720px)" srcSet={desktop} />
                )}
                <img src={mobile || desktop} alt={`Work ${i + 1}`} loading="lazy" />
              </picture>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
