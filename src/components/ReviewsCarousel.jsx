import React, { useEffect, useMemo, useRef, useState } from 'react';
import './ReviewsCarousel.scss';

// Simple example reviews; replace with your real content or props
const DEFAULT_REVIEWS = [
  {
    quote: "I'd recommend Ian without hesitation to any prospective client.",
    author: 'Aaron Esmailian',
    title: 'Head of Growth @ birddogs',
  },
  {
    quote: 'Once you work with Ian, you will want to go back again and again.',
    author: 'Eli Halliwell',
    title: 'Founder of Hairstory',
  },
  {
    quote: 'Exceptional at blending brand and performance. Our KPIs moved fast.',
    author: 'Jess Lee',
    title: 'VP eComm @ Acme Co',
  },
  {
    quote: 'A true partner who cares about outcomes, not just deliverables.',
    author: 'Maya Gupta',
    title: 'COO @ Driftwood',
  },
  {
    quote: 'The best design-to-impact translation I have seen in years.',
    author: 'Victor Chen',
    title: 'GM DTC @ Northstar',
  },
  {
    quote: 'Velocity without sacrificing craft. Highly recommended.',
    author: 'Lauren Park',
    title: 'Director @ Bluebird',
  },
];

export default function ReviewsCarousel({ reviews = DEFAULT_REVIEWS }) {
  const scrollerRef = useRef(null);
  const beltRef = useRef(null);
  const slideRefs = useRef([]);
  const [idx, setIdx] = useState(0); // this is within the DISPLAY array (with clones)
  // We don't block interactions while animating; browsers can retarget transitions smoothly.
  const CLONES = 2; // how many slides cloned to each side

  // Build display list with clones so we can loop seamlessly
  const slides = useMemo(() => {
    const src = reviews.slice();
    const head = src.slice(0, CLONES);
    const tail = src.slice(-CLONES);
    return [...tail, ...src, ...head];
  }, [reviews]);

  // Initialize index to first real slide after initial render
  useEffect(() => {
    setIdx(CLONES);
  }, [slides.length]);

  // Helper to compute and apply transform for a target index
  const applyTransform = (targetIndex, withTransition = true) => {
    const belt = beltRef.current;
    const targetEl = slideRefs.current[targetIndex];
    const scroller = scrollerRef.current;
    if (!belt || !targetEl || !scroller) return;

    if (withTransition) {
      belt.style.transition = 'transform 400ms cubic-bezier(.22,.61,.36,1)';
    } else {
      belt.style.transition = 'none';
    }

    // Center the target slide in the scroller so neighbors peek on both sides
    const left = targetEl.offsetLeft;
    const centerOffset = (scroller.clientWidth - targetEl.offsetWidth) / 2;
    const tx = Math.max(0, left - Math.max(0, centerOffset));
    belt.style.transform = `translate3d(${-tx}px, 0, 0)`;
  };

  // Re-apply transform when index changes
  useEffect(() => {
    applyTransform(idx, true);
  }, [idx]);

  // After transition ends, if we are on a clone, jump to its counterpart without animation
  useEffect(() => {
    const belt = beltRef.current;
    if (!belt) return;

    const onEnd = () => {
      const realLen = reviews.length;
      if (realLen === 0) return;

      if (idx < CLONES) {
        const next = idx + realLen;
        applyTransform(next, false);
        setIdx(next);
      } else if (idx >= CLONES + realLen) {
        const next = idx - realLen;
        applyTransform(next, false);
        setIdx(next);
      }
    };

    belt.addEventListener('transitionend', onEnd);
    return () => belt.removeEventListener('transitionend', onEnd);
  }, [idx, reviews.length]);

  // Resize observer to keep alignment when sizes change
  useEffect(() => {
    const scroller = scrollerRef.current;
    const belt = beltRef.current;
    if (!scroller || !belt) return;
    const ro = new ResizeObserver(() => applyTransform(idx, false));
    ro.observe(scroller);
    ro.observe(belt);
    return () => ro.disconnect();
  }, [idx]);

  const goTo = (nextIndex) => {
    setIdx(nextIndex);
  };
  const prev = () => goTo(idx - 1);
  const next = () => goTo(idx + 1);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [idx]);

  // Pointer swipe handling (pointer events cover mouse + touch in modern browsers)
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    let startX = 0;
    let dragging = false;
    let lastDx = 0;

    const onDown = (e) => {
      dragging = true;
      startX = e.clientX;
      lastDx = 0;
    };
    const onMove = (e) => {
      if (!dragging) return;
      lastDx = e.clientX - startX;
    };
    const onUp = () => {
      if (!dragging) return;
      dragging = false;
      if (Math.abs(lastDx) > 40) {
        if (lastDx < 0) next();
        else prev();
      }
      lastDx = 0;
    };

    scroller.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      scroller.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [idx]);

  // Allow clicking neighbor cards to move
  const onCardClick = (displayIndex) => {
    if (displayIndex === idx - 1) prev();
    else if (displayIndex === idx + 1) next();
  };

  return (
    <section className="section-inset reviews">
      <div className="reviews__header">
        <h2 className="reviews__title">Reviews<span className="dot">.</span></h2>
        <div className="reviews__controls">
          <button className="reviews__arrow" aria-label="Previous" onClick={prev}>
            <span aria-hidden>‹</span>
          </button>
          <button className="reviews__arrow" aria-label="Next" onClick={next}>
            <span aria-hidden>›</span>
          </button>
        </div>
      </div>

      <div className="reviewsCarousel" ref={scrollerRef}>
        <div className="reviewsCarousel__belt" ref={beltRef}>
          {slides.map((r, i) => (
            <article
              className={
                'reviewCard' + (i === idx ? ' is-active' : i === idx - 1 || i === idx + 1 ? ' is-near' : '')
              }
              key={i}
              ref={(el) => (slideRefs.current[i] = el)}
              onClick={() => onCardClick(i)}
            >
              <div className="reviewCard__quoteMark">“</div>
              <blockquote className="reviewCard__quote">{r.quote}</blockquote>
              <div className="reviewCard__meta">
                <div className="reviewCard__author">{r.author}</div>
                <div className="reviewCard__title">{r.title}</div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
