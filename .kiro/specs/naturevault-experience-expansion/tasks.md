# Implementation Plan: NatureVault Experience Expansion

## Overview

Convert the feature design into a series of prompts for a code-generation LLM that will implement each step with incremental progress. Each prompt builds on the previous prompts and ends with wiring things together, so there is no hanging or orphaned code that isn't integrated into a previous step. Tiers follow the user's own priority order: **P0 — Ecosystem Health, Ecosystem Web, timeline/scenario verification, Life Around You; P1 — Capture Discovery/Nature Journal, Take It Outside verification, Explore verification; P2 — Ask the Ecosystem (optional); P3 — final message alignment, dead-end audit, performance/manual verification, full build+test gate.** Items already fully implemented by the two prior specs (3D quality, per-biome water/terrain/atmosphere/audio, per-biome object density, multi-year timeline mechanics, location honesty, Explore search/filters) are scoped here as regression/verification tasks only — no rebuild.

## Tasks

### Tier 0 — Shared type extensions (blocks all new systems)

- [x] 1. Extend shared type definitions for Ecosystem Web, Life Around You, and Capture Discovery
  - Add `RelationshipKind` and `EcosystemEdge` to `src/types/vault.ts`; extend `EcosystemConnection` with an optional `edges?: EcosystemEdge[]` field (keep existing `chain: string[]` unchanged); add `LifeForm` type and an optional `lifeForm?: LifeForm` field to `EnvironmentalObject`.
  - Extend `Observation` in `src/types/observation.ts` with optional `isCaptured`, `userNote`, `objectName`, `ecosystemName`, `year`, `ecologicalSignificance` fields.
  - Run `npm run build` to confirm these additive-only changes do not break any existing compilation.
  - _Requirements: 2.1, 5.3_

- [ ] 2. Checkpoint — Ensure build passes after type extensions
  - Ensure all tests pass, ask the user if questions arise.

### Tier 1 — Ecosystem Health (P0 #1)

- [ ] 3. Implement `EcosystemHealthService`
  - Create `src/services/EcosystemHealthService.ts` with `computeBreakdown(metrics)`, `EDUCATIONAL_SIMULATION_DISCLAIMER`, and the five `HealthIndicator` entries (Biodiversity/Habitat/Water/Vegetation/Human Pressure) per design.md's pseudocode.
  - _Requirements: 1.1, 1.2, 1.5_

- [ ]* 3.1 PBT: health breakdown bounded and pure
  - **Property 1: Health breakdown is a pure, bounded function of metrics**
  - **Validates: Requirements 1.1, 1.2, 1.5, 1.7, 12.1**

- [ ]* 3.2 PBT: health breakdown varies only with metrics
  - **Property 2: Health breakdown varies only with metrics, never with the year number itself**
  - **Validates: Requirements 1.3, 1.4**

- [ ] 4. Refactor `EcosystemOverviewPanel` to consume `EcosystemHealthService`
  - Extract a shared `HealthIndicatorBars` presentational sub-component rendering the 5-indicator breakdown plus the disclaimer.
  - Replace `EcosystemOverviewPanel`'s inline `healthPercent` computation with `EcosystemHealthService.computeBreakdown(metrics).overallScore`, rendered via `HealthIndicatorBars`.
  - _Requirements: 1.1, 1.5, 1.6, 1.7_

- [ ]* 4.1 Unit test: `EcosystemOverviewPanel` health output matches `EcosystemHealthService`
  - _Requirements: 1.7, 12.1_

- [ ] 5. Create persistent `EcosystemHealthPanel` and wire it into `VaultPage`
  - Create `src/components/Vault/EcosystemHealthPanel.tsx` using `HealthIndicatorBars`.
  - Add a "Health" toggle button to `VaultPage`'s existing top-right toggle row; render the panel when active. Since it reads the already-animated `metrics` prop, it updates live as the timeline/scenario change with no additional wiring.
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.6_

- [ ]* 5.1 Unit test: disclaimer text renders exactly as specified
  - _Requirements: 1.6_

- [ ] 6. Checkpoint — Ensure Ecosystem Health tests pass
  - Ensure all tests pass, ask the user if questions arise.

