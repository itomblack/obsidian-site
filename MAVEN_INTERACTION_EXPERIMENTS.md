# Maven case-study interaction prototype

Route: `/maven-case-study-experiments`

The prototype has been consolidated into one focused Story Deck. The previous interaction variants and five style-study selectors have been removed from the interface.

## Final interaction model

- A 24-beat click-through story with a single progress rail at the top.
- One three-column image per beat with a square left edge, rounded right end, subtle left fade and no text overlay.
- Two-column editorial copy with a 28 px inset on desktop; the responsive flow preserves that inset beneath the image on mobile.
- Faint page-wide rules align with the top and bottom of each image and remain visible across the photo.
- A circular Previous icon and a clear pill-shaped Next action sit at the grid’s right edge, exactly 20 px below the image’s lower rule.
- The homepage ambient grid and responsive five-column / three-column alignment system.
- A quieter enabled Previous state at 50% opacity, returning to full opacity on hover or focus.
- Pointer, keyboard arrow, spacebar and mobile swipe navigation.
- A soft 960 ms opacity fade between story beats, with no directional movement or scale.
- Eyebrow copy identifies the story section without repeating the slide number.

This keeps the speed and social familiarity of the original Story Deck while removing the experimental navigation chrome. It is designed for a fast 60–90 second read without losing the full medium-length story.

The prototype still uses the existing Maven project photograph as a stand-in. The final case study should assign a relevant square evidence image to each story beat.
