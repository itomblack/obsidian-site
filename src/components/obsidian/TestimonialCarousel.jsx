import React, { useEffect, useRef, useState } from 'react';
import Hairstory from '../../assets/brand-logos-v2/Hairstory.svg';
import Lululemon from '../../assets/brand-logos-v2/Lululemon-BW.svg';
import Maven from '../../assets/brand-logos-v2/Maven.svg';
import Arrow from '../../assets/brand-logos-v2/Arrow.svg';
import TeddyBaldassarre from '../../assets/brand-logos-v2/TeddyB.svg';

export const testimonials = [
  {
    client: 'Hairstory',
    image: Hairstory,
    quote: 'Finding designers who know best practices is easy. Finding those who understand storytelling and how to bring your brand to life while implementing those best practices is much more difficult. Ian’s designs deliver creativity and simplicity without compromising substance and depth. Once you find talent like this, you come back again and I’ve become a repeat client.',
    author: 'Eli Halliwell',
    role: 'Founder',
  },
  {
    client: 'lululemon',
    image: Lululemon,
    quote: 'We wouldn’t be where we are today without your elegant design solutions, insightful questions, and wry sense of humour. You’ve challenged us to do better for our guests and also work smarter as a team.',
    author: 'Amanda G.',
    role: 'Director of Product Management',
  },
  {
    client: 'Maven',
    image: Maven,
    quote: 'Ian has a rare ability to take highly nuanced challenges and translate them into simple, clean, user-centered experiences.',
    author: 'Tori Bartlett',
    role: 'VP Product',
  },
  {
    client: 'Arrow',
    image: Arrow,
    quote: 'I have to share our incredible experience with Ian! Before he came on board, we’d worked with six agencies and three in-house designers. Honestly, we thought we knew what to expect in product design. Then Ian walked in, and wow, did he shake things up for the better! Ian’s skill in conducting user interviews and his ability to dive deep into problem-solving are unparalleled. His designs are not just visually stunning but are infused with functionality and user empathy. He has a unique talent for bringing designs to life, making them feel tangible and relevant. We are immensely impressed by his work.',
    author: 'Yash Joshi',
    role: 'CTO',
  },
  {
    client: 'Teddy Baldassarre',
    image: TeddyBaldassarre,
    quote: 'Ian has a real gift for UX - he gets to the “why” behind every request, and it shows in how intuitive and streamlined his designs feel. He consistently produces beautiful, polished work and is a pleasure to collaborate with. I’d recommend him without hesitation.',
    author: 'Kendra Davey',
    role: 'Ecommerce Product Manager',
  },
];

export function ClientLogoRail({ activeIndex = 2, onSelect = () => {} }) {
  const railRef = useRef(null);
  const hasCenteredRef = useRef(false);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail || !window.matchMedia('(max-width: 767px)').matches) return;

    const activeLogo = rail.querySelector('.client-logo--featured');
    if (!activeLogo) return;

    const railBounds = rail.getBoundingClientRect();
    const logoBounds = activeLogo.getBoundingClientRect();
    const target = rail.scrollLeft
      + (logoBounds.left - railBounds.left)
      - ((rail.clientWidth - logoBounds.width) / 2);
    rail.scrollTo({
      left: target,
      behavior: hasCenteredRef.current ? 'smooth' : 'auto',
    });
    hasCenteredRef.current = true;
  }, [activeIndex]);

  const moveLogoLight = (event) => {
    if (event.pointerType !== 'mouse') return;

    const button = event.currentTarget;
    const bounds = button.getBoundingClientRect();
    const x = Math.max(0, Math.min(event.clientX - bounds.left, bounds.width));
    const y = Math.max(0, event.clientY - bounds.top);
    const opacity = y < 96 ? 1 - (y / 96) : 0;

    button.style.setProperty('--logo-light-x', `${x}px`);
    button.style.setProperty('--logo-light-depth', `${Math.min(y * 0.55, 36)}px`);
    button.style.setProperty('--logo-light-opacity', opacity.toFixed(3));
  };

  const releaseLogoLight = (event) => {
    event.currentTarget.style.setProperty('--logo-light-opacity', '0');
  };

  const selectOnDesktopHover = (event, index) => {
    const supportsDesktopHover = window.matchMedia(
      '(min-width: 768px) and (hover: hover) and (pointer: fine)'
    ).matches;

    if (event.pointerType === 'mouse' && supportsDesktopHover) onSelect(index);
  };

  return (
    <div className="client-logos" ref={railRef} aria-label="Choose a client testimonial">
      {testimonials.map((testimonial, index) => {
        const isActive = index === activeIndex;

        return (
          <div className="client-logo-slot" key={testimonial.client}>
            <button
              className={`client-logo${isActive ? ' client-logo--featured' : ''}`}
              type="button"
              onClick={() => onSelect(index)}
              onPointerEnter={(event) => selectOnDesktopHover(event, index)}
              onPointerMove={moveLogoLight}
              onPointerLeave={releaseLogoLight}
              aria-label={`Show testimonial from ${testimonial.client}`}
              aria-pressed={isActive}
            >
              <img src={testimonial.image} alt="" aria-hidden="true" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default function TestimonialCarousel() {
  const [active, setActive] = useState(2);
  const testimonial = testimonials[active];
  const go = (direction) => setActive((current) => (
    (current + direction + testimonials.length) % testimonials.length
  ));

  return (
    <section className="testimonials" id="reviews" aria-label="Client testimonials">
      <ClientLogoRail activeIndex={active} onSelect={setActive} />
      <div className="testimonial" aria-live="polite">
        <button className="testimonial__arrow testimonial__arrow--prev" type="button" onClick={() => go(-1)} aria-label="Previous testimonial">←</button>
        <blockquote key={active} className="testimonial__content">
          <p className="type-quote">“{testimonial.quote}”</p>
          <footer>
            <p className="type-label">{testimonial.author}</p>
            <p className="type-label testimonial__role">{testimonial.role}</p>
          </footer>
        </blockquote>
        <button className="testimonial__arrow testimonial__arrow--next" type="button" onClick={() => go(1)} aria-label="Next testimonial">→</button>
      </div>
    </section>
  );
}
