# Maven Story Deck image-frame controls and slide fade — design QA

## Comparison target

- Source visual truth:
  - `/Users/itomblack/Desktop/Screenshot 2026-08-27 at 3.20.27 PM.png` — full desktop composition, 3426 × 1984 px (@2x, representing 1713 × 992 CSS px).
  - `/Users/itomblack/Desktop/Screenshot 2026-08-27 at 3.29.43 PM.png` — explicit `.story-deck` CSS target, 548 × 204 px.
  - `/Users/itomblack/Desktop/Screenshot 2026-08-27 at 3.30.52 PM.png` — focused control placement target, 754 × 314 px (@2x).
  - `/Users/itomblack/Desktop/Screenshot 2026-08-27 at 3.31.39 PM.png` — focused rule-over-image target, 1134 × 96 px (@2x).
- Implementation route: `http://127.0.0.1:3001/maven-case-study-experiments`
- Desktop implementation: `/private/tmp/maven-opacity-fade-desktop-pass2.jpg`, 1713 × 992 px at a 1713 × 992 CSS viewport, device scale factor 1.
- Mobile implementation: `/private/tmp/maven-anchored-controls-mobile-pass1.jpg`, 390 × 844 px at a 390 × 844 CSS viewport, device scale factor 1.
- State: first story card, default dark theme, Previous disabled and Next active.

## Normalization and combined evidence

- The full desktop source was downsampled 50% to `/private/tmp/maven-three-column-source-normalized.png` at 1713 × 992 px before comparison.
- Full-view comparison: `/private/tmp/maven-anchored-controls-full-comparison.png`. The normalized source and current implementation were each reduced to 857 × 496 px and placed side by side.
- Latest settled-state comparison: `/private/tmp/maven-opacity-fade-comparison-pass2.png`. It confirms that the opacity-only transition leaves the approved composition unchanged.
- Focused controls comparison: `/private/tmp/maven-anchored-buttons-comparison.png`. A 377 × 157 CSS-pixel implementation crop was rendered at 2× to match the 754 × 314 px source crop.
- Focused rule comparison: `/private/tmp/maven-rule-over-image-comparison.png`. A 567 × 48 CSS-pixel implementation crop was rendered at 2× to match the 1134 × 96 px source crop.
- The full comparison verifies the composition and grid; the focused comparisons make the 20 px control offset and the rule/image stacking order directly legible.

## Findings

- No actionable P0, P1 or P2 issues remain.
- Desktop measurement: the image’s lower rule ends at 855.9 px and the controls begin at 875.9 px — an exact 20 px gap.
- Mobile measurement: the image’s lower rule ends at 433 px and the controls begin at 453 px — an exact 20 px gap.
- Both horizontal rules have z-index 3, above the photo at z-index 1, so neither rule disappears where it crosses the image.
- The requested `.story-deck` declarations resolve to `min-height: 100svh` and `padding: 112px 0 100px`.
- Slide media and copy now share a 960 ms `ease-in-out` opacity animation. At 300 ms both measured 0.226 opacity and `transform: none`; after 960 ms both settle at full opacity without positional movement.

## Required fidelity surfaces

- Fonts and typography: Passed. The existing Instrument Serif, Fragment Mono and Inter hierarchy is unchanged; the focused control crop retains the intended mono label, icon weight and legibility.
- Spacing and layout rhythm: Passed. Controls are now positioned from the image frame rather than the viewport, remain right-aligned to the content grid, and sit exactly 20 px below the lower rule on desktop and mobile. Mobile copy receives 72 px of flow space so it clears the controls without creating a viewport-dependent gap.
- Colors and visual tokens: Passed. Rule color, grid opacity, disabled Previous opacity and the button surfaces remain consistent with the prior approved state.
- Image quality and asset fidelity: Passed. The original Maven asset and crop are unchanged. Raising only the rules’ stacking order preserves image sharpness, masking, rounded end and left fade.
- Copy and content: Passed. Story copy and labels are unchanged and unobscured at both tested viewports.

## Interaction and responsive checks

- Previous and Next remain semantic buttons inside a labelled navigation region.
- Buttons advance correctly with pointer interaction; the existing keyboard, spacebar and swipe navigation are unchanged.
- Advancing from card one to card two triggers a synchronized 960 ms fade on the image and copy, with no translate or scale component.
- The existing `prefers-reduced-motion: reduce` rule removes both content animations.
- The first-card Previous button remains disabled and visually quiet; Next remains active.
- At 390 px, document width equals viewport width with no horizontal overflow.
- Primary controls remain fully visible at 1713 × 992 and 390 × 844.
- Browser console checked with no new runtime errors.
- Production build compiled successfully.

## Comparison history

- Pass 1 — [P2] Controls were fixed to the viewport’s lower edge, so their relationship to the image changed with screen height. The image pseudo-elements also sat behind the photo, causing both horizontal rules to disappear over the image region.
- Fix — Moved the navigation into `.story-deck__stage`, positioned it from the image frame using the grid calculation plus 20 px, and raised the horizontal rules above the photo. Added a mobile flow offset so copy begins after the image-anchored controls.
- Pass 2 — Passed. Desktop and mobile both measure an exact 20 px image-to-controls gap, rules remain continuous over the photo, and neither viewport overflows.
- Motion pass 1 — [P2] The original content transition used opposing horizontal movement and a small image scale, which conflicted with the requested fade-only behavior.
- Fix — Replaced both movement keyframes with one shared opacity-only animation, then extended it from 320 ms to 960 ms and switched to `ease-in-out` after the user requested a softer, three-times-slower feel.
- Motion pass 2 — Passed. Browser measurements during the transition show matching media/copy opacity, a 960 ms duration and `transform: none`; the settled-state visual comparison shows no layout drift.

## Follow-up polish

- No P3 changes are needed for this correction.

final result: passed
