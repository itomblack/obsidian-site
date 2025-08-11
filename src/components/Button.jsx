import React from 'react';
import './Button.css';

export default function Button({ label, onClick, href, target }) {
  // If an href is provided, render as a link
  if (href) {
    return (
      <a
        href={href}
        target={target} // optional for external links
        rel={target === '_blank' ? 'noopener noreferrer' : undefined}
        className="button"
      >
        {label}
      </a>
    );
  }

  // Otherwise, render as a standard button
  return (
    <button className="button" onClick={onClick}>
      {label}
    </button>
  );
}