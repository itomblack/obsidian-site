import React from 'react';
import { Link } from 'react-router-dom';
import { BrandMark, PillButton, SectionLabel } from '../components/obsidian/Primitives';
import { ProjectCard, projects } from '../components/obsidian/ProjectGallery';
import { ClientLogoRail } from '../components/obsidian/TestimonialCarousel';
import { ServiceRow, services } from '../components/obsidian/ServicesList';
import '../components/obsidian/Obsidian.scss';
import './DesignSystem.scss';

const colors = [
  ['Ink', '#080808', 'Primary background and dark controls'],
  ['Stone', '#CDD0C5', 'Primary light surface'],
  ['Paper', '#F0F0EE', 'High-emphasis light text'],
  ['White', '#FFFFFF', 'Focused text and marks'],
  ['Sage', '#5C8A7E', 'Service numbering and quiet accents'],
  ['Sand', '#C8B195', 'Warm editorial accent'],
];

export default function DesignSystem() {
  return (
    <main className="design-system">
      <nav className="design-system__nav">
        <Link to="/">← Home</Link>
        <span>Obsidian / 2026</span>
      </nav>

      <header className="design-system__hero">
        <BrandMark size="large" />
        <SectionLabel>Design system</SectionLabel>
        <h1 className="type-display">Built on a grid.<br /><em>Shaped by light.</em></h1>
        <p className="type-body">A bold editorial system for premium, high-performance consumer experiences.</p>
      </header>

      <section className="ds-section">
        <SectionLabel as="h2">01 / Foundations</SectionLabel>
        <article className="ds-grid-foundation">
          <p className="ds-meta">Responsive grid / five columns</p>
          <div className="ds-grid-specimen" aria-label="Five-column page grid">
            {Array.from({ length: 5 }, (_, index) => <span key={index} />)}
          </div>
        </article>
        <div className="ds-colors">
          {colors.map(([name, value, usage]) => (
            <article className="ds-color" key={name}>
              <div className="ds-color__swatch" style={{ background: value }} />
              <div>
                <h3>{name}</h3>
                <p>{value}</p>
                <span>{usage}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="ds-section">
        <SectionLabel as="h2">02 / Typography</SectionLabel>
        <div className="ds-type-specimens">
          <article>
            <p className="ds-meta">Hero / Instrument Serif / 64–112</p>
            <p className="type-display">Growth Design for <em>Consumer Brands.</em></p>
          </article>
          <article>
            <p className="ds-meta">Title / Instrument Serif / 32–43</p>
            <p className="type-title">Luxury aesthetics meet high-performance usability.</p>
          </article>
          <article>
            <p className="ds-meta">Quote / Instrument Serif / 30–43</p>
            <p className="type-quote">“Simple, clean, user-centered experiences.”</p>
          </article>
          <article>
            <p className="ds-meta">Label / Fragment Mono / 12</p>
            <p className="type-label">The Obsidian Lab · Working everywhere</p>
          </article>
          <article>
            <p className="ds-meta">Body / Inter Light / 16</p>
            <p className="type-body">Clear, measured language supports the expressive serif and keeps product thinking legible.</p>
          </article>
        </div>
      </section>

      <section className="ds-section">
        <SectionLabel as="h2">03 / Core components</SectionLabel>
        <div className="ds-components">
          <article className="ds-component ds-component--buttons">
            <p className="ds-meta">Pill button</p>
            <div className="ds-button-showcase">
              <div className="ds-button-showcase__dark">
                <PillButton href="#components" tone="light">Introduce yourself</PillButton>
              </div>
              <div className="ds-button-showcase__light">
                <PillButton href="#components">View project</PillButton>
              </div>
            </div>
          </article>

          <article className="ds-component">
            <p className="ds-meta">Client logo rail</p>
            <ClientLogoRail />
          </article>

          <article className="ds-component ds-component--service">
            <p className="ds-meta">Service row</p>
            <ServiceRow service={services[1]} index={1} />
          </article>

          <article className="ds-component ds-component--project" id="components">
            <p className="ds-meta">Project row / grid pullback</p>
            <ProjectCard project={projects[1]} index={1} />
          </article>
        </div>
      </section>

      <footer className="design-system__footer">
        <BrandMark size="small" />
        <p className="type-label">Built from the Obsidian Web 2026 studies</p>
        <Link to="/">Return home →</Link>
      </footer>
    </main>
  );
}
