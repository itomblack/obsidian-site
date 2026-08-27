# Maven Story Deck style experiments — design QA

## Comparison target

- **Route:** `http://127.0.0.1:3001/maven-case-study-experiments?variant=deck`
- **State:** Story card 01, dark theme, each of the five deck-style selectors active in turn.
- **CSS viewport:** 1440 × 900 at device scale factor 1 for desktop; 390 × 844 for responsive verification.
- **Source visual truth:** five ImageGen references, each 1586 × 992 px:
  - Footer bar: `/Users/itomblack/.codex/generated_images/01a0412f-1244-73c3-be3f-3790f950b761/exec-618b9938-0ee9-4926-ae41-d71bb51d61e4.png`
  - Edge controls: `/Users/itomblack/.codex/generated_images/01a0412f-1244-73c3-be3f-3790f950b761/exec-609d9849-18eb-4baa-90af-1e44b9da8fc4.png`
  - Compact dock: `/Users/itomblack/.codex/generated_images/01a0412f-1244-73c3-be3f-3790f950b761/exec-f0ce994b-ac62-4838-a162-1c7c8cad700d.png`
  - Editorial folio: `/Users/itomblack/.codex/generated_images/01a0412f-1244-73c3-be3f-3790f950b761/exec-5bc121e2-f51f-4520-8ff7-1ea6bb3ca513.png`
  - Control rail: `/Users/itomblack/.codex/generated_images/01a0412f-1244-73c3-be3f-3790f950b761/exec-454d1911-5776-42f7-910b-445f23bf2d75.png`
- **Implementation screenshots:** 1440 × 900 px:
  - `/private/tmp/maven-deck-implementation-footer-v2.png`
  - `/private/tmp/maven-deck-implementation-edges.png`
  - `/private/tmp/maven-deck-implementation-dock.png`
  - `/private/tmp/maven-deck-implementation-folio.png`
  - `/private/tmp/maven-deck-implementation-rail.png`
- **Normalized full-view comparisons:** source and implementation were each resized to 720 × 450 and placed side by side in a 1440 × 450 comparison image:
  - `/private/tmp/maven-deck-qa-footer-v2.png`
  - `/private/tmp/maven-deck-qa-edges.png`
  - `/private/tmp/maven-deck-qa-dock.png`
  - `/private/tmp/maven-deck-qa-folio.png`
  - `/private/tmp/maven-deck-qa-rail.png`

The source frames use a slightly wider aspect ratio than the requested 1440 × 900 viewport. Comparisons were normalized proportionally to 16:10 so composition and hierarchy could be judged without mistaking density differences for implementation defects.

## Required fidelity surfaces

- **Fonts and typography:** Passed. The implementation uses the project’s actual Instrument Serif, Fragment Mono and Inter assets, closely matching the references’ display, label and body hierarchy. Headlines preserve the intended editorial scale and wrapping across all five desktop compositions; mobile reduces them without truncation.
- **Spacing and layout rhythm:** Passed after one correction. Each treatment preserves a large square image, independent text block and generous negative space. Footer, edge, dock, folio and rail controls occupy visibly different, intentional positions. The 390 px layout has no horizontal overflow.
- **Colors and visual tokens:** Passed. Near-black background, off-white primary action, subdued sage state color and low-contrast hairlines match the reference direction and reuse the existing Obsidian tokens.
- **Image quality and asset fidelity:** Passed with an intentional asset substitution. The implementation uses the existing high-resolution Maven project photograph rather than the newly generated people imagery shown in three concept frames. It is rendered as a true 1:1 image with `object-fit: cover`, a 4–6 px radius, no arch mask, no tint and no text overlay.
- **Copy and content:** Passed. The source headline, context line, 01/24 state and next-story naming are preserved. The full 24-card medium story remains functional behind every style.

## Full-view comparison evidence

All five side-by-side comparisons preserve the reference’s dominant hierarchy: square image and story copy remain the two main regions, while the navigation changes location and density by style. The additional five-style selector is an intentional experiment-control layer rather than part of the final case study.

No separate focused-region crops were required because the native 1440 × 900 implementation captures and emitted browser screenshots made button labels, borders, typography and image edges readable at full size. The mobile control region was also inspected at its native 390 × 844 viewport.

## Comparison history

### Pass 1 — blocked

- **[P2] Footer action bar was partially below the desktop viewport.**
  - Evidence: `/private/tmp/maven-deck-qa-footer.png` showed the implementation’s primary Next control clipped at the bottom, while the source kept the whole action bar visible.
  - Impact: The most important navigation control could appear incomplete at a common laptop viewport.
  - Fix: Made the footer action bar fixed within the 20 px lower inset, reserved stage padding for it and retained the responsive sticky-bar override on mobile.

### Pass 2 — passed

- Evidence: `/private/tmp/maven-deck-qa-footer-v2.png` shows the full footer bar inside the viewport with the square image and copy unobscured.
- No remaining P0, P1 or P2 mismatch was found across the other four desktop comparisons or the 390 px responsive capture.

## Interaction and responsive verification

- Five style selectors change the layout and persist the selection in the `style` query parameter.
- Previous and Next work with pointer input.
- Left and Right keyboard arrows advance and reverse the story.
- The 24-part progress rail jumps directly to a selected beat.
- Mobile style switching and Next navigation were tested at 390 × 844.
- Mobile metrics: 390 px viewport width, 390 px document width, no horizontal overflow.
- Browser console: no errors or warnings.
- Production build: passed.

## Follow-up polish

- **[P3]** Replace the repeated Maven hero photograph with the final square evidence asset assigned to each story beat once the case-study image set exists.
- **[P3]** Consider removing the experiment-level style selector after one treatment is chosen so the final story regains more vertical space.

## Final result

final result: passed
