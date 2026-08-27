# Maven Story Deck — design QA

## Verification target

- Route: `http://127.0.0.1:3001/maven-case-study-experiments`
- Desktop viewport: 1375 × 998
- Mobile viewport: 390 × 844
- Story states checked: cards 01 and 02

## Result

final result: passed

## Visual checks

- Only the focused Story Deck is visible; variant and style selectors are removed.
- The 24-part progress rail appears once, directly beneath the site header.
- The image remains square on desktop and mobile, with no arch mask or copy overlay.
- Eyebrow text contains the section label only, with no repeated card number.
- Previous is a circular icon button and Next is a high-contrast rounded pill; both remain fixed at the bottom-right.
- Desktop copy and image remain unobscured by the navigation controls.
- Mobile content has no horizontal overflow and reserves enough bottom space for the fixed actions.

## Interaction checks

- Next advances the story and updates the progress rail.
- Previous is disabled on the first card and enabled after advancing.
- Progress segments remain direct navigation targets.
- Keyboard arrows, spacebar and touch swipe support remain in the implementation.
- Focus states are visible on both controls.

## Build

- Production build compiled successfully.
- Existing Browserslist age notice remains non-blocking.

## Follow-up polish

- Replace the repeated Maven hero photograph with a specific square evidence asset for each story beat when the final image set is ready.
