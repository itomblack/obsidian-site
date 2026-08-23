import React from 'react';
import { PillButton, SectionLabel } from './Primitives';

export default function ContactArch() {
  return (
    <footer className="contact-arch" id="contact">
      <div className="contact-arch__content">
        <SectionLabel>What next</SectionLabel>
        <h2 className="type-display">Start the coversation?</h2>
        <PillButton href="https://www.linkedin.com/in/itomblack/" target="_blank">Introduce yourself</PillButton>
        <p className="type-label contact-arch__meta">Based in Canada · Working everywhere</p>
      </div>
    </footer>
  );
}
