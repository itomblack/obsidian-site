import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Plus, X } from 'lucide-react';
import { projects } from './ProjectGallery';
import counter1_640 from '../../assets/photos/optimized/counter-sequence-01-640.jpg';
import counter1_1440 from '../../assets/photos/optimized/counter-sequence-01-1440.jpg';
import counter1_2200 from '../../assets/photos/optimized/counter-sequence-01-2200.jpg';
import counter1_2880 from '../../assets/photos/optimized/counter-sequence-01-2880.jpg';
import counter2_640 from '../../assets/photos/optimized/counter-sequence-02-640.jpg';
import counter2_1440 from '../../assets/photos/optimized/counter-sequence-02-1440.jpg';
import counter2_2200 from '../../assets/photos/optimized/counter-sequence-02-2200.jpg';
import counter2_2880 from '../../assets/photos/optimized/counter-sequence-02-2880.jpg';
import counter3_640 from '../../assets/photos/optimized/counter-sequence-03-640.jpg';
import counter3_1440 from '../../assets/photos/optimized/counter-sequence-03-1440.jpg';
import counter3_2200 from '../../assets/photos/optimized/counter-sequence-03-2200.jpg';
import counter3_2880 from '../../assets/photos/optimized/counter-sequence-03-2880.jpg';
import counter4_640 from '../../assets/photos/optimized/counter-sequence-04-640.jpg';
import counter4_1440 from '../../assets/photos/optimized/counter-sequence-04-1440.jpg';
import counter4_2200 from '../../assets/photos/optimized/counter-sequence-04-2200.jpg';
import counter4_2880 from '../../assets/photos/optimized/counter-sequence-04-2880.jpg';
import bmi640 from '../../assets/photos/optimized/maven-bmi-640.jpg';
import bmi1440 from '../../assets/photos/optimized/maven-bmi-1440.jpg';
import bmi2200 from '../../assets/photos/optimized/maven-bmi-2200.jpg';
import bmi2880 from '../../assets/photos/optimized/maven-bmi-2880.jpg';
import forecast640 from '../../assets/photos/optimized/maven-forecast-640.jpg';
import forecast1440 from '../../assets/photos/optimized/maven-forecast-1440.jpg';
import forecast2200 from '../../assets/photos/optimized/maven-forecast-2200.jpg';
import forecast2603 from '../../assets/photos/optimized/maven-forecast-2603.jpg';
import inbox640 from '../../assets/photos/optimized/maven-inbox-640.jpg';
import inbox1440 from '../../assets/photos/optimized/maven-inbox-1440.jpg';
import inbox2200 from '../../assets/photos/optimized/maven-inbox-2200.jpg';
import inbox2880 from '../../assets/photos/optimized/maven-inbox-2880.jpg';
import order640 from '../../assets/photos/optimized/maven-order-640.jpg';
import order1440 from '../../assets/photos/optimized/maven-order-1440.jpg';
import order2200 from '../../assets/photos/optimized/maven-order-2200.jpg';
import order2880 from '../../assets/photos/optimized/maven-order-2880.jpg';
import dashboard640 from '../../assets/photos/optimized/maven-dashboard-640.jpg';
import dashboard1440 from '../../assets/photos/optimized/maven-dashboard-1440.jpg';
import dashboard2200 from '../../assets/photos/optimized/maven-dashboard-2200.jpg';
import dashboard2880 from '../../assets/photos/optimized/maven-dashboard-2880.jpg';

const slides = projects.map((project, index) => ({
  ...project,
  name: project.name.replace(/\.$/, ''),
  image: index === 1 ? counter1_1440 : project.image,
  imageSrcSet: index === 1 ? `${counter1_640} 640w, ${counter1_1440} 1440w, ${counter1_2200} 2200w, ${counter1_2880} 2880w` : project.imageSrcSet,
}));
const wrap = (index) => (index + slides.length) % slides.length;
// Allow for the 4.5% zoom and the object-fit crop on mobile.
const imageSizes = '(max-width: 767px) 110vw, (min-width: 1440px) 1305px, 91vw';
const SEQUENCE_FRAME_INTERVAL = 2000;
const mavenFrames = [
  slides[0],
  ...[
    [bmi640, bmi1440, bmi2200, bmi2880, 2880],
    [forecast640, forecast1440, forecast2200, forecast2603, 2603],
    [inbox640, inbox1440, inbox2200, inbox2880, 2880],
    [order640, order1440, order2200, order2880, 2880],
    [dashboard640, dashboard1440, dashboard2200, dashboard2880, 2880],
  ].map(([small, large, retina, largest, largestWidth]) => ({
    ...slides[0],
    image: large,
    imageSrcSet: `${small} 640w, ${large} 1440w, ${retina} 2200w, ${largest} ${largestWidth}w`,
  })),
];

