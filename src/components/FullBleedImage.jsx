import React from 'react';
import './FullBleedImage.css';
import showcase from '../assets/showcase.png'; // replace with your image

export default function FullBleedImage() {
  return (
    <div className="full-bleed-image">
      <img src={showcase} alt="Project showcase" />
    </div>
  );
}