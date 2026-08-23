import React from 'react';
import mark from '../../assets/obsidian-2026/obsidian-mark.png';

export function BrandMark({ size = 'medium', className = '' }) {
  return (
    <img
      className={`brand-mark brand-mark--${size} ${className}`}
      src={mark}
      alt=""
      aria-hidden="true"
    />
  );
}

export function SectionLabel({ as: Element = 'p', children, className = '' }) {
  return <Element className={`type-label ${className}`}>{children}</Element>;
}

export function PillButton({ href, children, tone = 'dark', className = '', target }) {
  return (
    <a
      className={`pill-button pill-button--${tone} ${className}`}
      href={href}
      target={target}
      rel={target === '_blank' ? 'noreferrer' : undefined}
    >
      <span>{children}</span>
      <span className="pill-button__arrow" aria-hidden="true">→</span>
    </a>
  );
}
