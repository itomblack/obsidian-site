import React, { useEffect, useRef, useState } from 'react';
import maven640 from '../../assets/photos/optimized/maven-640.jpg';
import maven960 from '../../assets/photos/optimized/maven-960.jpg';
import maven1440 from '../../assets/photos/optimized/maven-1440.jpg';
import maven2200 from '../../assets/photos/optimized/maven-2200.jpg';
import counter640 from '../../assets/photos/optimized/counter-640.jpg';
import counter960 from '../../assets/photos/optimized/counter-960.jpg';
import counter1440 from '../../assets/photos/optimized/counter-1440.jpg';
import counter2200 from '../../assets/photos/optimized/counter-2200.jpg';
import ledger640 from '../../assets/photos/optimized/ledger-640.jpg';
import ledger960 from '../../assets/photos/optimized/ledger-960.jpg';
import ledger1440 from '../../assets/photos/optimized/ledger-1440.jpg';
import ledger2200 from '../../assets/photos/optimized/ledger-2200.jpg';
import lululemon640 from '../../assets/photos/optimized/lululemon-640.jpg';
import lululemon960 from '../../assets/photos/optimized/lululemon-960.jpg';
import lululemon1440 from '../../assets/photos/optimized/lululemon-1440.jpg';
import lululemon2200 from '../../assets/photos/optimized/lululemon-2200.jpg';

const projectImageSizes = '(max-width: 767px) 100vw, (max-width: 1199px) 94vw, 86vw';

export const projects = [
  {
    name: 'Maven Clinic',
    category: 'Consumer launch',
    summary: "Zero-to-one launch of a new consumer business arm for this $1.7 billion-dollar women's health-tech brand.",
    image: maven960,
    imageSrcSet: `${maven640} 640w, ${maven960} 960w, ${maven1440} 1440w, ${maven2200} 2200w`,
  },
  {
    name: 'Counter',
    category: 'Commerce transformation',
    summary: 'Designed a best-in-class ecommerce experience, and affiliate sales dashboard for the relaunch of this pioneering American beauty brand.',
    image: counter960,
    imageSrcSet: `${counter640} 640w, ${counter960} 960w, ${counter1440} 1440w, ${counter2200} 2200w`,
  },
  {
    name: 'Ledger.',
    category: 'Digital product',
    summary: 'A $12.7 million increase in forecasted annual revenue, plus a new major hardware product launch for this French Crypto Unicorn.',
    image: ledger960,
    imageSrcSet: `${ledger640} 640w, ${ledger960} 960w, ${ledger1440} 1440w, ${ledger2200} 2200w`,
  },
  {
    name: 'Lululemon',
    category: 'Commerce evolution',
    summary: 'Grew online conversion rate by 83% for this billion-dollar athleisure brand across 12 international regions.',
    image: lululemon960,
    imageSrcSet: `${lululemon640} 640w, ${lululemon960} 960w, ${lululemon1440} 1440w, ${lululemon2200} 2200w`,
  },
];

export function ProjectCard({ project, index, isScrollActive, isMobileVisible, cardRef }) {
  return (
    <article
      ref={cardRef}
      className={`project-card project-card--${index + 1}${isScrollActive ? ' is-scroll-active' : ''}${isMobileVisible ? ' is-mobile-visible' : ''}`}
      data-project-index={index}
      tabIndex={0}
    >
      <div className="project-card__media">
        <img
          src={project.image}
          srcSet={project.imageSrcSet}
          sizes={projectImageSizes}
          width="960"
          height="720"
          loading={index === 0 ? 'eager' : 'lazy'}
          decoding="async"
          alt={`${project.name} product experience`}
        />
      </div>
      <div className="project-card__copy">
        <h2 className="type-title">{project.name}</h2>
        <p className="type-body">{project.summary}</p>
      </div>
    </article>
  );
}

