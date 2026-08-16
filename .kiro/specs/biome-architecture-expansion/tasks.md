# Implementation Plan: Biome Architecture Expansion

## Overview

This implementation plan expands the ecosystem vault from 4 to 8 biomes by generalizing the currently hardcoded, single-biome rendering pipeline (terrain, water, atmosphere, camera) into a data-driven `BiomeDefinition` architecture. It also introduces a biodiversity hierarchy (trophic role, habitat, diet, environmental pressures) on environmental objects, fixes `LocationService` to stop guessing user location and instead resolve it explicitly or fall back to a manual selector, and generalizes the `Timeline` component to support longer, variable-length year arrays instead of the fixed 2-3 year assumption. Work is organized into tiers: Tier 0 builds the shared infrastructure (test tooling, core types, terrain/water/atmosphere strategy systems, the biodiversity profile service, and the location fix) that every biome and downstream feature depends on; Tiers 1-3 author the 8 individual biomes on top of that infrastructure; Tier 4 backfills biodiversity data; Tier 5 surfaces the richer data in the UI; Tier 6 polishes the timeline; and Tier 7 performs a final navigation audit and full verification pass.

## Tasks

### Tier 0 — Test infrastructure and core types

- [x] 1. Set up Vitest and fast-check
  - Add `vitest` and `fast-check` as devDependencies; add a `"test": "vitest --run"` script to `package.json`.
  - Add minimal `vitest.config.ts` (or reuse `vite.config.ts` via `test` field) pointing at `src/**/*.test.ts`.
  - Add one trivial smoke test to confirm the runner works end-to-end.
  - _Requirements: 2.7, 7.7, 9.3 (test infra needed for the property tests in later tasks)_

- [x] 2. Create `src/types/biome.ts`
  - Define `TerrainKind`, `TerrainPalette`, `TerrainConfig`, `WaterKind`, `WaterConfig`, `SkyTreatment`, `AtmosphereProfile`, `CameraDefaults`, `BiomeStyleEntry`, `BiomeStyle`, `TrophicRole`, `BiodiversityProfile`, `ManualRegionOption` exactly as shaped in design.md's "Components and Interfaces" section 1.
  - _Requirements: 1.1_

- [x] 3. Extend `src/types/vault.ts` with `BiomeDefinition`
  - Add new `ObjectKind` values (`creek`, `lake`, `waterfall`, `fern`, `moss`, `log`, `cactus`, `dryRiverbed`, `vine`, `tropicalFlower`, `canopyTree`, `coral`, `fishSchool`, `termiteMound`).
  - Add optional `EnvironmentalObject` fields: `variant`, `trophicRole`, `habitat`, `diet`, `environmentalPressures`, `featureRadius`.
  - Rename `VaultDefinition` to `BiomeDefinition`, adding required `terrain`, `water`, `atmosphere`, `cameraDefaults`, `style` fields; add `export type VaultDefinition = BiomeDefinition;` alias.
  - Run `tsc -b` and fix any compile errors surfaced by the new required fields (expected — existing data files won't yet satisfy `BiomeDefinition`; this is resolved in Tier 1 tasks, so it's acceptable for this task to leave data files temporarily non-compiling only if immediately followed by placeholder biome-config additions to each existing data file to keep the build green).
  - _Requirements: 1.2, 1.3, 1.4, 1.6, 1.7_

