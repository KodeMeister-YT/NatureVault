# Implementation Plan: Visual QA & Polish Pass

## Overview

Convert the feature design into a series of prompts for a code-generation LLM that will implement each step with incremental progress. Each prompt builds on the previous prompts and ends with wiring things together, so there is no hanging or orphaned code that isn't integrated into a previous step. Work is sequenced per the user's priority order: (1) biome differentiation, (2) 3D visual quality, (3) biodiversity density/interactions, (4) multi-year timeline, (5) future scenario divergence, (6) Explore functionality, (7) location-aware Take It Outside, (8) camera/atmosphere/audio, (9) performance, (10) full QA pass. Tier 0 wires the one missing structural piece (`biome.style` resolution) that several later tiers depend on.

## Tasks

### Tier 0 — Wire up BiomeStyle resolution (blocks biome differentiation work)

- [x] 1. Create `resolveBiomeStyle` and thread `colorOverride` through shared primitives
  - Create `src/components/Ecosystem/resolveBiomeStyle.ts` exporting `resolveBiomeStyle(style, kind, variant?)` per design.md.
  - Add an optional `colorOverride?: string` prop to `Tree.tsx`, `Rock.tsx`, `MeadowPatch.tsx`, `ReedCluster.tsx`, `Pollinator.tsx`: when present and the object is not `selected`/`highlighted`, use `colorOverride` as the base (unselected) color instead of each component's current hardcoded literal; `selected`/`highlighted` colors remain unchanged.
  - Update `EnvironmentalObjectRenderer.tsx` to accept a new `style: BiomeStyle` prop, call `resolveBiomeStyle(style, object.kind, object.variant)` for the `tree`/`canopyTree`/`rock`/`reed`/`plant`/`pollinator` cases, and pass `colorPrimary` through as `colorOverride`.
  - Update `SceneComposition.tsx` to pass `style={biome.style}` down to `EnvironmentalObjectRenderer`.
  - _Requirements: 1.1, 1.2_

- [x]* 1.1 PBT: resolveBiomeStyle correctness (Property 3)
  - Use fast-check to generate random `BiomeStyleEntry[]` (no duplicate `(kind, variant)` pairs) and random `(kind, variant)` queries; assert the returned entry's `kind` always matches, and a variant-specific entry always wins over a kind-only entry when both exist.
  - _Requirements: 1.1, 1.2_

- [x] 2. Generalize the density-dropout mechanism in `EnvironmentalObjectRenderer`
  - Extract the existing inline seeded-threshold expression into a shared `seededDropoutThreshold(position)` helper.
  - Add a `VEGETATION_DENSITY_KINDS` set (`cactus`, `coral`, `tropicalFlower`, `termiteMound`, `anemone` once introduced in Tier 1) gated by `vegetationDensity` using the same helper; keep `WILDLIFE_KINDS` gated by `biodiversityLevel` as today.
  - _Requirements: 2.1_

- [x]* 2.1 PBT: density-dropout monotonicity (Property 4)
  - Generate random positions and random `(d1, d2)` pairs with `d1 <= d2`; assert visibility at `d1` implies visibility at `d2` for the shared threshold helper.
  - _Requirements: 2.1, 2.2_

### Tier 1 — Biome differentiation: new primitives and per-biome content gaps

- [x] 3. Create `Crab`, `Turtle`, `Anemone` primitives
  - `Crab.tsx` following `Frog.tsx`'s idle/hop pattern, scaled/widened, with a sideways-scuttle animation.
  - `Turtle.tsx` following `Animal.tsx`'s quadruped pattern, flattened into a shell+flippers shape with a slow bob.
  - `Anemone.tsx` following `Coral.tsx`'s instanced-branch pattern with thinner, faster-swaying tentacles.
  - Each accepts the standard primitive props plus optional `colorOverride`.
  - Add `crab`, `turtle`, `anemone` to `ObjectKind` in `types/vault.ts`.
  - Add switch cases for all three in `EnvironmentalObjectRenderer.tsx`, and add `crab`/`turtle`/`anemone` to `WILDLIFE_KINDS`/`VEGETATION_DENSITY_KINDS` as appropriate (`crab`/`turtle` → `WILDLIFE_KINDS`; `anemone` → `VEGETATION_DENSITY_KINDS`).
  - Add `crab: 'Crab'`, `turtle: 'Sea Turtle'`, `anemone: 'Sea Anemone'` to `ObjectInspector.tsx`'s `kindLabel` map.
  - _Requirements: 1.11, 2.1, 2.2_

