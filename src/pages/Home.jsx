import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SectionLabel } from '../components/obsidian/Primitives';
import AmbientGrid from '../components/obsidian/AmbientGrid';
import HeroSlider from '../components/obsidian/HeroSlider';
import TestimonialCarousel from '../components/obsidian/TestimonialCarousel';
import ServicesList from '../components/obsidian/ServicesList';
import ContactArch from '../components/obsidian/ContactArch';
import '../components/obsidian/Obsidian.scss';
import '../components/obsidian/HeroSlider.scss';

export default function Home() {
  return (
    <main className="obsidian-site obsidian-site--hero-slider">
      <a className="skip-link" href="#work">Skip to work</a>
      <AmbientGrid />

      <header className="home-hero">
        <nav className="home-nav" aria-label="Primary navigation">
          <a href="#work">Work <span aria-hidden="true"><ArrowRight size={14} strokeWidth={1.5} focusable="false" /></span></a>
          <a href="#reviews">Reviews <span aria-hidden="true"><ArrowRight size={14} strokeWidth={1.5} focusable="false" /></span></a>
          <a href="#contact">Contact <span aria-hidden="true"><ArrowRight size={14} strokeWidth={1.5} focusable="false" /></span></a>
        </nav>
        <div className="home-hero__content">
          <div className="home-hero__copy">
            <SectionLabel>The Obsidian Lab</SectionLabel>
            <h1 className="type-display home-hero__title">
              Growth Design for <span>Consumer Brands.</span>
            </h1>
          </div>
          <p className="home-hero__description">
            For brand-led, research-backed, data-driven design, that's built to convert customers and build your business.
          </p>
        </div>
      </header>

      <HeroSlider />
      <TestimonialCarousel />
      <ServicesList />
      <ContactArch />

      <Link className="design-system-link" to="/design-system">
        Design system
      </Link>
    </main>
  );
}