### Tier 2 — Ecosystem Web (P0 #2, "VERY IMPORTANT")

- [ ] 7. Implement `EcosystemWebService`
  - Create `src/services/EcosystemWebService.ts` with `resolveGraph(biome, focusObjectId)` per design.md's pseudocode (outgoing edges from the focus object, incoming edges discovered by scanning other objects, dangling `targetId`s silently excluded).
  - _Requirements: 2.2, 2.4_

- [ ]* 7.1 PBT: web graph never returns a dangling reference
  - **Property 3: Web graph resolution never returns a dangling reference**
  - **Validates: Requirements 2.2, 12.2**

- [ ]* 7.2 PBT: web graph is symmetric across outgoing/incoming
  - **Property 4: Web graph is symmetric across outgoing/incoming**
  - **Validates: Requirements 2.4**

- [ ] 8. Author per-biome `connection.edges` data across all 8 biomes
  - For each biome, add `edges` to a representative set of *existing* objects (no new objects introduced) forming ecosystem-specific relationship chains, e.g.: temperate forest tree→insect→bird→predator→fungi; wetland plant→insect→fish→bird→predator; desert cactus→pollinator→seeds/fruit→small mammal→predator; coral reef coral→algae→reef fish→larger fish→predator; and analogous ecosystem-appropriate chains for alpine, freshwater lake, tropical forest, and grassland/savanna.
  - _Requirements: 2.1, 2.3_

- [ ]* 8.1 Unit test: relationships vary meaningfully by ecosystem
  - Assert no two biomes author an identical relationship-kind sequence, so the web reads as ecosystem-specific rather than a generic reused chain.
  - _Requirements: 2.3_

- [ ] 9. Create `EcosystemWebLines` and wire it into `SceneComposition`
  - Create `src/components/Ecosystem/EcosystemWebLines.tsx` using `@react-three/drei`'s `Line`, with an animated dashed material (dash offset driven by `useFrame`), capped at 6 rendered lines.
  - Extend `SceneComposition` to call `EcosystemWebService.resolveGraph` for the currently selected object when the existing `isConnectionsModeOn`/`connectionsOn` toggle is active, and render `EcosystemWebLines` for the result.
  - _Requirements: 3.1, 3.2, 3.5_

- [ ]* 9.1 PBT: Ecosystem Web display cap enforcement
  - **Property 5: Ecosystem Web visualization stays within its display cap**
  - **Validates: Requirements 3.1, 3.3, 3.5**

- [ ] 10. Extend `ObjectInspector` with a "Connected species" section and jump-to-connection
  - Add new `biome`/`onSelect` props to `ObjectInspector`; render up to 4 connected-species chips (deduplicated across outgoing+incoming, each showing category emoji + name + relationship label) above the existing static `chain` rendering, which stays unchanged for objects without `edges`.
  - Wire chip clicks to call `onSelect(targetId)`, jumping the selection/highlight to the connected object.
  - Update `VaultPage` to pass `vault` and `handleSelectObject` through to `ObjectInspector`.
  - _Requirements: 3.3, 3.4_

- [ ]* 10.1 Unit test: connected-species chip click wiring
  - Source-level assertion that a chip's `onClick` calls the `onSelect` prop with the target object's id.
  - _Requirements: 3.4_

- [ ] 11. Checkpoint — Ensure Ecosystem Web tests pass and lines render without console errors
  - Ensure all tests pass, ask the user if questions arise.

### Tier 3 — P0 verification: object density and timeline/scenario divergence

- [ ] 12. Regression tests: per-biome interactive object density and budget
  - Add a test asserting every biome's current-year interactive (non-null `biodiversityCategory`) object count is `>= 10` (Requirement 8.1), and re-confirm the existing `[20, 60]` total-object budget (Requirement 8.2) still holds after Task 8's field-only `edges` backfill.
  - _Requirements: 8.1, 8.2_

- [ ]* 12.1 Regression PBT: object density remains within budget after backfill
  - **Property 13 (Regression): Object density remains within budget after this feature's additions**
  - **Validates: Requirements 8.1, 8.2**