- [x] 4. Coastal Wetland: add missing required elements
  - Add at least one `crab` object and confirm at least one fish-representing object, amphibian (`frog`), and bird are present (existing `wetland-bird-1`/`wetland-frog-1` already satisfy bird/amphibian — add a visible fish-representing object if none exists as a distinct clickable object).
  - Add a shallow marsh pool object (`pond` kind) visually distinct from the existing tidal channel (`river` kind), with its own `featureRadius` smaller than the channel's.
  - Add mangrove/coastal-vegetation-styled object(s) if not already distinguishable from generic reeds (a `plant` or `reed` variant with a `style` override).
  - Backfill `trophicRole`/`habitat`/`diet-or-environmentalPressures` on every new object.
  - _Requirements: 1.3, 3.4_

- [x] 5. Temperate Forest: verify/patch required elements
  - Confirm tall conifer trees, ferns, moss, fallen logs, mushrooms (`fungi`), narrow creek, and woodland wildlife are present (existing data already includes most of these — add mushroom/log density if under 2 instances each).
  - Confirm no `lake`-kind object exists anywhere in `evergreenValleyVault.objects`.
  - _Requirements: 1.4_

- [x] 6. Tropical Forest: add missing required elements and increase density above Temperate Forest
  - Add at least one flying-insect-styled object (reuse `Pollinator` with a `tropicalFlower`-adjacent styling, or a new lightweight variant).
  - Add enough additional vegetation/wildlife objects (more vines, canopy trees, or forest-floor detail) so the Tropical Forest's current-year visible object count exceeds the Temperate Forest's current-year visible object count.
  - Backfill biodiversity-hierarchy fields on all newly added objects.
  - _Requirements: 1.5, 3.4_