const counterFrames = [
  [counter1_640, counter1_1440, counter1_2200, counter1_2880],
  [counter2_640, counter2_1440, counter2_2200, counter2_2880],
  [counter3_640, counter3_1440, counter3_2200, counter3_2880],
  [counter4_640, counter4_1440, counter4_2200, counter4_2880],
].map(([small, large, retina, largest]) => ({
  ...slides[1],
  image: large,
  imageSrcSet: `${small} 640w, ${large} 1440w, ${retina} 2200w, ${largest} 2880w`,
}));
const projectSequences = { 0: mavenFrames, 1: counterFrames };

function ProjectImage({ slide, decorative = false, className, style }) {
  return (
    <img
      className={className}
      style={style}
      src={slide.image}
      srcSet={slide.imageSrcSet}
      sizes={imageSizes}
      width="1200"
      height="800"
      alt={decorative ? '' : `${slide.name} product experience`}
      decoding="async"
      draggable={false}
    />
  );
}

function ProjectCaption({ slide, mobile = false, expanded, onToggle, disabled }) {
  const descriptionId = `hero-project-description-${mobile ? 'mobile' : 'desktop'}`;
  return (
    <div className={`hero-slider__caption${mobile ? ' hero-slider__caption--mobile' : ''}`}>
      {!mobile && <button
        className="hero-slider__details-toggle"
        type="button"
        aria-label={`${expanded ? 'Hide' : 'Show'} ${slide.name} project details`}
        aria-expanded={expanded}
        aria-controls={descriptionId}
        onClick={onToggle}
        disabled={disabled}
      >
        {expanded
          ? <X size={18} strokeWidth={1.5} aria-hidden="true" focusable="false" />
          : <Plus size={18} strokeWidth={1.5} aria-hidden="true" focusable="false" />}
      </button>}
      <h2>{slide.name}</h2>
      <p className="hero-slider__description" id={descriptionId} hidden={!mobile && !expanded}>{slide.summary}</p>
    </div>
  );
}

