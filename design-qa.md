# Maven Story Deck three-column composition — design QA

## Comparison target

- Source visual truth: `/Users/itomblack/Desktop/Screenshot 2026-08-27 at 3.20.27 PM.png`
- Source pixels: 3426 × 1984 px, an @2x capture representing a 1713 × 992 CSS viewport.
- Normalized source: `/private/tmp/maven-three-column-source-normalized.png` at 1713 × 992 px.
- Implementation route: `http://127.0.0.1:3001/maven-case-study-experiments`
- Final desktop implementation: `/private/tmp/maven-three-column-desktop-pass2.jpg` at 1713 × 992 px, 1713 × 992 CSS viewport, device scale factor 1.
- Mobile implementation: `/private/tmp/maven-three-column-mobile-pass1.jpg` at 390 × 844 px, 390 × 844 CSS viewport, device scale factor 1.
- State: first story card, default dark theme.

## Normalization and combined evidence

- The source was downsampled exactly 50% to its CSS dimensions before comparison; the implementation required no density conversion.
- Full-view comparison: `/private/tmp/maven-three-column-comparison-pass2.png`. Source and implementation were each reduced to 857 × 496 and placed side by side.
- Focused copy comparison: `/private/tmp/maven-three-column-copy-comparison.png`. Matching 570 × 320 crops show the eyebrow, heading and body at readable size.
- The full-view comparison is sufficient for the image crop, rounded end, grid tracks, section rules and control placement. The focused crop verifies typography and copy alignment.

## Findings

- No actionable P0, P1 or P2 issues remain.
- Measured desktop values match the requested construction: 748.8 px image region spanning three grid columns, copy beginning exactly 28 px after the image, 48 px heading, and 120 px left-edge gradient.
- The source does not depict the requested left fade, so the implementation intentionally adds it beyond the screenshot while keeping the underlying crop and silhouette unchanged.

## Required fidelity surfaces

- Fonts and typography: Passed. Instrument Serif, Fragment Mono and Inter match the source hierarchy and wrapping. The desktop heading resolves to exactly 48 px; mobile resolves to 43.68 px and never exceeds the cap.
- Spacing and layout rhythm: Passed. The image spans columns one through three. Copy spans columns four and five with a 28 px left margin. Image and copy vertical centers match the normalized source after the final correction.
- Colors and visual tokens: Passed. Page black, grid lines, muted copy and sage eyebrow remain consistent. The 120 px black-to-transparent image fade uses the page background color and does not muddy the central subject.
- Image quality and asset fidelity: Passed. The original high-resolution Maven asset remains the source. Its frame has no border or backing panel, and the right edge uses a half-round mask while the left corners remain square.
- Copy and content: Passed. All visible story text matches the source and remains unobscured.

## Interaction and responsive checks

- Navigation remains fixed to the grid’s bottom-right edge and advances the story.
- At 390 px, the image occupies the full 350 px three-column content width; copy begins at 48 px, preserving the requested 28 px inset from the grid edge.
- Mobile document width equals the 390 px viewport with no horizontal overflow.
- The mobile fade scales to 72 px and the horizontal rules remain aligned with the image’s top and bottom.
- Production build compiled successfully.

## Comparison history

- Pass 1 — [P2] The initial implementation matched the horizontal grid but sat approximately 24 px lower than the normalized source, shifting both the image rules and copy block.
- Fix — Shifted the desktop story stage upward by 24 px while leaving the verified mobile flow untouched.
- Pass 2 — Passed. The image top, image bottom, copy baseline and two-column composition now align with the normalized source.

## Follow-up polish

- P3: When per-slide imagery is introduced, tune each image’s `object-position` so its subject remains clear beneath the left fade and rounded right crop.

final result: passed
