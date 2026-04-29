import React, { useState, useEffect } from 'react';
import Orb from '../../components/orb/Orb';
import ExploreNav from './ExploreNav';
import './ConceptLens.scss';

import img1 from '../../assets/img-hero-carousel/01-Desktop.jpg';
import img2 from '../../assets/img-hero-carousel/03-Desktop.jpg';
import img3 from '../../assets/img-hero-carousel/05-Desktop.jpg';
import img4 from '../../assets/img-hero-carousel/07-Desktop.jpg';

const services = [
  {
    key: 'strategy',
    title: 'Product strategy',
    body: 'Cut through complexity. Pick the things worth building, sequence them, and ship.',
    image: img1,
    tint: '110, 90, 220',
  },
  {
    key: 'design',
    title: 'Product design',
    body: 'Interfaces customers can actually use. Built for the real edge cases of biotech, health, and commerce.',
    image: img2,
    tint: '90, 160, 220',
  },
  {
    key: 'launch',
    title: 'Launch &amp; growth',
    body: 'From first user to scale — designed end to end so the experience grows the business.',
    image: img3,
    tint: '220, 130, 100',
  },
  {
    key: 'venture',
    title: 'New ventures',
    body: 'Working with founders and enterprise teams to launch new products from a blank page.',
    image: img4,
    tint: '170, 220, 140',
  },
];

export default function ConceptLens() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive((a) => (a + 1) % services.length), 4200);
    return () => clearInterval(id);
  }, []);

  const s = services[active];

  return (
    <div className="concept concept--lens">
      <ExploreNav current="lens" />

      <main className="lens__grid">
        <section className="lens__copy">
          <div className="lens__eyebrow">Obsidian</div>

          <h1 className="lens__head">
            I help teams build things&nbsp;
            <span className="lens__head-em">people can actually use.</span>
          </h1>

          <p className="lens__lede">
            A one-person practice in design and product strategy for complex
            software — biotech, health tech, and commerce. Often with founders.
            Sometimes with enterprise teams launching something new.
          </p>

          <ul className="lens__list">
            {services.map((svc, i) => (
              <li
                key={svc.key}
                className={`lens__item ${i === active ? 'is-active' : ''}`}
                onMouseEnter={() => setActive(i)}
              >
                <span className="lens__num">0{i + 1}</span>
                <span className="lens__title" dangerouslySetInnerHTML={{ __html: svc.title }} />
                <span className="lens__body" dangerouslySetInnerHTML={{ __html: svc.body }} />
              </li>
            ))}
          </ul>

          <a href="#contact" className="lens__cta">
            Start a conversation <span aria-hidden>→</span>
          </a>
        </section>

        <section className="lens__stage">
          <div className="lens__orb-wrap">
            {services.map((svc, i) => (
              <div
                key={svc.key}
                className={`lens__orb-frame ${i === active ? 'is-active' : ''}`}
              >
                <Orb
                  size="min(60vmin, 560px)"
                  variant="glass"
                  imageSrc={svc.image}
                  tint={svc.tint}
                />
              </div>
            ))}
          </div>

          <div className="lens__caption">
            <div className="lens__caption-label">Now showing</div>
            <div
              className="lens__caption-title"
              dangerouslySetInnerHTML={{ __html: s.title }}
            />
          </div>
        </section>
      </main>
    </div>
  );
}
