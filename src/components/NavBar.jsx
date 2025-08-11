import React from 'react';
import Button from './Button';
import logo from '../assets/logo.svg';
import './NavBar.css';

export default function NavBar() {
  return (
    <div className="section-inset">
      <div className="nav-bar">
        <img src={logo} alt="Obsidian logo" className="logo" />
        <Button label="Say Hi" href="https://www.linkedin.com/in/itomblack/" target="_blank" />
      </div>
    </div>
  );
}