- [ ] 13. Regression tests: multi-year timeline and scenario divergence
  - Add tests re-confirming every biome has `>= 6` years including two distinct projected years (Requirement 9.1), that `Timeline` still supports drag/snap/tap across every biome's full year array (Requirement 9.4), and that the scenario-impact summary is still derived purely from `resolveMetricsForYear` (Requirement 9.3).
  - _Requirements: 9.1, 9.3, 9.4_

- [ ]* 13.1 Regression PBT: scenario divergence scaling still holds
  - **Property 14 (Regression): Scenario divergence scaling still holds**
  - **Validates: Requirements 9.2, 9.3**

### Tier 4 — Life Around You biodiversity exploration mode (P0 #4)

- [ ] 14. Implement `getLifeForm` and `lifeFormMeta`
  - Create `src/components/Ecosystem/LifeAroundYouPanel.tsx` exporting `lifeFormMeta` (the 7 categories: Plants/Insects/Birds/Reptiles/Mammals/Fungi/Aquatic Life) and the `getLifeForm(object)` fallback resolver per design.md.
  - _Requirements: 4.1, 4.2_

- [ ]* 14.1 PBT: life form resolution totality
  - **Property 6: Life form resolution is total (every object classifiable)**
  - **Validates: Requirements 4.1, 12.3**

- [ ] 15. Extend `useVaultSessionStore` with `activeLifeFormFilter`
  - Add `activeLifeFormFilter: LifeForm | null` and `setLifeFormFilter`; reset `activeLifeFormFilter` to `null` inside the existing `resetSession` action.
  - _Requirements: 4.5, 4.6_

- [ ]* 15.1 PBT: Life Around You filter is independent of the Biodiversity View filter
  - **Property 8: Life Around You and Biodiversity View filters are independent**
  - **Validates: Requirements 4.5**

- [ ] 16. Wire Life Around You dimming into `SceneComposition` and `VaultPage`
  - Add a `lifeFormFilter` prop to `SceneComposition`; extend the existing per-object `dimmed` computation with an additional OR-condition based on `getLifeForm(object) !== lifeFormFilter`, exempting objects with a null `biodiversityCategory`.
  - Add a "Life Around You" toggle button to `VaultPage` and render `LifeAroundYouPanel` when active, wired to `setLifeFormFilter`.
  - _Requirements: 4.3, 4.4_

- [ ]* 16.1 PBT: Life Around You dimming matches filter selection with scenery exemption
  - **Property 7: Life Around You dimming matches filter selection, with scenery exempt**
  - **Validates: Requirements 4.3, 4.4, 6.1, 6.2**

- [ ] 17. Checkpoint — Ensure Life Around You tests pass
  - Ensure all tests pass, ask the user if questions arise.

### Tier 5 — Object detail panel Category line (depends on Tier 4)

- [ ] 18. Add a "Category" line to `ObjectInspector`
  - Render `lifeFormMeta[getLifeForm(object)].label` (e.g. "Mammal") directly under the existing header line for objects with a non-null `biodiversityCategory`; omit the line entirely for purely decorative scenery objects, consistent with the panel's existing conditional-section pattern.
  - _Requirements: 6.1, 6.2, 6.3_

- [ ]* 18.1 Unit test: Category line rendering rule
  - Assert the line renders with the correct label for categorized objects and is omitted for scenery objects.
  - _Requirements: 6.1, 6.2_

### Tier 6 — Capture Discovery and Nature Journal (P1 #5)

- [ ] 19. Wire Capture Discovery UI into `ObjectInspector`
  - Add a "📸 Save to Nature Journal" button that expands an inline optional single-line note input plus a confirm button; add a new `onCapture: (note?: string) => void` prop.
  - _Requirements: 5.1, 5.2_

- [ ] 20. Wire the capture handler and confirmation toast in `VaultPage`
  - Implement `onCapture` to call the existing `addObservation` action with `isCaptured: true`, `userNote`, `objectName`, `ecosystemName`, `year`, and `ecologicalSignificance` populated from the selected object/current context.
  - Show a transient toast/banner reading exactly "Discovery added to your Nature Journal." (local component state, auto-dismissing).
  - _Requirements: 5.3, 5.4, 5.7_

