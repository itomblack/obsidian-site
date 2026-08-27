import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import mavenImage from '../assets/photos/optimized/maven-2200.jpg';
import MavenLogo from '../assets/brand-logos-v2/Maven.svg';
import { mavenChapters, mavenStory, storyVariants } from '../data/mavenStory';
import './MavenExperiments.scss';

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

function CardCopy({ card, index, compact = false }) {
  return (
    <div className={`maven-copy${compact ? ' maven-copy--compact' : ''}`}>
      <p className="maven-copy__kicker">{String(index + 1).padStart(2, '0')} / 24 · {card.kicker}</p>
      <h2>{card.title}</h2>
      <div className="maven-copy__body">
        {card.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      </div>
      {card.attribution && <p className="maven-copy__attribution">{card.attribution}</p>}
    </div>
  );
}

function StorySignal({ card, index, mode = 'full' }) {
  const showImage = ['hero', 'launch', 'quote'].includes(card.kind);
  return (
    <div className={`story-signal story-signal--${card.kind} story-signal--${mode}`}>
      {showImage && <img src={mavenImage} alt="Maven consumer-health product experience" />}
      <div className="story-signal__veil" />
      <div className="story-signal__meta">
        <img src={MavenLogo} alt="Maven" />
        <span>{String(index + 1).padStart(2, '0')}</span>
      </div>
      <p className="story-signal__text">{card.signal}</p>
    </div>
  );
}

function VariantNav({ active, onChange }) {
  return (
    <nav className="variant-nav" aria-label="Case study interaction experiments">
      {storyVariants.map((variant) => (
        <button
          key={variant.id}
          type="button"
          className={active === variant.id ? 'is-active' : ''}
          onClick={() => onChange(variant.id)}
          aria-pressed={active === variant.id}
        >
          <span>{variant.number}</span>
          <strong>{variant.label}</strong>
          <small>{variant.note}</small>
        </button>
      ))}
    </nav>
  );
}

function GuidedScroll() {
  const [active, setActive] = useState(0);
  const refs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActive(Number(visible.target.dataset.storyIndex));
    }, { threshold: [0.36, 0.6, 0.8] });

    refs.current.forEach((node) => node && observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="guided-story" aria-label="Guided scroll experiment">
      <div className="guided-story__progress" aria-hidden="true">
        <span style={{ transform: `scaleX(${(active + 1) / mavenStory.length})` }} />
      </div>
      <aside className="guided-story__canvas">
        <StorySignal card={mavenStory[active]} index={active} />
      </aside>
      <div className="guided-story__pages">
        {mavenStory.map((card, index) => (
          <article
            className={`guided-page${index === active ? ' is-active' : ''}`}
            data-story-index={index}
            key={card.title}
            ref={(node) => { refs.current[index] = node; }}
          >
            <div className="guided-page__mobile-signal"><StorySignal card={card} index={index} mode="mobile" /></div>
            <CardCopy card={card} index={index} />
          </article>
        ))}
      </div>
    </section>
  );
}

function useDeckControls(initial = 0, max = mavenStory.length - 1) {
  const [active, setActive] = useState(initial);
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

  return (
    <section className="story-deck" aria-label="Tap-through story deck experiment" {...swipe}>
      <DeckProgress active={active} total={mavenStory.length} onSelect={go} />
      <div className="story-deck__stage">
        <div className="story-deck__signal" key={`signal-${active}`}><StorySignal card={card} index={active} /></div>
        <article className="story-deck__copy" key={`copy-${active}`}><CardCopy card={card} index={active} /></article>
      </div>
      <div className="story-deck__controls">
        <button type="button" onClick={() => go(active - 1)} disabled={active === 0}>Previous</button>
        <p>{active + 1} of {mavenStory.length}</p>
        <button type="button" onClick={() => go(active + 1)} disabled={active === mavenStory.length - 1}>Next</button>
      </div>
    </section>
  );
}

