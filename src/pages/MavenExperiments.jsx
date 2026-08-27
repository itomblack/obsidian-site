import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import mavenImage from '../assets/photos/optimized/maven-2200.jpg';
import { mavenStory } from '../data/mavenStory';
import './MavenExperiments.scss';

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

function CardCopy({ card }) {
  return (
    <div className="maven-copy">
      <p className="maven-copy__kicker">{card.kicker}</p>
      <h1>{card.title}</h1>
      <div className="maven-copy__body">
        {card.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      </div>
      {card.attribution && <p className="maven-copy__attribution">{card.attribution}</p>}
    </div>
  );
}

function useDeckControls(max = mavenStory.length - 1) {
  const [active, setActive] = useState(0);
  const touchStart = useRef(null);
  const go = useCallback((next) => setActive((current) => (
    clamp(typeof next === 'function' ? next(current) : next, 0, max)
  )), [max]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'ArrowRight' || event.key === ' ') go((current) => current + 1);
      if (event.key === 'ArrowLeft') go((current) => current - 1);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [go]);

  const swipe = {
    onTouchStart: (event) => { touchStart.current = event.touches[0].clientX; },
    onTouchEnd: (event) => {
      if (touchStart.current === null) return;
      const delta = event.changedTouches[0].clientX - touchStart.current;
      if (Math.abs(delta) > 45) go((current) => current + (delta < 0 ? 1 : -1));
      touchStart.current = null;
    },
  };

  return { active, go, swipe };
}

function DeckProgress({ active, total, onSelect }) {
  return (
    <div className="deck-progress" aria-label={`Story progress: ${active + 1} of ${total}`}>
      {Array.from({ length: total }, (_, index) => (
        <button
          key={index}
          type="button"
          className={index <= active ? 'is-complete' : ''}
          onClick={() => onSelect(index)}
          aria-label={`Go to story card ${index + 1}`}
        ><span /></button>
      ))}
    </div>
  );
}

function StoryDeck() {
  const { active, go, swipe } = useDeckControls();
  const card = mavenStory[active];
  const isLast = active === mavenStory.length - 1;

  return (
    <section className="story-deck" aria-label="Maven case study" {...swipe}>
      <DeckProgress active={active} total={mavenStory.length} onSelect={go} />

      <div className="story-deck__stage">
        <figure className="story-deck__photo" key={`photo-${active}`}>
          <img src={mavenImage} alt="Maven consumer-health product experience" />
        </figure>
        <article className="story-deck__copy" key={`copy-${active}`}>
          <CardCopy card={card} />
        </article>
      </div>

      <nav className="deck-actions" aria-label="Story navigation">
        <button
          className="deck-actions__previous"
          type="button"
          onClick={() => go(active - 1)}
          disabled={active === 0}
          aria-label="Previous story card"
        >
          <ArrowLeft size={18} strokeWidth={1.8} aria-hidden="true" />
        </button>
        <button
          className="deck-actions__next"
          type="button"
          onClick={() => go(active + 1)}
          disabled={isLast}
        >
          {isLast ? 'End of story' : 'Next'}
        </button>
      </nav>
    </section>
  );
}

export default function MavenExperiments() {
  return (
    <main className="maven-experiments">
      <header className="experiment-header">
        <Link to="/">The Obsidian Lab</Link>
        <p>Maven case study</p>
      </header>
      <StoryDeck />
    </main>
  );
}