- [ ]* 20.1 PBT: captured field snapshot correctness
  - **Property 9: Capture Discovery stores the correct field snapshot**
  - **Validates: Requirements 5.3**

- [ ]* 20.2 PBT: passive-observation counting preserved
  - **Property 10: Capture Discovery preserves passive-observation counting**
  - **Validates: Requirements 5.7, 12.4**

- [ ] 21. Add a Nature Journal section to `MyVaultPage`
  - Render `observations.filter(o => o.isCaptured)` sorted descending by `timestamp`, grouped by calendar date, each entry showing the category emoji, `objectName`, `ecosystemName`, `year`, `userNote` (if present), and an "ecological significance" line from `ecologicalSignificance`.
  - Show an empty-state message directing the user to capture their first discovery when the filtered list is empty.
  - _Requirements: 5.5, 5.6_

- [ ]* 21.1 PBT: Nature Journal shows only captured discoveries, newest first
  - **Property 11: Nature Journal shows only captured discoveries, newest first**
  - **Validates: Requirements 5.5**

- [ ]* 21.2 Unit test: Nature Journal empty-state message
  - _Requirements: 5.6_

- [ ] 22. Checkpoint — Ensure Capture Discovery / Nature Journal tests pass
  - Ensure all tests pass, ask the user if questions arise.

### Tier 7 — Take It Outside verification (P1 #6, regression only)

- [ ] 23. Regression tests: Take It Outside location honesty
  - Add new tests re-confirming `LocationService.resolveLocation()` never returns a `city`/`region` outside a `'resolved'` status derived from live geolocation, that denial/unavailability renders `LocationSelector` with the exact "We couldn't access your location." copy, and that demo-region cards are always labeled with the matched region's own name plus a "Demo location" tag.
  - _Requirements: 10.1, 10.2, 10.3_

- [ ]* 23.1 Regression PBT: location honesty
  - **Property 15 (Regression): Location honesty and type-matched fallback still hold** (honesty half)
  - **Validates: Requirements 10.1**

- [ ] 24. Regression tests: biome-matched nearby-nature fallback
  - Add new tests re-confirming `getRegionByEcosystemType` never returns an empty list when the resolved region has any locations, correctly narrows by ecosystem-type keyword when a match exists, and falls back to the full regional list when no type-specific match exists.
  - _Requirements: 10.4_

- [ ]* 24.1 Regression PBT: type-matched fallback
  - **Property 15 (Regression): Location honesty and type-matched fallback still hold** (fallback half)
  - **Validates: Requirements 10.4**

### Tier 8 — Explore page verification (P1 #7, regression only)

- [ ] 25. Regression tests: Explore search and filters
  - Add new tests re-confirming `filterEcosystems`'s substring round-trip behavior, that all 8 filter categories (Forest/Wetland/Desert/Mountain/Freshwater/Grassland/Marine/Tropical) remain mapped, and that every `EcosystemCard` still renders name, type label, species count, health indicator, timeline indicator, and an "Enter Vault" affordance across all 8 real ecosystems.
  - _Requirements: 11.1, 11.2, 11.3, 11.4_

- [ ]* 25.1 Regression PBT: search substring round trip
  - **Property 16 (Regression): Explore search substring round-trip still holds**
  - **Validates: Requirements 11.1**

### Tier 9 — Ask the Ecosystem (P2 #8, optional/self-contained)

- [ ] 26. Implement `AskTheEcosystemService`
  - Create `src/services/AskTheEcosystemService.ts` with `answerQuestion(context, question)`, an ordered list of intent patterns (decline explanation, removal-impact, importance, dependents, recovery), and a `genericGroundedFallback` that always succeeds, per design.md's pseudocode.
  - _Requirements: 7.2, 7.3, 7.5_

- [ ]* 26.1 PBT: Ask the Ecosystem never returns an empty answer
  - **Property 12: Ask the Ecosystem never returns an empty answer**
  - **Validates: Requirements 7.2, 7.4, 7.6**

- [ ]* 26.2 Unit test: one fixed example per intent pattern
  - Cover the user's own 5 example questions ("Why are there fewer birds here?", "What happens if this wetland disappears?", "Why is this tree important?", "What animals depend on this plant?", "How could this ecosystem recover?").
  - _Requirements: 7.3_

