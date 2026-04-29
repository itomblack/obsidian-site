import React from 'react';
import { Link } from 'react-router-dom';
import './ExploreNav.scss';

const concepts = [
  { key: 'monolith', label: '01 — Monolith' },
  { key: 'constellation', label: '02 — Constellation' },
  { key: 'lens', label: '03 — Lens' },
  { key: 'triptych', label: '04 — Triptych' },
];

export default function ExploreNav({ current }) {
  return (
    <nav className="explore-nav" aria-label="Concept variations">
      <Link to="/explore" className="explore-nav__home">Obsidian / Explorations</Link>
      <ul className="explore-nav__list">
        {concepts.map((c) => (
          <li key={c.key}>
            <Link
              to={`/explore/${c.key}`}
              className={`explore-nav__item ${current === c.key ? 'is-active' : ''}`}
            >
              {c.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