- [x] 7. Desert: add missing required elements
  - Add at least one distant-mountain backdrop object (reuse `Mountain`) and at least one dry-shrub-styled vegetation object (reuse `MeadowPatch` with a dry/brown `style` override, or a small new low-poly shrub primitive if `MeadowPatch`'s grass-blade geometry reads wrong for a shrub — prefer the `MeadowPatch` reuse with style override first).
  - Confirm no water-kind object and no green-toned terrain palette color exists in `desert.ts` (`terrain.palette` should contain no green hex value).
  - Backfill biodiversity-hierarchy fields on all newly added objects.
  - _Requirements: 1.6, 3.4_

- [x] 8. Alpine: add missing required elements
  - Add at least one conifer tree (`tree` kind, `variant: 'conifer'`, the existing default) and at least one snow-patch-styled object (reuse `Rock` or `MeadowPatch` with a white/pale `style` override, or a small new flattened-plane primitive if neither reads correctly).
  - Confirm alpine meadow, rock formations, mountain stream (existing `river`/creek-equivalent), and alpine wildlife are present (existing data largely covers this).
  - Backfill biodiversity-hierarchy fields on all newly added objects.
  - _Requirements: 1.7, 3.4_

- [x] 9. Freshwater Lake: add missing required elements
  - Add aquatic-vegetation-styled object(s) (reuse `ReedCluster` with a `style` override distinct from wetland reeds), at least one duck-styled bird (reuse `Bird`), at least one `frog`, and at least one dragonfly-styled object (reuse `Pollinator` with a `style` override).
  - Confirm the lake's `featureRadius` is greater than the largest `featureRadius` used by any `pond`-kind object across all 8 biomes.
  - Backfill biodiversity-hierarchy fields on all newly added objects.
  - _Requirements: 1.8, 3.4_

- [x] 10. Grassland/Savanna: add missing required elements
  - Add tall-grass-styled vegetation clusters (reuse `MeadowPatch` with a distinct golden/tall-grass `style` override — this is also the Requirement 2.4 "distinguishing override for reused primitive" case), shrub-styled vegetation (reuse `MeadowPatch` with a different override or `Rock`-adjacent shrub styling), and at least one flying-insect-styled object (reuse `Pollinator`).
  - Confirm scattered trees, watering hole, termite mounds, and grazing wildlife/birds are present (existing data covers this).
  - Backfill biodiversity-hierarchy fields on all newly added objects.
  - _Requirements: 1.9, 2.4, 3.4_

- [x] 11. Coral Reef: add missing required elements
  - Add at least one `turtle` object, at least one `anemone` object, marine-vegetation-styled object(s) (reuse `ReedCluster` with a kelp-styled `style` override distinct from freshwater/wetland reeds — the Requirement 2.4 reef case), additional fish schools if fewer than 2-3 currently exist, underwater particles (already covered by `UnderwaterAmbience`'s bubble particles — verify no additional object-level change is needed), and confirm light-shaft rays render (already covered by `UnderwaterAmbience`'s shaft planes).
  - Confirm no terrestrial terrain, no non-underwater water-kind object, and no `tree`/`canopyTree`/`building`/`road`/`path`/`cactus` object exists anywhere in `coralReef.ts`.
  - Backfill biodiversity-hierarchy fields on all newly added objects.
  - _Requirements: 1.10, 3.4_

- [x] 12. Apply `biome.style` overrides across all 8 biome data files
  - For each biome, populate `style.entries` with at least the color overrides implied by Tasks 4-11 (e.g. wetland `reed` mangrove tint, desert `rock` warm tint, alpine `rock`/`tree` cool tint, savanna `MeadowPatch`-as-tall-grass and shrub tints, reef `ReedCluster`-as-kelp tint, freshwater-lake `ReedCluster`-as-aquatic-vegetation tint distinct from wetland's).
  - Verify visually (or via the Task 1.1 property test's resolution logic) that each biome's reused-primitive instances resolve to a color distinct from the shared default and from any other biome's override for the same kind.
  - _Requirements: 1.1, 1.2, 2.4_

- [x] 13. Unit tests: per-biome required-element presence and absence checks
  - Write a test file asserting, for each of the 8 biomes, the presence of every kind/element required by Requirements 1.3-1.10 (using `ObjectKind` membership checks against each biome's `objects` array), and the specific absence checks (no `lake` in Temperate Forest, no water-kind or green terrain palette in Desert, no terrestrial/non-ambient-water kinds in Coral Reef — extending the existing `waterConsistency.test.ts`/biodiversity-coverage test patterns).
  - Write a test asserting Tropical Forest's current-year visible object count is greater than or equal to Temperate Forest's current-year visible object count.
  - Write a test asserting every `ObjectKind` value used across the `vaults` map has a corresponding `ObjectInspector` `kindLabel` entry.
  - _Requirements: 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 1.10, 1.11_

### Tier 2 — 3D visual quality checkpoint

- [x] 14. Checkpoint — Ensure all tests pass and all 8 biomes render distinctly
  - Run `npm run build` and `npm run test`; manually verify (or via existing dev server) each biome's new objects, style overrides, and density-dropout behavior render without console errors before proceeding.
  - Ensure all tests pass, ask the user if questions arise.

### Tier 3 — Biodiversity density, ecological layering, and interactivity

- [x] 15. Verify and backfill 8-object minimum and layer coverage per biome
  - For any biome whose current-year interactive object count is below 8 after Tier 1 (should not occur given Tasks 4-11, but verify), add additional objects until the minimum is met.
  - For each biome, confirm at least one object exists per applicable layer (landscape, vegetation, small life, larger wildlife, environmental trace); add a small environmental-trace object (fallen log, mushroom cluster, dry riverbed segment, or termite mound as already present) to any biome missing one.
  - _Requirements: 3.1, 3.2_

- [x]* 15.1 Unit test: 8-object minimum and layer coverage across all biomes
  - Iterate the `vaults` map asserting each biome's current-year interactive object count is >= 8, and that each biome includes at least one object from each applicable layer-kind grouping.
  - _Requirements: 3.1, 3.2_

- [x]* 15.2 PBT: biodiversity field coverage for new object kinds (Property 8)
  - Iterate every `crab`/`turtle`/`anemone` object across all 8 biomes (a fixed-but-enumerable set, run as a standard iteration test rather than a generated-input property) asserting `trophicRole`, `habitat`, and at least one of `diet`/`environmentalPressures` are populated whenever `biodiversityCategory` is non-null.
  - _Requirements: 3.4_

### Tier 4 — Multi-year timeline expansion

- [x] 16. Expand every biome's `years` array to at least 6 entries with a second projected year
  - For each of the 8 biomes, add year entries so the array has at least 6 total, includes at least one earlier historical year denser/more pristine than the present-day year, and includes a second projected year (2075) in addition to the existing 2050 entry.
  - Author distinct, non-templated `summary`/`keyChanges` text for every year, including both projected years, so 2050 and 2075 read as genuinely different stages rather than duplicated text with a changed number.
  - _Requirements: 4.1, 4.2, 4.3_

- [x]* 16.1 Unit test: year-array length, distinctness, and projected-year requirements
  - Iterate the `vaults` map asserting `years.length >= 6`, all `summary` values within a biome are pairwise distinct, at least one year has `year >= 2050` beyond the present-day year, and at least one earlier year has a higher `vegetationDensity`/`biodiversityLevel` than the present-day year.
  - For every biome with two or more years `>= 2050`, assert their `summary` texts differ.
  - _Requirements: 4.1, 4.2, 4.3_

- [x] 17. Re-verify `Timeline.tsx` against expanded 6-7 year arrays
  - Manually/automatically confirm drag/snap/tap selection still works correctly for the newly expanded arrays; no code change expected per design.md's review, but add a regression test using a 7-element array if the existing test suite only covers up to 6.
  - _Requirements: 4.4_

- [x]* 17.1 Regression test: Timeline snap-to-nearest for a 7-element years array
  - Extend or add a unit test simulating a range-input change against a 7-element `years` array, asserting the nearest-year snap logic selects the correct year.
  - _Requirements: 4.4_

### Tier 5 — Future scenario divergence

- [x] 18. Extend `ScenarioService`: multi-projected-year scaling
  - Add a `getPresentYear(baselineByYear)` helper (largest year `< 2050`, defensively falling back if none exists).
  - Extend `applyScenario(baseline, scenario, scale = 1)` to multiply each modifier's delta by `scale` before applying it.
  - Update `resolveMetricsForYear` to compute `projectedYears`, determine `scale` for the requested year relative to the first projected year, and pass it to `applyScenario` per design.md's pseudocode.
  - Verify all existing call sites (`VaultPage`, `CompareView`, `ScenarioSwitcher`) continue to compile without changes, since `scale` defaults to `1`.
  - _Requirements: 5.1, 5.2, 5.3_

- [x]* 18.1 PBT: scenario divergence scaling and bounded metrics (Properties 5 & 6)
  - Generate random `(presentYear, y1, y2)` triples with `presentYear < y1 < y2` and random non-zero scenario modifiers; assert the scaled modifier magnitude at `y2` is >= the magnitude at `y1`.
  - Generate random baseline metrics, random modifiers, and random `scale` in `[0, 1]`; assert `applyScenario` output stays within `[0,1]^4`.
  - _Requirements: 5.1, 5.2, 5.3_

- [x]* 18.2 Regression test: single-projected-year biomes unaffected
  - For every biome that (temporarily, before Task 16 lands a second projected year) or structurally has exactly one projected year, assert `resolveMetricsForYear` output at that year is identical to the pre-change `applyScenario(previous, scenario)` result (scale factor of exactly `1`).
  - _Requirements: 5.2_

- [x] 19. Add scenario-impact summary to `ScenarioSwitcher.tsx`
  - Implement `computeScenarioImpactSummary(years, projectedYear)` per design.md, comparing `resolveMetricsForYear` outputs for both scenarios at the same year.
  - Render the resulting percentage label alongside a fixed "Illustrative simulation — not a scientific forecast" caption whenever the current year is a projected year with two or more years `>= 2050` available (or at minimum, whenever any projected year is selected).
  - _Requirements: 5.4, 5.5_

- [x]* 19.1 Unit test: scenario-impact summary derivation and label presence
  - Assert the computed percentage equals the difference between two independently-called `resolveMetricsForYear` results (no hand-authored constant), and assert the "Illustrative simulation" label renders whenever the summary is shown.
  - _Requirements: 5.4, 5.5_

### Tier 6 — Explore (Discover page) overhaul

- [x] 20. Create `filterEcosystems` and the Explore filter category mapping
  - Add `ExploreFilterCategory` type and `filterCategoryToEcosystemTypes` mapping (colocated in `DiscoverPage.tsx` or a new sibling `exploreFilters.ts`).
  - Implement and export `filterEcosystems(ecosystems, searchQuery, activeFilters)` per design.md's pseudocode.
  - _Requirements: 6.1, 6.2_

- [x]* 20.1 PBT: search substring round-trip and filter restriction (Properties 1 & 2)
  - Generate random ecosystem-like fixtures and random substrings drawn from their own fields; assert the source record is always included when searched by that substring with no active filters.
  - Generate random non-empty subsets of `ExploreFilterCategory`; assert `filterEcosystems` with that subset only returns ecosystems whose `type` is in the mapped union.
  - _Requirements: 6.1, 6.2_

- [x] 21. Add search input and filter toggle UI to `DiscoverPage.tsx`
  - Add local `searchQuery`/`activeFilters` state, a search `<input>`, and a row of multi-select filter toggle buttons for the 8 `ExploreFilterCategory` values.
  - Feed the existing card grid through `filterEcosystems(...)`; render an empty-state block when the result is empty instead of an empty grid.
  - Confirm no full-page navigation occurs when typing in the search box or toggling a filter (state-only update).
  - _Requirements: 6.1, 6.2, 6.3, 6.5_

- [x]* 21.1 Unit test: empty-state rendering and no-navigation-on-filter-change
  - Assert a guaranteed-non-matching query renders the empty-state block.
  - Assert typing in the search input or clicking a filter toggle does not invoke router navigation.
  - _Requirements: 6.3, 6.5_

- [x] 22. Extend `EcosystemCard.tsx` with biodiversity count, health indicator, and timeline indicator
  - Compute and display `BiodiversityProfileService.computeProfile(...)`'s `totalSpecies` for the card's ecosystem.
  - Compute and display a compact health indicator derived from `resolveMetricsForYear` at the ecosystem's present-day year.
  - Display a `{years.length} years tracked` timeline indicator alongside the existing past→present→future row.
  - _Requirements: 6.4_

- [x]* 22.1 Unit test: EcosystemCard field completeness across all 8 ecosystems
  - Iterate all 8 ecosystems asserting the rendered card includes name, type label, a species count equal to the independently-computed `BiodiversityProfileService` value, a health indicator, a timeline indicator, and an "Enter Vault" affordance.
  - _Requirements: 6.4_

### Tier 7 — Location-aware "Take It Outside"

- [x] 23. Create the multi-region dataset
  - Create `src/data/observations/regionLocations.ts` with `RegionRecord`/`RegionBoundingBox`/`DemoLocation` (extended with `description`/`exploreUrl`) and `regions: RegionRecord[]` covering Vadodara, Ahmedabad, Mumbai, Delhi, Bengaluru, Hyderabad, New York, and Portland, each with a bounding box, centroid, and a curated `locations` list (adapting the existing Portland-area entries from `demoLocations.ts` into the new shape, and authoring representative demo entries for the other 7 regions).
  - Implement `isWithinBoundingBox`, `haversineDistance`, and `matchRegion(latitude, longitude)` per design.md's pseudocode.
  - Implement `getRegionByEcosystemType(ecosystemType, regionId?)` replacing `getDemoLocations`.
  - Delete `src/data/observations/demoLocations.ts` once all its consumers are migrated (Task 24).
  - _Requirements: 7.1, 7.2, 7.3_

- [x]* 23.1 PBT: region matching containment/nearest correctness (Property 7)
  - Generate random lat/lng pairs, including points deliberately placed inside a known region's bounding box and points far outside all boxes; assert `matchRegion` returns a containing region when one exists, otherwise the nearest-centroid region.
  - _Requirements: 7.2, 7.3_

- [x]* 23.2 Unit test: region dataset completeness
  - Assert `regions` contains exactly the 8 required region ids/labels, each with a valid bounding box and a non-empty `locations` array.
  - _Requirements: 7.1_

- [x] 24. Migrate `LocationService.ts` to the multi-region dataset
  - Replace the single Portland bounding-box check with `matchRegion(latitude, longitude)`; add `matchedRegion: RegionRecord | null` to `ResolvedLocation`, deriving `isWithinDemoRegion` from it for backward compatibility.
  - Update `getManualRegionOptions()` to return one option per region in `regions` (8 options) plus the existing free-text city-search option.
  - Update `getFallbackLocations(ecosystemType, regionId?)` to call `getRegionByEcosystemType`.
  - Update all existing `LocationService` unit tests referencing the old Portland-only behavior to cover the multi-region behavior.
  - _Requirements: 7.2, 7.3, 7.8_

- [x] 25. Update `TakeItOutsidePanel.tsx` copy and region-aware rendering
  - Change title to "TAKE IT OUTSIDE", intro copy to "You explored this ecosystem digitally. Now find something similar in the real world.", resolved-section heading to "Nearby Nature — Based on your location", and denied/unavailable copy to "We couldn't access your location." with the existing "Choose Location" flow.
  - Render each demo location card with a visible "Demo location" tag, its `description`, an "Explore" action (using `exploreUrl` if present, else the existing maps search fallback), and a "Directions" action (maps directions deep link).
  - When `matchedRegion` is set, label the demo section `"Example {matchedRegion.label} locations"` instead of a hardcoded Portland string.
  - _Requirements: 7.4, 7.5, 7.6, 7.7_

- [x] 26. Update `LocationSelector.tsx` for 8-region manual selection
  - Render one button per `getManualRegionOptions()` entry (8 regions), calling a new `onRegionSelected(regionId: string)` callback instead of the single-purpose `onDemoModeSelected`.
  - Wire `TakeItOutsidePanel` to pass the selected `regionId` through to the demo-location rendering path.
  - _Requirements: 7.8_

- [x]* 26.1 Unit test: TakeItOutsidePanel copy, tags, and card fields
  - Assert the exact required copy strings render in their respective states (idle/resolved/unresolved).
  - Assert every demo location card renders a "Demo location" tag, name, type, distance-or-"Distance unknown", description, Explore action, and Directions action.
  - _Requirements: 7.4, 7.5, 7.6, 7.7_

### Tier 8 — Camera, atmosphere, and ambient audio

- [x] 27. Audit and correct `cameraDefaults` per biome against stated vantages
  - Review each of the 8 biomes' `cameraDefaults.position`/`target` against its stated vantage (forest: low eye-level facing trees; wetland: standing near water facing reeds; desert: elevated on a dune facing a valley; alpine: mountain-trail overlook; tropical: inside dense vegetation facing the waterfall; coral reef: underwater near coral; lake: shoreline facing open water; savanna: open-plain vantage) and adjust any that don't match.
  - _Requirements: 8.1_

- [x] 28. Audit and correct `atmosphere` distinctness per biome
  - Compare all 8 biomes' `(fog.color, sun.color, skyTreatment)` tuples; adjust any pair that is not visually distinguishable.
  - _Requirements: 8.2_

- [x]* 28.1 Unit test: atmosphere distinctness across all 8 biomes
  - Assert no two biomes share an identical `(fog.color, sun.color, skyTreatment)` tuple.
  - _Requirements: 8.2_

- [x] 29. Implement `AudioService.ts`
  - Create `src/services/AudioService.ts` implementing `isSupported`, `start(ecosystemId)`, `stop`, `setMuted`, `isMuted`, and the internal per-layer synthesis factories (`wind`/`rain`/`underwater` via filtered noise, `birds`/`insects` via scheduled oscillator chirps, `water` via filtered noise + LFO-modulated filter) per design.md.
  - Define `biomeAudioProfiles` mapping each of the 8 `ecosystemId`s to its required layer set.
  - Ensure no side effects occur on module import — `start()` must be explicitly invoked.
  - _Requirements: 8.3, 8.5, 8.6, 9.3_

- [x]* 29.1 Unit test: AudioService layer mapping, no-autoplay, and shared-context singleton
  - Assert `biomeAudioProfiles` contains the exact required layer set for each of the 8 `ecosystemId`s.
  - Assert no `AudioContext` is constructed and no oscillator/buffer source is started merely by importing the module.
  - Mock the global `AudioContext` constructor and assert it is invoked at most once across multiple `start()` calls for different biomes within the same session.
  - _Requirements: 8.3, 8.6, 9.3_

- [x]* 29.2 Unit test: AudioService graceful degradation
  - Mock `window.AudioContext`/`webkitAudioContext` as undefined (or throwing on construction); assert `isSupported()` returns `false` and `start()`/`setMuted()` do not throw.
  - _Requirements: 8.5_

- [x] 30. Wire `AudioService` into `VaultPage` with a persisted mute control
  - Add `isAudioMuted: boolean` (default `true`) and `setAudioMuted` to `useAppStore`'s persisted slice.
  - Add a mute/unmute button to `VaultPage`'s existing control row; first click calls `AudioService.start(ecosystemId)` and `setAudioMuted(false)`; subsequent clicks toggle `AudioService.setMuted(...)`/`setAudioMuted(...)`.
  - Call `AudioService.stop()` when the Vault unmounts or `ecosystemId` changes.
  - _Requirements: 8.4, 8.6_

- [x]* 30.1 Unit test: mute-state persistence across navigation
  - Toggle `setAudioMuted` and assert the persisted `useAppStore` slice reflects the new value, following the existing store-persistence test pattern.
  - _Requirements: 8.4_

### Tier 9 — Ecosystem overview panel (supports the biodiversity/health-at-a-glance requirement)

- [x] 31. Implement `EcosystemOverviewPanel.tsx`
  - Create the component per design.md: health percentage (derived from current `VaultStateMetrics`), species count (via `BiodiversityProfileService`), deduplicated key-features list, and deduplicated main-pressures list (both capped at 5, derived from currently-visible objects).
  - Wire it into `VaultPage`: shown once per Vault session after loading completes, dismissible via local component state, re-shown on Vault re-entry.
  - _Requirements: 3.5, 3.6, 3.7, 3.8_

- [x]* 31.1 Unit test: EcosystemOverviewPanel derivation and dismissal behavior
  - Assert the displayed health percentage matches the design.md formula applied to the given metrics.
  - Assert the species count matches `BiodiversityProfileService.computeProfile(...).totalSpecies`.
  - Assert the key-features and main-pressures lists are derived from (not independent of) the currently-visible objects, and are capped at 5.
  - Assert dismissing the panel hides it for the remainder of the session but it reappears on simulated re-entry.
  - _Requirements: 3.5, 3.6, 3.7, 3.8_

### Tier 10 — Performance

- [x] 32. Route-level code splitting for `VaultPage`
  - Convert `VaultPage`'s import in `App.tsx` to `React.lazy(...)`, wrapping its `<Route>` element in `<Suspense>` with a lightweight fallback (reusing `VaultLoadingScreen` or a minimal spinner).
  - Run `npm run build` and confirm the build output shows a separate chunk containing Vault/Three.js-related code rather than everything in the main chunk.
  - _Requirements: 9.2_

- [x] 33. Verify instancing pattern and per-biome object-count budget
  - Confirm `Crab`/`Turtle`/`Anemone` follow the correct pattern (`Anemone` instanced per design.md; `Crab`/`Turtle` non-instanced, matching low-count wildlife precedent).
  - Confirm every biome's total `objects.length` after all Tier 1/3/4 additions remains within 20-60.
  - _Requirements: 9.1, 9.4_

- [x]* 33.1 Unit test: per-biome object-count budget
  - Iterate the `vaults` map asserting every biome's `objects.length` is within `[20, 60]`.
  - _Requirements: 9.4_

### Tier 11 — Full QA pass and final verification

- [x] 34. Cross-page dead-end audit
  - Walk every button/link/control across Landing, Discover, Navigation, Profile, Archive, all 8 Vaults, Timeline, Biodiversity panel, Object Inspector, Story Mode, Compare, Take It Outside, Demo Mode, and back-navigation; fix any control found to be non-functional.
  - _Requirements: 10.1_

- [x] 35. Manual end-to-end verification across all 8 biomes
  - For each biome: enter the Vault, confirm the `EcosystemOverviewPanel` appears and dismisses correctly, drag the timeline across all years including both projected years, toggle Biodiversity view and every category filter, open Object Inspector for at least one instance of every object kind newly added in Tier 1, run Compare (split and swipe) with the year-picker across old and new years, toggle the audio mute control, and trigger Take It Outside with geolocation allowed (simulating at least two different regions) and denied.
  - Confirm no console errors and no visually broken/missing assets during this pass.
  - _Requirements: 10.2_

- [x] 36. Refresh/persistence verification
  - Refresh the browser on each of `/vault/:ecosystemId` for all 8 ecosystem ids, plus `/discover`, `/archive`, `/my-vault`, `/impact`; confirm no blank screen or unhandled error, consistent with existing persistence behavior.
  - _Requirements: 10.3_

- [x] 37. Final build and full test suite verification
  - Run `npm run build` (type-check + production build) and `npm run test` (full Vitest suite including all new unit/PBT tests added above); fix any failures before considering the feature complete.
  - _Requirements: all_

## Notes

- Tasks marked with `*` are optional testing sub-tasks and can be skipped for a faster pass; core implementation tasks (unmarked) should not be skipped.
- No new runtime or dev dependencies are introduced by this plan; `vitest`/`fast-check` are already present from `biome-architecture-expansion`.
- Tier ordering follows the user-specified priority: biome differentiation (Tiers 0-2) → 3D visual quality (Tier 2) → biodiversity density/interactions (Tier 3) → multi-year timeline (Tier 4) → future scenario divergence (Tier 5) → Explore functionality (Tier 6) → location-aware Take It Outside (Tier 7) → camera/atmosphere/audio (Tier 8) → ecosystem overview panel (Tier 9, supports biodiversity requirement surfaced at Vault entry) → performance (Tier 10) → full QA pass (Tier 11).
- Tier 0 (BiomeStyle wiring) is placed first because Tasks 4-12 (biome content gaps) explicitly rely on `resolveBiomeStyle`/`colorOverride` existing to satisfy the "reused primitive gets a distinguishing override" requirement (2.4) and the "resolve color from biome.style" requirement (1.1/1.2).

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1", "2"] },
    { "id": 1, "tasks": ["1.1", "2.1", "3"] },
    { "id": 2, "tasks": ["4", "5", "6", "7", "8", "9", "10", "11"] },
    { "id": 3, "tasks": ["12"] },
    { "id": 4, "tasks": ["13", "14"] },
    { "id": 5, "tasks": ["15"] },
    { "id": 6, "tasks": ["15.1", "15.2", "16"] },
    { "id": 7, "tasks": ["16.1", "17"] },
    { "id": 8, "tasks": ["17.1", "18"] },
    { "id": 9, "tasks": ["18.1", "18.2", "19"] },
    { "id": 10, "tasks": ["19.1", "20"] },
    { "id": 11, "tasks": ["20.1", "21", "23"] },
    { "id": 12, "tasks": ["21.1", "22", "23.1", "23.2", "24"] },
    { "id": 13, "tasks": ["22.1", "25", "27", "28"] },
    { "id": 14, "tasks": ["26", "28.1", "29"] },
    { "id": 15, "tasks": ["26.1", "29.1", "29.2", "30"] },
    { "id": 16, "tasks": ["30.1", "31", "32"] },
    { "id": 17, "tasks": ["31.1", "33"] },
    { "id": 18, "tasks": ["33.1", "34"] },
    { "id": 19, "tasks": ["35"] },
    { "id": 20, "tasks": ["36"] },
    { "id": 21, "tasks": ["37"] }
  ]
}
```

Dependency notes:
- Wave 0-1 establishes `resolveBiomeStyle`, `colorOverride` threading, the generalized density-dropout helper, and the three new primitives (`Crab`/`Turtle`/`Anemone`) that Wave 2's per-biome content tasks depend on.
- Wave 2 (Tasks 4-11) edits distinct biome data files in parallel (each biome is its own file, no conflicts); Wave 3 (Task 12) applies `style.entries` across all of them afterward since style overrides reference the objects/kinds those tasks introduce.
- Waves 4 onward are largely sequential per-tier (timeline expansion depends on nothing from biome differentiation but is sequenced after it per priority order; scenario divergence depends on timeline expansion existing so multiple projected years are present to scale between; Explore/Take-It-Outside/Audio tiers are independent of each other and of the biome-content tiers, but are kept in the user's specified priority order rather than parallelized ahead of it).
- Tier 11 (Tasks 34-37) depends on everything before it, since it is the final cross-cutting audit and verification gate.