- [ ] 27. Create `AskTheEcosystemPanel` and wire it into `VaultPage`
  - Build a free-text question input, submit action, and rendered answer with a "based on" `groundedIn` footer; add an "Ask the Ecosystem" toggle button to `VaultPage`.
  - _Requirements: 7.1, 7.4, 7.6_

- [ ]* 27.1 Unit test: no network/API dependency
  - Source-level assertion that `AskTheEcosystemService.ts` contains no `fetch`/`XMLHttpRequest`/`import.meta.env` reference.
  - _Requirements: 7.5_

- [ ] 28. Checkpoint — Ensure Ask the Ecosystem tests pass
  - Ensure all tests pass, ask the user if questions arise.

### Tier 10 — Final polish, demo flow, performance, and full QA (P3)

- [ ] 29. Align the app's closing message copy with the demo-flow's final message
  - Update the existing closing quote in `AboutPage.tsx` (and/or `NatureWalkModal.tsx`'s summary copy) so the app's own words state: "We don't want people to replace nature with technology. We want technology to make people care enough to go experience nature." — replacing or placing alongside the current closely-related existing copy.
  - _Requirements: 12.6_

- [ ] 30. Cross-page dead-end audit
  - Walk every button/link/control introduced or touched by this feature (Health toggle/panel, Ecosystem Web toggle/lines/connected-species chips, Life Around You toggle/panel, Capture Discovery button/note input/toast, Nature Journal entries, Ask the Ecosystem toggle/panel) across all 8 Vaults, plus every existing control on Landing/Discover/Navigation/Profile/Archive/MyVault/Impact, and fix any control found to be non-functional.
  - _Requirements: 12.6_

- [ ] 31. Manual end-to-end demo-flow and performance verification across all 8 biomes
  - For each biome: enter the Vault, confirm the Health panel updates while dragging the timeline and switching scenarios; select an object with edges, toggle Ecosystem Web, confirm lines render (no console errors) and connected-species chips jump-select correctly; toggle Life Around You through each of the 7 categories; capture at least one discovery and confirm the toast and the Nature Journal entry; if built, open Ask the Ecosystem and try each of the 5 example questions; re-run Take It Outside with geolocation denied and with a mocked non-Portland location; re-run Explore's search and all 8 filters. Confirm no console errors, no visually broken assets, and no perceptible frame-rate regression from the new Ecosystem Web lines or Life Around You dimming pass.
  - _Requirements: 12.6_

- [ ] 32. Final build and full test suite verification
  - Run `npm run build` (type-check + production build) and `npm run test` (full Vitest suite including every unit/PBT test added above); fix any failures before considering the feature complete.
  - _Requirements: 12.5_

## Notes

- Tasks marked with `*` are optional testing sub-tasks and can be skipped for a faster pass; core implementation tasks (unmarked) should not be skipped.
- No new runtime or dev dependencies are introduced by this plan; `@react-three/drei`'s existing `Line` export, and the project's existing `vitest`/`fast-check` setup, are reused as-is.
- Tier ordering mirrors the user's own stated priority order: P0 (Ecosystem Health → Ecosystem Web → timeline/scenario verification → Life Around You) → P1 (object-category line → Capture Discovery/Nature Journal → Take It Outside verification → Explore verification) → P2 (Ask the Ecosystem, fully optional and self-contained) → P3 (final message alignment, dead-end audit, manual/performance verification, full build+test gate).
- Tier 3 and Tiers 7-8 are regression/verification tiers only — they add new *tests* re-confirming already-shipped behavior from `biome-architecture-expansion`/`visual-qa-polish-pass`, and intentionally contain no product-code changes.
- `ObjectInspector.tsx`, `SceneComposition.tsx`, and `VaultPage.tsx` are edited by multiple tiers (Health, Ecosystem Web, Life Around You, Category line, Capture Discovery, Ask the Ecosystem) — the dependency graph below places every edit to the same file in a different wave to avoid conflicting concurrent edits, even where the underlying feature logic is otherwise independent.
- Tier 9 (Ask the Ecosystem) is fully optional and self-contained: skipping the entire tier has zero effect on any other tier, satisfying the requirement that it never block or entangle with P0/P1 work.

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1"] },
    { "id": 1, "tasks": ["2"] },
    { "id": 2, "tasks": ["3", "7", "14"] },
    { "id": 3, "tasks": ["3.1", "3.2", "7.1", "7.2", "14.1"] },
    { "id": 4, "tasks": ["4", "8", "15"] },
    { "id": 5, "tasks": ["4.1", "8.1", "15.1"] },
    { "id": 6, "tasks": ["5", "9"] },
    { "id": 7, "tasks": ["5.1", "9.1"] },
    { "id": 8, "tasks": ["10"] },
    { "id": 9, "tasks": ["10.1"] },
    { "id": 10, "tasks": ["16"] },
    { "id": 11, "tasks": ["16.1"] },
    { "id": 12, "tasks": ["6", "11", "17"] },
    { "id": 13, "tasks": ["12", "13"] },
    { "id": 14, "tasks": ["12.1", "13.1"] },
    { "id": 15, "tasks": ["18"] },
    { "id": 16, "tasks": ["18.1"] },
    { "id": 17, "tasks": ["19"] },
    { "id": 18, "tasks": ["20"] },
    { "id": 19, "tasks": ["20.1", "20.2"] },
    { "id": 20, "tasks": ["21"] },
    { "id": 21, "tasks": ["21.1", "21.2"] },
    { "id": 22, "tasks": ["22"] },
    { "id": 23, "tasks": ["23", "24", "25"] },
    { "id": 24, "tasks": ["23.1", "24.1", "25.1"] },
    { "id": 25, "tasks": ["26"] },
    { "id": 26, "tasks": ["26.1", "26.2"] },
    { "id": 27, "tasks": ["27"] },
    { "id": 28, "tasks": ["27.1"] },
    { "id": 29, "tasks": ["28"] },
    { "id": 30, "tasks": ["29"] },
    { "id": 31, "tasks": ["30"] },
    { "id": 32, "tasks": ["31"] },
    { "id": 33, "tasks": ["32"] }
  ]
}
```

Dependency notes:
- Wave 0 (task 1) blocks every subsequent wave that touches `EcosystemEdge`/`LifeForm`/`Observation`'s new fields (Ecosystem Web, Life Around You, Capture Discovery); `EcosystemHealthService` (task 3) does not actually need these new types, but is kept sequenced after the checkpoint for simplicity and to match the user's own stated priority order.
- Waves 2-11 interleave the three P0 tiers (Health, Ecosystem Web, Life Around You/pending-on-Health's-VaultPage-edit) so that no two tasks touching the same file (`SceneComposition.tsx` in waves 6 and 10; `VaultPage.tsx` in waves 6, 8, and 10) land in the same wave.
- Wave 12 batches all three P0 tier checkpoints together since checkpoints are verification-only (running tests/build), not file edits, and have no conflicts with each other.
- Waves 13-14 (object density and timeline/scenario regression tests) have no data dependency on any earlier wave's product code, but are sequenced after the P0 feature tiers per the user's priority order and because task 12 re-verifies budget after task 8's edge backfill specifically.
- Waves 15-22 depend on Tier 4 (Life Around You's `getLifeForm`) for the Category line, and then serialize every further `ObjectInspector.tsx` edit (Category line in wave 15, Capture Discovery UI in wave 17) and every further `VaultPage.tsx` edit (capture handler in wave 18) to avoid file conflicts.
- Waves 23-24 (Take It Outside and Explore regression tests) are independent of every P0/P1 product-code tier and of each other — they could in principle run in parallel with earlier waves, but are sequenced after P0/P1 per the user's stated priority order.
- Waves 25-29 (Ask the Ecosystem) are fully independent of every other tier's data; wave 27's `VaultPage.tsx` edit is sequenced after wave 18's to avoid conflicting with the Capture Discovery handler.
- Wave 30 (final message alignment) touches `AboutPage.tsx`/`NatureWalkModal.tsx`, unrelated to any other wave's files, but is sequenced last per tier ordering (P3).
- Waves 31-33 (dead-end audit, manual/performance verification, final build+test) depend on every prior wave being complete, since they are the feature's final cross-cutting verification gate.