function DocumentarySplit() {
  const [active, setActive] = useState(0);
  const refs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(Number(entry.target.dataset.storyIndex));
      });
    }, { rootMargin: '-38% 0px -48%', threshold: 0 });
    refs.current.forEach((node) => node && observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="documentary" aria-label="Documentary split-screen experiment">
      <aside className="documentary__evidence">
        <p className="documentary__label">Evidence frame · {String(active + 1).padStart(2, '0')}</p>
        <StorySignal card={mavenStory[active]} index={active} />
        <div className="documentary__chapter">
          <span>Now reading</span>
          <strong>{mavenChapters.find((chapter) => active >= chapter.range[0] && active <= chapter.range[1])?.label}</strong>
        </div>
      </aside>
      <div className="documentary__transcript">
        {mavenStory.map((card, index) => (
          <article
            key={card.title}
            className={index === active ? 'is-active' : ''}
            data-story-index={index}
            ref={(node) => { refs.current[index] = node; }}
          >
            <CardCopy card={card} index={index} compact />
          </article>
        ))}
      </div>
    </section>
  );
}

function DirectorsCut() {
  const [chapterIndex, setChapterIndex] = useState(0);
  const chapter = mavenChapters[chapterIndex];
  const cards = useMemo(() => mavenStory.slice(chapter.range[0], chapter.range[1] + 1), [chapter]);
  const { active, go, swipe } = useDeckControls(0, cards.length - 1);

  useEffect(() => { go(0); }, [chapterIndex, go]);

  const globalIndex = chapter.range[0] + active;
  const card = cards[active];

  return (
    <section className="directors-cut" aria-label="Chapter-led director’s cut experiment" {...swipe}>
      <nav className="chapter-nav" aria-label="Story chapters">
        {mavenChapters.map((item, index) => (
          <button
            type="button"
            key={item.id}
            className={index === chapterIndex ? 'is-active' : ''}
            onClick={() => setChapterIndex(index)}
            aria-pressed={index === chapterIndex}
          >
            <span>{item.number}</span>
            <strong>{item.label}</strong>
          </button>
        ))}
      </nav>
      <div className="directors-cut__stage">
        <div className="directors-cut__chapter-title">
          <p>Chapter {chapter.number}</p>
          <h2>{chapter.label}</h2>
        </div>
        <div className="directors-cut__signal" key={`chapter-signal-${globalIndex}`}><StorySignal card={card} index={globalIndex} /></div>
        <article key={`chapter-copy-${globalIndex}`}><CardCopy card={card} index={globalIndex} compact /></article>
      </div>
      <div className="directors-cut__controls">
        <button type="button" onClick={() => go(active - 1)} disabled={active === 0}>Previous beat</button>
        <div>
          {cards.map((item, index) => <span key={item.title} className={index === active ? 'is-active' : ''} />)}
        </div>
        <button type="button" onClick={() => go(active + 1)} disabled={active === cards.length - 1}>Next beat</button>
      </div>
    </section>
  );
}

const experiments = {
  guided: GuidedScroll,
  deck: StoryDeck,
  split: DocumentarySplit,
  chapters: DirectorsCut,
};

export default function MavenExperiments() {
  const params = new URLSearchParams(window.location.search);
  const requested = params.get('variant');
  const [variant, setVariant] = useState(experiments[requested] ? requested : 'guided');
  const Experiment = experiments[variant];

  const chooseVariant = (next) => {
    setVariant(next);
    const url = new URL(window.location.href);
    url.searchParams.set('variant', next);
    window.history.replaceState({}, '', url);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  return (
    <main className={`maven-experiments maven-experiments--${variant}`}>
      <header className="experiment-header">
        <Link to="/">The Obsidian Lab</Link>
        <div>
          <p>Maven case study</p>
          <span>Interaction studies</span>
        </div>
      </header>
      <VariantNav active={variant} onChange={chooseVariant} />
      <Experiment key={variant} />
    </main>
  );
}