export default function ProjectGallery({ id }) {
  const cardRefs = useRef([]);
  const [activeProject, setActiveProject] = useState(null);
  const [mobileMotionReady, setMobileMotionReady] = useState(false);
  const [mobileVisibleProjects, setMobileVisibleProjects] = useState([]);

  useEffect(() => {
    const desktopQuery = window.matchMedia('(min-width: 1000px)');
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;

    const clearScrollStyles = () => {
      cardRefs.current.forEach((card) => {
        if (!card) return;
        card.style.removeProperty('--project-reveal');
        card.style.removeProperty('--project-reveal-offset');
        card.style.removeProperty('--project-copy-x');
        card.style.removeProperty('--project-image-scale');
        card.style.removeProperty('--project-image-brightness');
        card.style.removeProperty('--project-image-saturation');
      });
    };

    const updateActiveProject = () => {
      frame = 0;

      if (!desktopQuery.matches || reducedMotionQuery.matches) {
        clearScrollStyles();
        setActiveProject((current) => (current === null ? current : null));
        return;
      }

      const viewportCenter = window.innerHeight / 2;
      const revealStart = window.innerHeight * 0.68;
      const fullRevealRadius = window.innerHeight * 0.16;
      const gridContent = document.querySelector('.home-hero__content');
      const gridColumn = (gridContent ? gridContent.getBoundingClientRect().width : window.innerWidth) / 5;
      let centeredProject = null;
      let strongestReveal = 0;

      cardRefs.current.forEach((card, index) => {
        if (!card) return;
        const bounds = card.getBoundingClientRect();
        const cardCenter = bounds.top + (bounds.height / 2);
        const distance = Math.abs(cardCenter - viewportCenter);
        const rawReveal = 1 - ((distance - fullRevealRadius) / (revealStart - fullRevealRadius));
        const clampedReveal = Math.min(1, Math.max(0, rawReveal));
        const reveal = clampedReveal * clampedReveal * clampedReveal
          * ((clampedReveal * ((clampedReveal * 6) - 15)) + 10);
        const copyDirection = index % 2 === 0 ? -1 : 1;

        card.style.setProperty('--project-reveal', reveal.toFixed(4));
        card.style.setProperty('--project-reveal-offset', `${(gridColumn * 2 * reveal).toFixed(2)}px`);
        card.style.setProperty('--project-copy-x', `${(copyDirection * 52 * (1 - reveal)).toFixed(2)}px`);
        card.style.setProperty('--project-image-scale', (1.002 + (0.016 * reveal)).toFixed(4));
        card.style.setProperty('--project-image-brightness', (1 - (0.1 * reveal)).toFixed(4));
        card.style.setProperty('--project-image-saturation', (1 - (0.06 * reveal)).toFixed(4));

        if (reveal > strongestReveal) {
          strongestReveal = reveal;
          centeredProject = index;
        }
      });

      if (strongestReveal < 0.94) centeredProject = null;
      setActiveProject((current) => (current === centeredProject ? current : centeredProject));
    };

    const queueUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateActiveProject);
    };

    updateActiveProject();
    window.addEventListener('scroll', queueUpdate, { passive: true });
    window.addEventListener('resize', queueUpdate);
    desktopQuery.addEventListener('change', queueUpdate);
    reducedMotionQuery.addEventListener('change', queueUpdate);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      clearScrollStyles();
      window.removeEventListener('scroll', queueUpdate);
      window.removeEventListener('resize', queueUpdate);
      desktopQuery.removeEventListener('change', queueUpdate);
      reducedMotionQuery.removeEventListener('change', queueUpdate);
    };
  }, []);

  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 767px)');
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let observer = null;
    let motionFrame = 0;
    let observeFrame = 0;

    const cancelPendingObservation = () => {
      if (motionFrame) window.cancelAnimationFrame(motionFrame);
      if (observeFrame) window.cancelAnimationFrame(observeFrame);
      motionFrame = 0;
      observeFrame = 0;
    };

    const setupMobileMotion = () => {
      cancelPendingObservation();
      if (observer) observer.disconnect();

      const enabled = mobileQuery.matches && !reducedMotionQuery.matches;
      setMobileMotionReady(enabled);

      if (!enabled) {
        setMobileVisibleProjects([]);
        return;
      }

      setMobileVisibleProjects([]);

      observer = new window.IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const index = Number(entry.target.getAttribute('data-project-index'));

          setMobileVisibleProjects((current) => (
            current.includes(index) ? current : [...current, index]
          ));
          observer.unobserve(entry.target);
        });
      }, {
        rootMargin: '0px 0px -8% 0px',
        threshold: 0.16,
      });

      // Let the offset state paint before observing so the first project
      // visibly animates on page load instead of appearing already settled.
      motionFrame = window.requestAnimationFrame(() => {
        observeFrame = window.requestAnimationFrame(() => {
          cardRefs.current.forEach((card) => {
            if (card) observer.observe(card);
          });
        });
      });
    };

    setupMobileMotion();
    mobileQuery.addEventListener('change', setupMobileMotion);
    reducedMotionQuery.addEventListener('change', setupMobileMotion);

    return () => {
      cancelPendingObservation();
      if (observer) observer.disconnect();
      mobileQuery.removeEventListener('change', setupMobileMotion);
      reducedMotionQuery.removeEventListener('change', setupMobileMotion);
    };
  }, []);

  return (
    <section className="projects" id={id} aria-label="Selected work">
      <div className={`project-gallery${mobileMotionReady ? ' is-mobile-motion-ready' : ''}`}>
        {projects.map((project, index) => (
          <ProjectCard
            key={project.name}
            project={project}
            index={index}
            isScrollActive={activeProject === index}
            isMobileVisible={mobileVisibleProjects.includes(index)}
            cardRef={(card) => { cardRefs.current[index] = card; }}
          />
        ))}
      </div>
    </section>
  );
}
