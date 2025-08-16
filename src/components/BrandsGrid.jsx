import React from 'react';
import './BrandsGrid.css';

/**
 * Auto-import all .svg files in /assets/brand-logos (no subfolders).
 * Works in Create React App (webpack) via require.context.
 */
function importAllSvgs(r) {
  return r.keys().map((key) => {
    const src = r(key);
    // Turn "LiveTinted.svg" => "LiveTinted", "hill-house.svg" => "Hill House"
    const file = key.replace('./', '').replace('.svg', '');
    const name = file
      .replace(/[-_]+/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/\b\w/g, (m) => m.toUpperCase());
    return { src, name, file };
  });
}

const logos = importAllSvgs(
  require.context('../assets/brand-logos', false, /\.svg$/)
);

export default function BrandsGrid() {
  return (
    <section className="section-inset brands">
      
      <h1 className="brands__eyebrow">Trusted by<span className="dot">.</span></h1>

      <ul className="brandsGrid" role="list">
        {logos.map(({ src, name, file }) => (
          <li className="brandCard" key={file}>
            {/* If some SVGs are dark, you can add a `data-invert` on specific ones and style accordingly */}
            <img src={src} alt={name} loading="lazy" />
          </li>
        ))}
      </ul>
    </section>
  );
}