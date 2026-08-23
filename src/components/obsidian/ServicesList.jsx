import React from 'react';

export const services = [
  ['Strategic Advisory', 'Partnering with founders and product teams on what to build and how to build it.'],
  ['Product Design', 'Launching the next version of your business to create a category defining digital brand.'],
  ['Conversion Optimization', 'Identifying high-leverage testing loops to transform existing attention into lasting revenue.'],
  ['UX Research', 'Interviewing your customers and analyzing your competitors to uncover your competitive advantage.'],
];

export function ServiceRow({ service, index }) {
  const moveLight = (event) => {
    if (event.pointerType !== 'mouse') return;

    const row = event.currentTarget;
    const bounds = row.getBoundingClientRect();
    const x = Math.max(0, Math.min(event.clientX - bounds.left, bounds.width));
    const y = Math.max(0, event.clientY - bounds.top);
    const maxPull = 72;
    const releaseStart = 56;
    const releaseEnd = 108;
    const pull = Math.min(y, maxPull);
    const opacity = y <= releaseStart
      ? 1
      : Math.max(0, (releaseEnd - y) / (releaseEnd - releaseStart));

    row.style.setProperty('--service-light-x', `${x}px`);
    row.style.setProperty('--service-light-pull', `${pull}px`);
    row.style.setProperty('--service-light-opacity', opacity.toFixed(3));
  };

  const releaseLight = (event) => {
    event.currentTarget.style.setProperty('--service-light-opacity', '0');
    event.currentTarget.style.setProperty('--service-light-pull', '0px');
  };

  return (
    <article
      className="service-row"
      onPointerMove={moveLight}
      onPointerLeave={releaseLight}
    >
      <span className="service-row__number">{String(index + 1).padStart(2, '0')}</span>
      <h3 className="type-title service-row__title">{service[0]}</h3>
      <p className="type-body service-row__description">{service[1]}</p>
    </article>
  );
}

export default function ServicesList() {
  return (
    <section className="services">
      <div className="services__inner">
        <div className="services__list">
          {services.map((service, index) => (
            <ServiceRow key={service[0]} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