export default function HeroSlider() {
  const [active, setActive] = useState(0);
  const [move, setMove] = useState(null);
  const [sequenceFrame, setSequenceFrame] = useState(0);
  const [readySequences, setReadySequences] = useState({});
  const [outgoingTransform, setOutgoingTransform] = useState('none');
  const [detailsExpanded, setDetailsExpanded] = useState(false);
  const heroRef = useRef(null);
  const [columns, setColumns] = useState(() => window.matchMedia('(max-width: 767px)').matches ? 3 : 5);
  const busy = useRef(false);
  const gesture = useRef(null);
  const imageReady = useRef([]);
  const mounted = useRef(true);

  useEffect(() => {
    let cancelled = false;
    Object.entries(projectSequences).forEach(([project, frames]) => {
      Promise.all(frames.map((frame) => {
        const image = new Image();
        image.sizes = imageSizes;
        image.srcset = frame.imageSrcSet;
        image.src = frame.image;
        return image.decode();
      })).then(() => {
        if (!cancelled) setReadySequences((ready) => ({ ...ready, [project]: true }));
      }).catch(() => {
        // Keep this project's first image if a sequence frame cannot load.
      });
    });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const frames = projectSequences[active];
    if (!frames || move || !readySequences[active]) return undefined;
    const timer = setInterval(() => {
      if (!busy.current && !document.hidden) {
        setSequenceFrame((frame) => (frame + 1) % frames.length);
      }
    }, SEQUENCE_FRAME_INTERVAL);
    return () => clearInterval(timer);
  }, [active, move, readySequences]);

  useEffect(() => {
    mounted.current = true;
    // Decode each image before it is split into animated columns.
    imageReady.current = slides.map((slide) => {
      const image = new Image();
      image.sizes = imageSizes;
      if (slide.imageSrcSet) image.srcset = slide.imageSrcSet;
      image.src = slide.image;
      return image.decode().catch(() => {});
    });
    const query = window.matchMedia('(max-width: 767px)');
    const updateColumns = () => setColumns(query.matches ? 3 : 5);
    query.addEventListener('change', updateColumns);
    return () => {
      mounted.current = false;
      query.removeEventListener('change', updateColumns);
    };
  }, []);

  const finishMove = useCallback(() => {
    if (!move) return;
    setActive(move.index);
    setSequenceFrame(0);
    setMove(null);
    busy.current = false;
  }, [move]);

  useEffect(() => {
    if (!move) return undefined;
    // Fallback if the browser interrupts animationend (e.g. resizing or switching tabs).
    const timer = setTimeout(finishMove, 780 + ((columns - 1) * 75) + 150);
    return () => clearTimeout(timer);
  }, [move, columns, finishMove]);

  const go = async (index) => {
    if (busy.current || wrap(index) === active) return;
    busy.current = true;
    const next = wrap(index);
    await Promise.all([-1, 0, 1].map((offset) => imageReady.current[wrap(next + offset)]));
    if (!mounted.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setActive(next);
      setSequenceFrame(0);
      busy.current = false;
      return;
    }
    const currentImage = heroRef.current?.querySelector('.hero-slider__slide--main > img');
    setOutgoingTransform(currentImage ? window.getComputedStyle(currentImage).transform : 'none');
    setMove({ index: next, direction: index > active ? 1 : -1 });
  };

  const onKeyDown = (event) => {
    const destinations = { ArrowLeft: active - 1, ArrowRight: active + 1, Home: 0, End: slides.length - 1 };
    if (!(event.key in destinations)) return;
    event.preventDefault();
    go(destinations[event.key]);
  };

  const onPointerDown = (event) => {
    if (!event.isPrimary || event.button !== 0 || event.target.closest('button')) return;
    gesture.current = { x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerUp = (event) => {
    if (!gesture.current) return;
    const dx = event.clientX - gesture.current.x;
    const dy = event.clientY - gesture.current.y;
    gesture.current = null;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) go(active + (dx < 0 ? 1 : -1));
  };

  return (
    <section
      ref={heroRef}
      className={`hero-slider${move ? ' is-transitioning' : ''}`}
      id="work"
      aria-label="Selected work"
      aria-roledescription="carousel"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={() => { gesture.current = null; }}
      style={{ '--slice-count': columns, '--slice-travel': `${(move?.direction || 1) * 100}%`, '--move-duration': `${780 + ((columns - 1) * 75)}ms`, '--sequence-duration': `${SEQUENCE_FRAME_INTERVAL}ms` }}
    >
      <div className="hero-slider__window">
        <div className="hero-slider__track">
          {[-1, 0, 1].map((offset) => {
            const slide = offset === 0 && projectSequences[active] ? projectSequences[active][sequenceFrame] : slides[wrap(active + offset)];
            const incoming = move && slides[wrap(move.index + offset)];
            return (
              <article
                className={`hero-slider__slide hero-slider__slide--${offset === 0 ? 'main' : 'neighbor'}`}
                key={offset}
                aria-roledescription="slide"
                aria-label={`${active + 1} of ${slides.length}: ${slide.name}`}
                aria-hidden={offset !== 0}
              >
                <ProjectImage
                  key={slide.image}
                  slide={slide}
                  decorative={offset !== 0}
                  className={offset === 0 && readySequences[active] && !move ? 'hero-slider__sequence-image' : undefined}
                />
                {move && offset !== 0 && (
                  <div className="hero-slider__neighbor-in" aria-hidden="true">
                    <ProjectImage slide={incoming} decorative />
                  </div>
                )}
                {move && offset === 0 && (
                  <div className="hero-slider__slices" aria-hidden="true">
                    {Array.from({ length: columns }, (_, column) => {
                      const order = move.direction > 0 ? column : columns - column - 1;
                      return (
                        <div className="hero-slider__slice" key={column} style={{
                          '--slice-left': columns === 3 && column > 0
                            ? `calc(var(--grid-edge) + var(--grid-column) * ${column})`
                            : `calc(var(--hero-image-width) * ${column} / ${columns})`,
                          '--slice-delay': `${order * 75}ms`,
                        }}>
                          <div className="hero-slider__layer hero-slider__layer--out"><ProjectImage slide={slide} decorative style={{ transform: outgoingTransform }} /></div>
                          <div
                            className="hero-slider__layer hero-slider__layer--in"
                            onAnimationEnd={(event) => {
                              if (event.target === event.currentTarget && offset === 0 && order === columns - 1) finishMove();
                            }}
                          ><ProjectImage slide={incoming} decorative /></div>
                        </div>
                      );
                    })}
                  </div>
                )}
                {offset === 0 && (
                  <ProjectCaption
                    slide={slide}
                    expanded={detailsExpanded}
                    onToggle={() => setDetailsExpanded((expanded) => !expanded)}
                    disabled={Boolean(move)}
                  />
                )}
              </article>
            );
          })}
        </div>
        <div className="hero-slider__footer">
          <ProjectCaption
            slide={slides[active]}
            mobile
          />
          <div className="hero-slider__controls">
            <button type="button" aria-label="Previous project" onClick={() => go(active - 1)}>
              <ArrowLeft size={18} strokeWidth={1.5} aria-hidden="true" focusable="false" />
            </button>
            <button type="button" aria-label="Next project" onClick={() => go(active + 1)}>
              <ArrowRight size={18} strokeWidth={1.5} aria-hidden="true" focusable="false" />
            </button>
          </div>
        </div>
      </div>
      <p className="hero-slider__status" role="status" aria-atomic="true">{slides[active].name}, {active + 1} of {slides.length}</p>
    </section>
  );
}
