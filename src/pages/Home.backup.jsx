import React from 'react';
import './ComingSoon.css';
import logo from '../assets/logo.svg';

export default function Home() {
  return (
    <div className="coming-soon">
        <div className="border-top"></div>
        <div className="columns">
            <div className="logo-stack">
                <img src={logo} alt="Obsidian logo" className="logo" />
            </div>
            <div className="content-stack">
                <p>For retail operators sick of stores that don’t perform - we bring the UX strategy, design expertise, and conversion rate optimization chops that grow your business without compromising your brand. </p>
                <p>New site coming soon...</p>
            </div>   
        </div>
    </div>
  );
}