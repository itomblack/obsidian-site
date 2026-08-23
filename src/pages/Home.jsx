import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { SectionLabel } from '../components/obsidian/Primitives';
import AmbientGrid from '../components/obsidian/AmbientGrid';
import ProjectGallery from '../components/obsidian/ProjectGallery';
import TestimonialCarousel from '../components/obsidian/TestimonialCarousel';
import ServicesList from '../components/obsidian/ServicesList';
import ContactArch from '../components/obsidian/ContactArch';
import '../components/obsidian/Obsidian.scss';

export default function Home() {
  const heroRef = useRef(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return undefined;

    let frame = null;

    const updateHeroLight = () => {
      frame = null;
      const progress = Math.min(1, Math.max(0, window.scrollY / (hero.offsetHeight * 0.88)));
      hero.style.setProperty('--hero-soft-light-x', `${76 - (progress * 42)}%`);
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(updateHeroLight);
    };

    updateHeroLight();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <main className="obsidian-site">
      <a className="skip-link" href="#work">Skip to work</a>
      <AmbientGrid />

      <header className="home-hero" ref={heroRef}>
        <nav className="home-nav" aria-label="Primary navigation">
          <a href="#work">Work <span aria-hidden="true">→</span></a>
          <a href="#reviews">Reviews <span aria-hidden="true">→</span></a>
          <a href="#contact">Contact <span aria-hidden="true">→</span></a>
        </nav>
        <div className="home-hero__content">
          <div className="home-hero__copy">
            <SectionLabel>The Obsidian Lab</SectionLabel>
            <h1 className="type-display home-hero__title">
              Growth Design for <em>Consumer Brands.</em>
            </h1>
          </div>
        </div>
      </header>

      <ProjectGallery id="work" />
      <TestimonialCarousel />
      <ServicesList />
      <ContactArch />

      <Link className="design-system-link" to="/design-system">
        Design system
      </Link>
    </main>
  );
}