- [x] 4. Add temporary/default biome config to the 4 existing data files
  - Add a minimal valid `terrain` (`rolling-hills`), `water` (matching each biome's existing feature), `atmosphere` (approximating current hardcoded `VaultScene` lighting/fog values), `cameraDefaults` (matching current `VaultScene` camera prop `{position: [0,1.7,9], fov: 55}`), and `style: {entries: []}` to `evergreenValley.ts`, `coastalWetland.ts`, `alpineEcosystem.ts`, `urbanGreenSpace.ts` so the project compiles against the new `BiomeDefinition` shape before deeper per-biome work begins.
  - Verify `npm run build` (`tsc -b && vite build`) succeeds.
  - _Requirements: 1.2, 1.4_

### Tier 0 — Terrain strategy system

- [x] 5. Extract terrain strategy interface and `rolling-hills` strategy
  - Create `src/components/Ecosystem/terrainStrategies/types.ts` with `TerrainVertexContext` and `TerrainStrategy`.
  - Create `src/components/Ecosystem/terrainStrategies/rollingHills.ts`, moving the existing height/color math out of `Terrain.tsx` verbatim into `computeHeight`/`computeColor`.
  - Create `src/components/Ecosystem/terrainStrategies/index.ts` exporting a `terrainStrategies: Record<TerrainKind, TerrainStrategy>` registry (initially only `rolling-hills` populated; other keys added in later tasks, with TypeScript enforcing all keys are present before this compiles).
  - Refactor `Terrain.tsx` to accept a `config: TerrainConfig` prop and delegate its vertex loop to `terrainStrategies[config.kind]`, deriving `waterInfluence` per-vertex from `featureRadius` on each `waterBodies` entry (replacing the old `radius: number` shape) instead of the previous fixed radius.
  - Update `VaultScene.tsx`/`CompareView.tsx` call sites that build `waterBodies` to pass `featureRadius` from each object (falling back to the existing `kind === 'river' ? 9 : 4.5` default only when `featureRadius` is unset, to avoid breaking existing data before it's backfilled).
  - _Requirements: 2.1, 2.2, 2.3, 2.7, 2.8_

- [x] 6. Write property-based tests for `rollingHills` determinism
  - Test: for random `(x, z, index)` inputs, calling `computeHeight`/`computeColor` twice returns identical output (P7).
  - Test: `computeColor` always returns RGB components in `[0,1]`.
  - _Requirements: 2.7_

- [x] 6.1 PBT: rollingHills determinism and color bounds
  - Use fast-check to generate random vertex contexts and assert P7 (determinism) and the `[0,1]` color-bound property.
  - _Requirements: 2.7_

- [x] 7. Implement remaining terrain strategies
  - Create `flatGrassland.ts` (near-zero height variance).
  - Create `dunedDesert.ts` (larger-amplitude, lower-frequency undulation than rolling-hills; parameterized by `params.duneAmplitude`).
  - Create `elevatedCliffs.ts` (base elevation offset + higher-amplitude ridges + rock-face color band above a height threshold; parameterized by `params.cliffFaces`/`elevationScale`).
  - Create `seafloor.ts` (height always `<= -params.seafloorDepth`, gentle undulation only, blue-green tinted palette blend).
  - Register all four in the `terrainStrategies` registry.
  - _Requirements: 2.1, 2.4, 2.5, 2.6_

- [x] 7.1 PBT: seafloor stays below water plane
  - Generate random `(x, z, index, seafloorDepth)` and assert `computeHeight(...) <= -seafloorDepth` for all generated inputs (part of P8/postcondition verification for the `seafloor` strategy).
  - _Requirements: 2.6_

- [x] 7.2 PBT: duned-desert vs rolling-hills amplitude distinction
  - Generate random sample vertex grids; assert the standard deviation (or max-min range) of `dunedDesert.computeHeight` output exceeds that of `rollingHills.computeHeight` output for the same inputs, confirming dunes read as higher-amplitude terrain.
  - _Requirements: 2.4_

### Tier 0 — Water variant system

- [x] 8. Extract shared water shader hook
  - Create `src/components/Ecosystem/water/useWaterShaderMaterial.ts`, moving the vertex/fragment shader source and uniform construction out of `Water.tsx` into a reusable hook `useWaterShaderMaterial({ deepColor, shallowColor, selected, dimmed, flowAxis? })`.
  - _Requirements: 3.1_

- [x] 9. Create water variant components
  - Rename/relocate `Water.tsx` to `src/components/Ecosystem/water/PondMarsh.tsx`, updated to use the shared hook; keep its existing prop shape and behavior for `pond`/`river` kinds.
  - Create `CreekStream.tsx` (narrow elongated shape via a thin `Shape`, directional UV-scroll shimmer) for `creek`.
  - Create `LakeShoreline.tsx` (larger default radius, lower default irregularity) for `lake`.
  - Create `Waterfall.tsx` (near-vertical plane, fast one-directional scroll, small instanced foam burst at the base) for `waterfall`.
  - _Requirements: 3.2_

- [x] 10. Create `WaterFeatureRenderer.tsx` and migrate dispatch out of `EnvironmentalObjectRenderer`
  - Add `WaterFeatureRenderer.tsx` that dispatches each visible water-kind object to its matching variant component by `object.kind`.
  - Remove the `river`/`pond` cases from `EnvironmentalObjectRenderer.tsx`'s switch statement (moved into `WaterFeatureRenderer`).
  - Update `SceneComposition` (created in Tier 0 scene task) to render `WaterFeatureRenderer` alongside `EnvironmentalObjectRenderer` for non-water objects.
  - _Requirements: 3.3, 3.6_

- [x] 11. Enforce water-kind absence rules at data-authoring time
  - Add a small dev-time assertion/lint helper (or a unit test run against each biome data file) verifying: if `biome.water.kind === 'none'`, no object has a water-kind (`river`/`pond`/`creek`/`lake`/`waterfall`); if `biome.water.kind === 'underwater-ambient'`, `WaterFeatureRenderer` is not used for that biome (verified by biome data review, not runtime dispatch).
  - _Requirements: 3.4, 3.5_

- [x] 11.1 Unit test: water-kind/biome-config consistency (P3)
  - Write a test that iterates every biome in the `vaults` map and asserts P3 from design.md (`water.kind === 'none'` implies no water-kind objects present).
  - _Requirements: 3.4_

### Tier 0 — Atmosphere system

- [x] 12. Create `AtmosphereRenderer` and `UnderwaterAmbience`
  - Create `src/components/Ecosystem/atmosphere/AtmosphereRenderer.tsx` dispatching on `profile.skyTreatment`.
  - Move `SkyAndClouds.tsx` under `src/components/Ecosystem/atmosphere/`, updating it to source sun color/fog turbidity from the passed `AtmosphereProfile` instead of hardcoded literals.
  - Create `UnderwaterAmbience.tsx`: no sky dome; animated translucent light-shaft planes (reusing the drifting-motion pattern from `SkyAndClouds`'s clouds) plus slow-rising instanced bubble particles.
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [x] 13. Create `SceneComposition.tsx` and wire declarative fog/lighting
  - Create `src/components/Ecosystem/SceneComposition.tsx` containing the full render tree currently split between `VaultScene.tsx`'s `SceneContents` and `CompareView.tsx`'s `MiniScene`: `<fog attach="fog" .../>` (from `biome.atmosphere.fog`), `directionalLight`/`ambientLight`/`hemisphereLight` (from `biome.atmosphere`), `<AtmosphereRenderer profile={biome.atmosphere} .../>`, `<Terrain config={biome.terrain} .../>`, `<WaterFeatureRenderer .../>`, and per-object `<EnvironmentalObjectRenderer .../>` with existing selection/hover/dimming logic, gated by an `interactive` prop.
  - Refactor `VaultScene.tsx` to a thin `Canvas` (using `biome.cameraDefaults`) + `OrbitControls` wrapper around `<SceneComposition interactive={true} .../>`; remove its imperative `scene.fog = ...` assignment.
  - Refactor `CompareView.tsx`'s `MiniScene` to a thin `Canvas` + `OrbitControls` wrapper around `<SceneComposition interactive={false} .../>`, removing its duplicated lighting/terrain/object-rendering JSX.
  - _Requirements: 4.5, 4.6, 5.1, 5.2, 5.3, 5.4_

- [x] 14. Verify build and manually smoke-test all 4 existing biomes
  - Run `npm run build`; run the dev server manually (user-run, not agent-run) and confirm all four existing biomes still render correctly through the refactored `SceneComposition` pipeline with no visual regression.
  - _Requirements: 4.5, 5.4_

### Tier 0 — Biodiversity profile service

- [x] 15. Implement `BiodiversityProfileService`
  - Create `src/services/BiodiversityProfileService.ts` with `EDUCATIONAL_DATA_DISCLAIMER` constant and `computeProfile(biome, year?)` per the pseudocode in design.md.
  - _Requirements: 7.5, 7.7_

- [x] 15.1 PBT: computeProfile totalSpecies matches filtered count (P5)
  - Generate random small object lists (random `biodiversityCategory | null`, random `presentInYears`, random `trophicRole | undefined`) and random `year` values; assert `computeProfile(...).totalSpecies` always equals the count of objects present in that year with non-null `biodiversityCategory`.
  - _Requirements: 7.7_

- [x] 15.2 Unit test: computeProfile edge cases
  - Test empty `objects` array yields all-zero profile.
  - Test omitted `year` unions across all years (no double-counting duplicate ids is naturally satisfied since input is a flat array, but confirm behavior matches design intent).
  - _Requirements: 7.5_

### Tier 0 — Location service fix

- [x] 16. Rewrite `LocationService.ts`
  - Implement `resolveLocation()` per the pseudocode in design.md: geolocation → keyless reverse-geocode fetch to `api.bigdatacloud.net/data/reverse-geocode-client` → `ResolvedLocation` / `UnresolvedLocation` discriminated union.
  - Implement `buildMapsSearchUrl(latitude, longitude, query?)` using `encodeURIComponent` for any free-text query.
  - Implement `isWithinPortlandBoundingBox` (private helper) and `isWithinDemoRegion` flag on resolved results.
  - Keep `getFallbackLocations`/add `getManualRegionOptions` for the manual-selector fallback.
  - Ensure geolocation is only invoked from a function called in response to a user action (verify no `useEffect`-on-mount invocation exists anywhere in the codebase).
  - Cache the in-flight/last result in memory for the session to avoid redundant fetches on repeated panel opens.
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7_

- [x] 16.1 Unit test: buildMapsSearchUrl encoding
  - Assert correct URL construction/encoding for coordinate-only and free-text-query variants.
  - _Requirements: 8.1, 8.2_

- [x] 16.2 Unit test: resolveLocation status transitions
  - Mock `navigator.geolocation` and `fetch` to cover: granted+geocode success → `resolved`; granted+geocode failure → `geocode-failed`; denied/timeout → `unavailable`.
  - Assert `status !== 'resolved'` results never carry a `city`/`region` value (P6).
  - _Requirements: 8.1, 8.2, 8.3, 8.6_

- [x] 17. Create `LocationSelector.tsx`
  - Build the manual fallback UI per design.md section 11: `ManualRegionOption` buttons, free-text city search building a `mapsSearchUrl`, "Try location access again" button re-invoking `resolveLocation()`, explicit "we won't guess" copy.
  - _Requirements: 8.3, 8.6_

- [x] 18. Rewrite `TakeItOutsidePanel.tsx`
  - Replace the boolean `checking`/`locations` state with an explicit `'idle' | 'resolving' | 'resolved' | 'unresolved'` state machine driven by `LocationService.resolveLocation()`.
  - Render resolved city/region + `mapsSearchUrl` button; render curated `demoLocations` only when `isWithinDemoRegion === true`, under an explicit "Example Portland-area locations" heading.
  - Render `LocationSelector` when `status === 'unresolved'`.
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.6_

### Tier 1 — Coastal Wetland flagship upgrade

- [ ] 19. Author full biome config for Coastal Wetland
  - Replace the Tier-0 placeholder config in `coastalWetland.ts` with a real `terrain` (rolling-hills, wetland palette), `water` (`pond-marsh`), `atmosphere` (coastal haze fog, cooler light), `cameraDefaults`, and `style` per design.md's migration table.
  - _Requirements: 6.2_

- [ ] 20. Expand Coastal Wetland timeline to 6 years
  - Expand `years` from `[1980, 2026, 2050]` to `[1980, 1995, 2010, 2026, 2035, 2050]` with authored `metrics`/`summary`/`keyChanges` for each new year, keeping the existing 1980/2026/2050 content as anchors and interpolating narratively (not just numerically) for 1995/2010/2035.
  - _Requirements: 6.2, 9.1_

- [ ] 21. Backfill biodiversity hierarchy fields on Coastal Wetland objects
  - Add `trophicRole`, `habitat`, `diet` (where relevant), and `environmentalPressures` to every existing `EnvironmentalObject` in `coastalWetland.ts`.
  - _Requirements: 7.1, 7.2, 7.3, 6.2_

- [ ] 22. Exercise CompareView year-picker against Coastal Wetland
  - Add the year-picker UI to `CompareView.tsx` (two `<select>` elements defaulting to `[minYear, maxYear]`), replacing direct `vault.years[0]`/`vault.years[1]` indexing with `resolveMetricsForYear` calls for both selected years.
  - Manually verify all 6 Coastal Wetland years are selectable on both sides.
  - _Requirements: 9.4_

### Tier 2 — Desert, Coral Reef, Temperate Forest upgrade

- [ ] 23. Create new primitives: `Cactus`, `DryRiverbed`
  - Follow the existing single-purpose primitive file pattern (see `Rock.tsx`/`PathRibbon.tsx`) for both.
  - _Requirements: 6.6_

- [ ] 24. Author `src/data/ecosystems/desert.ts`
  - `terrain.kind: 'duned-desert'`, `water.kind: 'none'`, atmosphere per design.md example (harsh bright sun, minimal fog), `cactus`/`dryRiverbed` objects with full biodiversity-hierarchy fields, 3+ year timeline, story chapters.
  - _Requirements: 6.6, 6.1_

- [ ] 24.1 Unit test: Desert has no water-kind objects (P3 instance)
  - Assert `desertVault.objects` contains no object with `kind` in `{river, pond, creek, lake, waterfall}`.
  - _Requirements: 6.6, 3.4_

- [ ] 25. Create new primitives: `Coral`, `FishSchool`
  - `Coral`: branching instanced clusters, color from `biome.style`.
  - `FishSchool`: instanced mesh with boid-lite drift (modeled after `Bird`'s circling pattern, horizontal/grouped).
  - _Requirements: 6.9_

- [ ] 26. Author `src/data/ecosystems/coralReef.ts`
  - `terrain.kind: 'seafloor'`, `water.kind: 'underwater-ambient'`, `atmosphere.skyTreatment: 'underwater-ambience'`, `coral`/`fishSchool` objects, no terrestrial object kinds, biome-appropriate `cameraDefaults` (lower/closer), full biodiversity-hierarchy fields, timeline, story chapters.
  - _Requirements: 6.9, 6.1_

- [ ] 26.1 Unit test: Coral Reef has no terrestrial objects (P4 instance)
  - Assert `coralReefVault.objects` contains no object with `kind` in `{tree, canopyTree, building, road, path, cactus}`.
  - _Requirements: 6.9, 3.5_

- [ ] 27. Create new primitives: `Fern`, `MossPatch`, `FallenLog`
  - Follow existing primitive pattern; `Fern`/`MossPatch` can reuse `MeadowPatch`'s instancing approach with different geometry/color, `FallenLog` a simple elongated cylinder like `Tree`'s trunk.
  - _Requirements: 6.3_

- [ ] 28. Upgrade `evergreenValley.ts`: creek + forest floor detail
  - Replace the existing `river-main` (`kind: 'river'`) object with a `creek` object using `CreekStream`; set `water.kind: 'creek-stream'`.
  - Add `fern`, `moss`, `log` objects with biodiversity-hierarchy fields.
  - Apply real biome config (terrain/atmosphere/cameraDefaults/style) replacing the Tier-0 placeholder.
  - _Requirements: 6.3_

- [ ] 28.1 Unit test: Evergreen Valley has no river/pond objects post-migration
  - Assert `evergreenValleyVault.objects` contains no object with `kind` in `{river, pond}` and at least one `creek` object.
  - _Requirements: 6.3_

### Tier 3 — Remaining biomes (structurally complete, simpler)

- [ ] 29. Upgrade `alpineEcosystem.ts`: real elevation
  - Set `terrain.kind: 'elevated-cliffs'` with appropriate `params`; keep the existing `Mountain` object as a distant backdrop only (not the primary elevation cue); apply real `atmosphere`/`cameraDefaults`/`style`.
  - _Requirements: 6.4_

- [ ] 30. Create `LakeShoreline`-based `freshwaterLake.ts`
  - `terrain.kind: 'flat-grassland'` near shore, `water.kind: 'lake-shoreline'` with a larger `featureRadius` than existing pond/river features, reusing the existing `Tree`/`Rock`/`Bird`/`Animal`/`Fungi` roster, full biodiversity-hierarchy fields, timeline, story chapters.
  - _Requirements: 6.7, 6.1_

- [ ] 30.1 Unit test: Freshwater Lake featureRadius exceeds existing pond radius
  - Assert the lake object's `featureRadius` is greater than the largest `featureRadius`/default radius used by any existing pond object, confirming visual distinction from wetland marsh.
  - _Requirements: 6.7_

- [ ] 31. Create new primitives: `Vine`, `TropicalFlower`; add `canopyTree` variant to `Tree`
  - `Vine`: draped instanced curve segments on a host tree.
  - `TropicalFlower`: brighter-palette variant of `Pollinator`'s flower styling.
  - Add a `variant="broadleaf"` code path to `Tree.tsx` (wider, flatter foliage geometry) used for `canopyTree`.
  - _Requirements: 6.8_

- [ ] 32. Author `src/data/ecosystems/tropicalForest.ts`
  - Dense canopy (`canopyTree`), `vine`, `waterfall` water feature (`water.kind: 'waterfall'`), `tropicalFlower` objects; humid-haze `atmosphere` (warm diffuse light, dense near fog); full biodiversity-hierarchy fields; timeline; story chapters.
  - _Requirements: 6.8, 6.1_

- [ ] 33. Create `TermiteMound` primitive
  - Simple tapered cone cluster following `Rock.tsx`'s build pattern.
  - _Requirements: 6.5_

- [ ] 34. Rename Urban Green Space to Grassland/Savanna
  - Rename `src/data/ecosystems/urbanGreenSpace.ts` to `grasslandSavanna.ts` (use `smart_relocate` to preserve imports); change `ecosystemId` to `grassland-savanna`.
  - Change ecosystem `type` from `'urban-green-space'` to `'savanna'` in `types/ecosystem.ts`'s `EcosystemType` union.
  - Replace content: `flat-grassland` terrain, scattered broadleaf `Tree`s, a small `pond`-based watering hole, `termiteMound` objects, grazing `Animal` objects; full biodiversity-hierarchy fields; timeline; story chapters.
  - Update every reference to the old id/type: `data/ecosystems/index.ts`, `data/ecosystems/vaults.ts`, `components/Dashboard/EcosystemCard.tsx` (`gradientByType`), `data/observations/demoLocations.ts`, `data/observations/conservationActions.ts`.
  - _Requirements: 6.5, 10.2_

- [ ] 34.1 Unit test: no remaining references to `urban-green-space`
  - Grep-style test (or a small Node script run as a vitest test) asserting no source file under `src/` contains the literal string `urban-green-space` after the rename.
  - _Requirements: 6.5, 10.2_

### Tier 4 — Biodiversity hierarchy backfill (remaining biomes)

- [ ] 35. Backfill `trophicRole`/`habitat`/`diet`/`environmentalPressures` on Alpine, Freshwater Lake, Tropical Forest, Grassland/Savanna, and Desert/Coral Reef objects not already covered in their authoring tasks
  - Ensure every `EnvironmentalObject` with a non-null `biodiversityCategory` across all 8 biomes has at least `trophicRole` and `habitat` populated.
  - _Requirements: 7.1, 7.2, 7.3_

- [ ] 35.1 Unit test: biodiversity field coverage across all 8 biomes
  - Iterate the `vaults` map; assert every object with non-null `biodiversityCategory` has a defined `trophicRole` and `habitat`.
  - _Requirements: 7.1, 7.2_

### Tier 5 — ObjectInspector panel richness

- [ ] 36. Update `ObjectInspector.tsx` layout
  - Insert trophic-role badge, Habitat section, Diet section, Environmental pressures section in the order specified in design.md section 9, each conditionally rendered on field presence.
  - Extend the `kindLabel` map with all new `ObjectKind` values.
  - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [ ] 37. Update `BiodiversityPanel.tsx` with species-count summary
  - Add a summary card rendering `BiodiversityProfileService.computeProfile(biome, year)` output ("N species represented — X Plants, Y Birds...") plus the `EDUCATIONAL_DATA_DISCLAIMER`, above the existing category filter grid.
  - _Requirements: 7.6_

### Tier 6 — Timeline polish

- [ ] 38. Generalize `Timeline.tsx` tick-label rendering
  - When `years.length > 5`, render only first/last/currently-selected year as visible text labels while keeping all years as draggable/snappable/tappable stops (via `<datalist>`/range `step` behavior already in place); verify no change needed for `min`/`max`/nearest-snap logic per design.md's Timeline review.
  - _Requirements: 9.1, 9.2_

- [ ] 38.1 Unit test: Timeline snap-to-nearest works for 7-element years array
  - If a lightweight component test harness is feasible with the newly-added Vitest setup, simulate a range input change and assert the nearest-year snap logic selects the correct year for a 7-year array; otherwise document as a manual QA step in the integration checklist (Tier 7).
  - _Requirements: 9.1_

- [ ] 38.2 Unit test: ScenarioService generalizes to N years (regression guard)
  - Assert `resolveMetricsForYear`/`lerpMetrics`/`applyScenario` behave correctly for 2-, 3-, and 7-element `years` arrays (confirming design.md's "no changes required" claim holds under test).
  - _Requirements: 9.3_

- [ ] 38.3 PBT: applyScenario metrics stay in [0,1] (P2)
  - Generate random baseline metrics and random scenario modifiers; assert `applyScenario` output is always within `[0,1]^4`.
  - _Requirements: 9.3_

### Tier 7 — Navigation audit and general polish

- [ ] 39. Ecosystem card and route audit for all 8 biomes
  - Verify `EcosystemCard`'s `gradientByType` has an entry for every biome type including `savanna`, `tropical-forest`, `desert`, `lake`, `coral-reef` (whichever type keys are introduced by Tier 1-3 data files) — add missing entries.
  - Verify `/vault/:ecosystemId` resolves correctly for all 8 ids; verify `ArchivePage`/`MyVaultPage`/`ImpactPage`/`ProfilePanel` correctly list/link all 8 once explored.
  - _Requirements: 10.1, 10.2, 10.3_

- [ ] 40. Author story chapters and loading-screen variety for the 4 new biomes
  - Add `storyChapters` (already required by `BiomeDefinition`, authored in Tier 2/3 tasks) — this task covers a final narrative-quality pass/edit rather than first authoring.
  - _Requirements: 6.8, 6.6, 6.9, 6.5_

- [ ] 41. Manual end-to-end navigation checklist across all 8 biomes
  - For each biome: Discover → card click → Vault entry → timeline drag across all years → Biodiversity View + each category filter → Object Inspector open for at least one object of each new `ObjectKind` present in that biome → Compare (split and swipe) with year-picker → Take It Outside (geolocation allowed and denied) → back to Discover/Archive.
  - Record and fix any dead-end control found during this pass.
  - _Requirements: 10.1, 10.4_

- [ ] 42. Full build and test suite verification
  - Run `npm run build` (type-check + production build) and `npm run test` (Vitest suite including all PBT/unit tests added above); fix any failures before considering the feature complete.
  - _Requirements: all_

## Notes

- Tasks marked with `*` do not appear in this plan as standalone top-level items; instead, testing sub-tasks (numbered with decimal notation, e.g. `6.1`, `11.1`) are the equivalent optional units of work and can be skipped for a faster MVP pass.
- This plan introduces `vitest` and `fast-check` as new devDependencies (Task 1) to support both unit tests and property-based tests (PBTs); no test tooling previously existed in the project.
- Tiering reflects an explicit priority order: Tier 0 (shared infrastructure — types, terrain/water/atmosphere strategy systems, biodiversity profile service, location fix) must land first since every other tier builds on it. Tier 1 delivers one flagship biome end-to-end as a template. Tiers 2-3 scale that pattern out to the remaining new biomes. Tier 4 backfills data quality. Tier 5 surfaces richer data in the UI. Tier 6 hardens the timeline for longer year arrays. Tier 7 is a final cross-cutting audit and verification pass.
- Full visual parity/polish across all 8 biomes is explicitly not expected after a single pass through Tiers 1-3; later tasks (Tier 4 backfill, Tier 7 narrative pass in Task 40, manual QA in Task 41) intentionally revisit and refine earlier work rather than requiring perfection up front.
- Manual/exploratory verification tasks (e.g. Task 14's visual smoke test, Task 41's navigation checklist) are included because they surface regressions that automated tests in this plan don't cover, but the automated `npm run build` and `npm run test` in Task 42 remain the authoritative completion gate.

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1", "2"] },
    { "id": 1, "tasks": ["3"] },
    { "id": 2, "tasks": ["4"] },
    { "id": 3, "tasks": ["5", "8", "12", "15", "16"] },
    { "id": 4, "tasks": ["6", "6.1", "7", "9", "13", "15.1", "15.2", "16.1", "16.2"] },
    { "id": 5, "tasks": ["7.1", "7.2", "10", "17"] },
    { "id": 6, "tasks": ["11", "14", "18"] },
    { "id": 7, "tasks": ["11.1"] },
    { "id": 8, "tasks": ["19", "23", "25", "27", "29", "31", "33", "38"] },
    { "id": 9, "tasks": ["20", "21", "24", "26", "28", "30", "32", "34", "38.1", "38.2", "38.3"] },
    { "id": 10, "tasks": ["22", "24.1", "26.1", "28.1", "30.1", "34.1"] },
    { "id": 11, "tasks": ["35"] },
    { "id": 12, "tasks": ["35.1", "36", "37"] },
    { "id": 13, "tasks": ["39", "40"] },
    { "id": 14, "tasks": ["41"] },
    { "id": 15, "tasks": ["42"] }
  ]
}
```

Dependency notes:
- Tier 0 (tasks 1-18) blocks all Tier 1+ tasks: every later biome file depends on the `BiomeDefinition` type (2, 3), the terrain strategies (5, 7), the water variant system (8, 9, 10), the atmosphere/`SceneComposition` system (12, 13), the `BiodiversityProfileService` (15), and/or `LocationService` (16-18).
- Tier 1 (tasks 19-22) does not block Tier 2/3 directly; those tiers depend on Tier 0's `SceneComposition`/terrain-strategy/water-variant tasks (5, 7, 9, 10, 13) rather than on Tier 1's Coastal Wetland authoring work.
- Tier 2/3 biome-authoring tasks (23-34) all depend on Tier 0 tasks 5, 7, 9, 10, and 13 being complete, since each new biome file references the terrain/water/atmosphere config shapes and rendering pipeline those tasks establish.
- Tier 4 (task 35) depends on the biome-authoring tasks in Tiers 1-3 (19-34) since it backfills fields on objects those tasks create.
- Tier 5 (tasks 36-37) depends on Tier 0's `BiodiversityProfileService` (15) and on biome data existing (from Tiers 1-4) so the panels have real data to render.
- Tier 6 (task 38) depends only on Tier 0 (the existing `Timeline`/`ScenarioService` code it generalizes); it does not require any Tier 1-4 biome data.
- Tier 7 (tasks 39-42) depends on everything before it, since it audits navigation and runs the full build/test suite across the whole feature.
