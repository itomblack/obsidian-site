import React from 'react';
import './Orb.scss';
import WireframeSphere from './WireframeSphere';

/**
 * Glass / obsidian sphere primitive used across landing concepts.
 *
 * variant:
 *   "glass"      — tinted glass with optional image refracted inside
 *   "obsidian"   — black, polished, faint internal reflections
 *   "wireframe"  — vector globe (Project Genie style)
 */
export default function Orb({
  size = 400,
  variant = 'glass',
  imageSrc,
  label,
  caption,
  tint,
  className = '',
  children,
  onClick,
  interactive = false,
}) {
  const style = { '--orb-size': typeof size === 'number' ? `${size}px` : size };
  if (tint) style['--orb-tint'] = tint;

  return (
    <div
      className={`orb orb--${variant} ${interactive ? 'orb--interactive' : ''} ${className}`}
      style={style}
      onClick={onClick}
    >
      <div className="orb__sphere">
        {variant === 'wireframe' ? (
          <WireframeSphere />
        ) : (
          <>
            {imageSrc && (
              <div
                className="orb__image"
                style={{ backgroundImage: `url(${imageSrc})` }}
              />
            )}
            <div className="orb__refraction" />
            <div className="orb__inner-shadow" />
          </>
        )}
        <div className="orb__highlight" />
        <div className="orb__highlight orb__highlight--secondary" />
        <div className="orb__rim" />
      </div>
      <div className="orb__contact-shadow" />
      {(label || caption || children) && (
        <div className="orb__caption">
          {label && <div className="orb__label">{label}</div>}
          {caption && <div className="orb__sub">{caption}</div>}
          {children}
        </div>
      )}
    </div>
  );
}
