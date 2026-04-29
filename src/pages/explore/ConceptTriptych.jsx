import React from 'react';
import Orb from '../../components/orb/Orb';
import ExploreNav from './ExploreNav';
import './ConceptTriptych.scss';

import imgBio from '../../assets/img-hero-carousel/02-Desktop.jpg';
import imgHealth from '../../assets/img-hero-carousel/05-Desktop.jpg';
import imgCommerce from '../../assets/img-hero-carousel/07-Desktop.jpg';

const sectors = [
  {
    key: 'biotech',
    label: 'Biotech',
    title: 'For science teams',
    body: 'Lab tools, platforms, and data products that fit how scientists actually work.',
    image: imgBio,
    tint: '120, 200, 200',
  },
  {
    key: 'health',
    label: 'Health Tech',
    title: 'For patients & clinicians',
    body: 'Care experiences across consumer apps, clinical workflows, and the systems behind them.',
    image: imgHealth,
    tint: '180, 140, 240',
  },
  {
    key: 'commerce',
    label: 'Commerce',
    title: 'For brands that sell',
    body: 'Storefronts, post-purchase, and merchandising that move customers — and revenue.',
    image: imgCommerce,
    tint: '240, 180, 130',
  },
];

export default function ConceptTriptych() {
  return (
    <div className="concept concept--triptych">
      <ExploreNav current="triptych" />

      <header className="triptych__intro">
        <div className="triptych__eyebrow">Obsidian — Design &amp; Product Strategy</div>
        <h1>
          Three industries.<br />
          <em>One discipline.</em>
        </h1>
        <p>
          A one-person practice helping teams build complex software customers can
          actually use — and that grows the business. Pick the world you live in.
        </p>
      </header>

      <section className="triptych__row">
        {sectors.map((s, i) => (
          <a key={s.key} href={`#${s.key}`} className="triptych__col" style={{ animationDelay: `${i * 0.6}s` }}>
            <Orb
              size="min(34vmin, 360px)"
              variant="glass"
              imageSrc={s.image}
              tint={s.tint}
              interactive
            />
            <div className="triptych__meta">
              <div className="triptych__label">{s.label}</div>
              <div className="triptych__title">{s.title}</div>
              <p className="triptych__body">{s.body}</p>
              <span className="triptych__more">See selected work →</span>
            </div>
          </a>
        ))}
      </section>

      <footer className="triptych__foot">
        <div className="triptych__foot-left">Currently taking projects for Q3 →</div>
        <a href="#contact" className="triptych__cta">Start a conversation</a>
      </footer>
    </div>
  );
}
