import React from 'react';
import Orb from '../../components/orb/Orb';
import ExploreNav from './ExploreNav';
import './ConceptConstellation.scss';

import img1 from '../../assets/img-hero-carousel/01-Desktop.jpg';
import img2 from '../../assets/img-hero-carousel/02-Desktop.jpg';
import img3 from '../../assets/img-hero-carousel/03-Desktop.jpg';
import img4 from '../../assets/img-hero-carousel/04-Desktop.jpg';
import img5 from '../../assets/img-hero-carousel/05-Desktop.jpg';
import img6 from '../../assets/img-hero-carousel/06-Desktop.jpg';
import img7 from '../../assets/img-hero-carousel/07-Desktop.jpg';

const projects = [
  { img: img1, label: 'Helix', sub: 'Biotech · Platform UX' },
  { img: img2, label: 'Vital', sub: 'Health Tech · Mobile' },
  { img: img3, label: 'Cellar', sub: 'Commerce · Brand & site' },
  { img: img4, label: 'Northwind', sub: 'Enterprise · New venture' },
  { img: img5, label: 'Atlas', sub: 'Health Tech · Strategy' },
  { img: img6, label: 'Forge', sub: 'Biotech · Lab tools' },
  { img: img7, label: 'Murmur', sub: 'Commerce · Loyalty' },
];

export default function ConceptConstellation() {
  return (
    <div className="concept concept--constellation">
      <ExploreNav current="constellation" />

      <header className="constellation__intro">
        <div className="constellation__eyebrow">Obsidian</div>
        <h1>A studio practice for<br />complex software.</h1>
        <p>
          Selected work across biotech, health tech, and commerce — each one
          a different problem, a different audience, the same craft.
        </p>
      </header>

      <section className="constellation__field">
        {projects.map((p, i) => (
          <div
            key={p.label}
            className={`constellation__slot constellation__slot--${i + 1}`}
            style={{ animationDelay: `${i * 0.6}s` }}
          >
            <Orb
              size="100%"
              variant="glass"
              imageSrc={p.img}
              label={p.label}
              caption={p.sub}
              interactive
            />
          </div>
        ))}

        <div className="constellation__center">
          <Orb size="100%" variant="wireframe" interactive>
            <div className="constellation__center-cta">Start a project</div>
          </Orb>
        </div>
      </section>

      <footer className="constellation__foot">
        <span>Currently taking projects for Q3 →</span>
      </footer>
    </div>
  );
}
