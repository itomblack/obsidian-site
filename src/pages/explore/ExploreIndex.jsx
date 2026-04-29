import React from 'react';
import { Link } from 'react-router-dom';
import Orb from '../../components/orb/Orb';
import './ExploreIndex.scss';

import img1 from '../../assets/img-hero-carousel/01-Desktop.jpg';
import img2 from '../../assets/img-hero-carousel/04-Desktop.jpg';
import img3 from '../../assets/img-hero-carousel/06-Desktop.jpg';

const concepts = [
  {
    key: 'monolith',
    number: '01',
    title: 'Monolith',
    pitch: 'A single, monumental obsidian orb. Editorial type. Quiet.',
    note: 'Best when the brand needs to feel inevitable.',
    preview: { variant: 'obsidian' },
  },
  {
    key: 'constellation',
    number: '02',
    title: 'Constellation',
    pitch: 'A field of project orbs around a central CTA orb.',
    note: 'Work-forward. Lets the portfolio do the talking.',
    preview: { variant: 'glass', imageSrc: img1 },
  },
  {
    key: 'lens',
    number: '03',
    title: 'Lens',
    pitch: 'Editorial copy on the left, an orb-as-lens on the right that swaps with each service.',
    note: 'Strong positioning, narrative flow.',
    preview: { variant: 'glass', imageSrc: img2, tint: '110, 90, 220' },
  },
  {
    key: 'triptych',
    number: '04',
    title: 'Triptych',
    pitch: 'Three orbs, one per industry — biotech, health tech, commerce.',
    note: 'Lets visitors self-select by sector.',
    preview: { variant: 'glass', imageSrc: img3, tint: '180, 140, 240' },
  },
];

export default function ExploreIndex() {
  return (
    <div className="explore-index">
      <header className="explore-index__head">
        <div className="explore-index__eyebrow">Obsidian — Landing explorations</div>
        <h1>Four ways to start the story.</h1>
        <p>
          Same brand, same positioning — different doors in. Click a concept to
          preview it. The orb belongs to Obsidian; the rest can be tuned.
        </p>
      </header>

      <ul className="explore-index__grid">
        {concepts.map((c) => (
          <li key={c.key}>
            <Link to={`/explore/${c.key}`} className="explore-card">
              <div className="explore-card__orb">
                <Orb size="100%" interactive {...c.preview} />
              </div>
              <div className="explore-card__meta">
                <div className="explore-card__num">{c.number}</div>
                <div className="explore-card__title">{c.title}</div>
                <p className="explore-card__pitch">{c.pitch}</p>
                <div className="explore-card__note">{c.note}</div>
                <span className="explore-card__cta">View concept →</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <footer className="explore-index__foot">
        <Link to="/">← Back to current site</Link>
      </footer>
    </div>
  );
}
