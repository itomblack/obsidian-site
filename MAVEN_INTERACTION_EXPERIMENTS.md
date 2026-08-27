# Maven case-study interaction experiments

Route: `/maven-case-study-experiments`

The four prototypes deliberately use the same 24-beat story. Their differences are pacing, orientation and how much control the reader receives.

## 01 — Guided scroll

**Hypothesis:** A continuous scroll with a persistent visual stage can feel cinematic without asking the reader to learn a new interaction.

**Strongest for:** Desktop storytelling, emotional pacing, showing a visual transformation over time.

**Risk:** Twenty-four full-height beats can feel longer than the copy actually is. The final version should vary the rhythm with short beats, paired beats and occasional evidence clusters.

**Mobile behaviour:** The persistent split collapses into full-screen visual-and-copy scenes. This is easier to understand but less differentiated from a conventional editorial page.

## 02 — Story deck

**Hypothesis:** Explicit next/previous controls, progress segments, keyboard navigation and mobile swiping create the snappiest version of the story.

**Strongest for:** The 60–90 second reader, proposal links, social familiarity and mobile.

**Risk:** Tap-through stories can make substantial consulting work feel lighter than it is. It also hides the total amount of proof until a reader advances.

**Mobile behaviour:** Strongest of the four. The reader sees one complete beat, always knows their position and can swipe or tap through quickly.

## 03 — Documentary split

**Hypothesis:** Keeping evidence visible while the argument scrolls makes the work feel rigorous, calm and credible.

**Strongest for:** Founders, product leaders and enterprise teams who want to understand how the decisions were made.

**Risk:** This direction needs the richest final asset set. Repeating one hero image would weaken it; the evidence frame should rotate through maps, wireframes, pilot findings, launch screens and metrics.

**Mobile behaviour:** The evidence frame stays pinned above the transcript. This preserves the relationship between proof and argument without forcing a desktop split into a narrow screen.

## 04 — Director’s cut

**Hypothesis:** Six named chapters let serious readers control depth while preserving a authored sequence within each chapter.

**Strongest for:** Sales follow-ups, due diligence and readers returning to a specific part of the engagement.

**Risk:** Chapter navigation reveals the structure early but reduces suspense. It feels more like an interactive report than a single dramatic story.

**Mobile behaviour:** Chapters become a horizontal rail and each chapter becomes a small swipeable deck.

## Recommendation after prototyping

The strongest final system is probably a hybrid rather than one untouched variant:

1. Open with the **Story deck** for the first four beats, where speed and drama matter.
2. Transition into the **Documentary split** for the build, pilot and post-launch evidence.
3. Keep the **Director’s cut** chapter rail as an optional navigation layer for returning and high-intent readers.

The Guided scroll is the most visually dramatic pure direction, but it has the highest risk of making a 24-beat story feel long. The deck is the strongest mobile default. The documentary model best supports the consulting proposition: Ian’s value was not simply producing screens, but making consequential decisions legible.

The prototypes currently use the existing Maven project image as a deliberate stand-in. Interaction decisions should be made before investing in the full evidence asset set.
