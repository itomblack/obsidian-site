# Maven Story Deck grid and mobile controls — design QA

## Comparison target

- Grid source visual truth:
  - `/private/tmp/homepage-grid-desktop.jpg` — 1375 × 998 px, 1375 × 998 CSS viewport, device scale factor 1.
  - `/private/tmp/homepage-grid-mobile.jpg` — 390 × 844 px, 390 × 844 CSS viewport, device scale factor 1.
- Control source visual truth: `/Users/itomblack/Desktop/Screenshot 2026-08-27 at 3.07.29 PM.png` — 512 × 178 px, an @2x mobile control crop.
- Implementation evidence:
  - `/private/tmp/maven-grid-desktop.jpg` — 1375 × 998 px, 1375 × 998 CSS viewport, device scale factor 1.
  - `/private/tmp/maven-grid-mobile-pass1.jpg` — 390 × 844 px, 390 × 844 CSS viewport, device scale factor 1, first story card.
  - `/private/tmp/maven-grid-mobile-active.jpg` — 390 × 844 px, 390 × 844 CSS viewport, device scale factor 1, second story card with Previous enabled.
- Route: `http://127.0.0.1:3001/maven-case-study-experiments`

## Normalization and combined evidence

- Mobile full-view comparison: `/private/tmp/maven-grid-comparison-mobile.png`. Homepage and case-study captures remain at native 390 × 844 size and are placed side by side.
- Desktop full-view comparison: `/private/tmp/maven-grid-comparison-desktop.png`. Both 1375 × 998 captures were proportionally reduced to 688 × 499 before being placed side by side.
- Focused control comparison: `/private/tmp/maven-controls-grid-comparison.png`. The 212 × 52 CSS-pixel implementation group was scaled to its @2x 424 × 104 equivalent and centered beside the 512 × 178 source crop.
- The focused implementation capture includes the browser’s visible focus treatment on Next after advancing. This is an expected interaction-state difference, not a base-style mismatch.

## Findings

- No actionable P0, P1 or P2 issues remain.
- The mobile screenshot’s apparent control size was partly a density effect: the attached crop is @2x. At the verified 390 px CSS viewport, the group occupies 212 px and stays inside the 20 px page edges without overflow.
- The enabled Previous button resolves to `opacity: 0.5`; its hover and focus-visible states return it to full opacity. The first-card disabled state remains intentionally quieter at `0.28`.

## Required fidelity surfaces

- Fonts and typography: Passed. Instrument Serif, Fragment Mono and Inter retain the homepage hierarchy, weights, tracking and wrapping across the deck.
- Spacing and layout rhythm: Passed. The case study now reuses the homepage’s five-column desktop grid and three-column mobile grid. Header, progress rail, image, copy and navigation share the same outer edges. The desktop image occupies the first two columns with a controlled inset before copy begins on column three.
- Colors and visual tokens: Passed. The imported ambient grid uses the homepage’s original line opacity and animated light treatment; the enabled Previous opacity is intentionally reduced without changing the underlying button palette.
- Image quality and asset fidelity: Passed. The existing square Maven image remains sharp and correctly cropped. Lucide supplies the navigation icons; no approximation assets were introduced.
- Copy and content: Passed. Story content and labels are unchanged.

## Interaction and responsive checks

- Next advances to card two and enables Previous.
- Previous is 50% opacity when enabled and returns to full opacity on hover or keyboard focus through defined interaction rules.
- Measured mobile values: 390 px viewport, 390 px document width, 350 px grid content width, no horizontal overflow.
- Desktop controls align to the homepage grid’s right edge without obscuring story content.
- Production build compiled successfully.

## Comparison history

- Pass 1 — [P2] The case-study layout used independent gutters and did not expose the homepage grid, so its content edges could not be checked against the site-wide structure. The enabled Previous control also had equal prominence to Next.
- Fix — Reused the homepage `AmbientGrid`, copied its responsive grid variables, aligned every persistent and content region to `--grid-edge` / `--grid-content`, and added the 0.5 enabled opacity treatment.
- Pass 2 — Passed. Combined desktop, mobile and focused-control comparisons show aligned tracks, contained controls and the requested hierarchy.

## Follow-up polish

- P3: Once the final evidence images are available, consider aligning subjects within each square to the nearest vertical grid line, not just aligning the image frame itself.

final result: passed
