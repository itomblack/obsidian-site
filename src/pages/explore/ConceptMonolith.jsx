import React from 'react';
import Orb from '../../components/orb/Orb';
import ExploreNav from './ExploreNav';
import './ConceptMonolith.scss';

export default function ConceptMonolith() {
  return (
    <div className="concept concept--monolith">
      <ExploreNav current="monolith" />

      <main className="monolith__stage">
        <div className="monolith__eyebrow">Obsidian — Design &amp; Product Strategy</div>

        <div className="monolith__orb-wrap">
          <Orb size="min(72vmin, 720px)" variant="obsidian" />
          <div className="monolith__halo" aria-hidden="true" />
        </div>

        <h1 className="monolith__headline">
          Complex products,<br />
          <em>made obvious.</em>
        </h1>

        <p className="monolith__sub">
          Design and product strategy for teams building in biotech, health tech,
          and commerce. I help you launch experiences customers can actually use —
          and that grow the business.
        </p>

        <div className="monolith__cta">
          <a href="#contact" className="monolith__btn">Start a project</a>
          <a href="#work" className="monolith__btn monolith__btn--ghost">Selected work</a>
        </div>
      </main>
    </div>
  );
}
