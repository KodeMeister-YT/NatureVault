# Requirements Document

## Visual QA & Polish Pass

## Introduction

`biome-architecture-expansion` delivered a data-driven `BiomeDefinition` architecture and shipped all 8 biomes (Coastal Wetland, Temperate Forest, Tropical Forest, Desert, Alpine, Freshwater Lake, Grassland/Savanna, Coral Reef) on top of it, plus a fixed `LocationService`, a generalized `Timeline`, and a `BiodiversityProfileService`. This feature is the polish/integration pass that follows: it closes concrete visual-identity gaps between biomes, deepens biodiversity content and interactivity, extends the timeline and future-scenario system, overhauls the ecosystem browsing/search experience, replaces the location-fallback dataset with a genuinely multi-region one, adds ambient audio, and performs a systematic QA sweep. It does **not** introduce a new architecture — every requirement below builds on the existing `BiomeDefinition`, `SceneComposition`, `terrainStrategies`, water-variant, and `AtmosphereRenderer` systems documented in `.kiro/specs/biome-architecture-expansion/design.md`.

An audit of the current codebase (performed as part of this spec) found:
- `biome.style` (`BiomeStyleEntry[]`) is defined in the type system but is **never read** by `EnvironmentalObjectRenderer` — every `Tree`, `Rock`, `MeadowPatch`, `ReedCluster`, and `Pollinator` renders with the same hardcoded colors regardless of biome, undermining biome-specific visual identity.
- Several biomes are missing explicitly-required elements (e.g. Desert has no distant mountains or dry shrubs; Alpine has no conifers or snow patches; Grassland has no tall grasses or insects; Freshwater Lake has no aquatic vegetation, frogs, or visible fish; Coral Reef has no sea turtles, anemones, or marine vegetation; Coastal Wetland has no crabs or a discrete shallow marsh pool distinct from its tidal channel).
- Tropical Forest currently authors fewer environmental objects (11) than Temperate Forest (20), contradicting the requirement that tropical forest read as visually denser than temperate forest.
- Scenery/vegetation primitives that are not birds/animals/frogs (e.g. `Cactus`, `Coral`, `TropicalFlower`, `TermiteMound`) do not vary with `vegetationDensity`/`biodiversityLevel` at all, so switching scenarios does not visibly change them.
- `ScenarioService.resolveMetricsForYear` only applies scenario modifiers to the single maximum year in a biome's `years` array; there is no mechanism for multiple future years (e.g. 2050 and 2075) to diverge by different amounts.
- There is no ecosystem-overview panel on Vault entry, no ambient audio system, and no search/filter UI on the ecosystem browsing page.
- `LocationService`'s demo-region gate (`isWithinDemoRegion`) only recognizes a single Portland, Oregon bounding box; there is no multi-region fallback dataset.

## Glossary

- **Biome / BiomeDefinition**: The existing data-driven ecosystem definition (`terrain`, `water`, `atmosphere`, `cameraDefaults`, `style`, `objects`, `years`, `storyChapters`) documented in the biome-architecture-expansion design. This feature extends its data and the components that consume it; it does not change its shape except via small additive optional fields.
- **BiomeStyle / BiomeStyleEntry**: The existing (currently unused) per-`ObjectKind` color/variant override mechanism on `BiomeDefinition.style`. This feature wires it into the primitives that render scenery/vegetation/wildlife.
- **Vegetation-linked object**: An `EnvironmentalObject` whose visibility/instance count is intended to scale with `vegetationDensity` or `biodiversityLevel` (e.g. cacti, coral clusters, tropical flowers, termite mounds, crabs, turtles, anemones) so that scenario changes are visibly reflected, not just numerically reflected.
- **Projected year**: A year in a biome's `years` array that is a future scenario projection (year >= 2050 in this feature), as opposed to a historical/present-day year. A biome may have more than one projected year (e.g. 2050 and 2075), and later projected years diverge further from the present than earlier ones under the same scenario.
- **EcosystemOverviewPanel**: A new, dismissible panel shown when a Vault is entered, summarizing the biome's name, computed health percentage, biodiversity species count, key features, and main environmental pressures.
- **AudioService**: A new subsystem that synthesizes and mixes per-biome ambient soundscapes (wind, water, birds, insects, underwater tones, rain) using the Web Audio API, with a persisted mute toggle, without requiring any bundled audio asset files.
- **DiscoverPage**: `src/pages/Discover/DiscoverPage.tsx`, the ecosystem browsing/search entry point referred to as "the Explore page" in this feature's scope (distinct from the nav's `/archive` "Explore" link, which is a saved-snapshots/journal view and is only in scope for the general QA pass, Requirement 10).
- **Region dataset**: A named geographic area (e.g. Vadodara, Mumbai, New York, Portland) with a bounding box and a curated list of demo nature locations, used by `LocationService` as a fallback when reverse geocoding does not resolve a location, or as an offline/manual-selection dataset.

## Requirements

### Requirement 1: Biome visual differentiation

**User Story:** As a user exploring different biomes, I want every biome to be immediately recognizable from its required visual elements alone, so that I never have to read a label to know which ecosystem I am in.

#### Acceptance Criteria

1. WHEN `EnvironmentalObjectRenderer` renders an object of kind `tree`, `canopyTree`, `rock`, `reed`, `plant`, or `pollinator` THEN the system SHALL resolve that object's color from `biome.style` (matching on `kind` and `variant` where present) before falling back to the primitive's existing default color.
2. WHEN a biome's data file declares `style.entries` for `tree`, `rock`, `reed`, `plant`, or `pollinator` THEN the system SHALL render that biome's instances of the matching kind/variant with the declared `colorPrimary`/`colorAccent` instead of the shared default.
3. WHEN the Coastal Wetland biome is rendered THEN the system SHALL include tidal channel, shallow marsh pool (visually distinct from the tidal channel), reeds, coastal/mangrove-styled vegetation, at least one crab, at least one bird, at least one visible fish, and at least one amphibian.
4. WHEN the Temperate Forest biome is rendered THEN the system SHALL include tall conifer trees, ferns, moss, fallen logs, mushrooms, a narrow creek, and woodland wildlife, AND SHALL NOT include any large rectangular lake object.
5. WHEN the Tropical Forest biome is rendered THEN the system SHALL include dense layered canopy, vines, broad-leaf canopy trees, tropical flowers, at least one flying-insect-styled object, birds, a waterfall, and dense forest-floor coverage, AND the total count of vegetation/wildlife objects present in the Tropical Forest's current year SHALL be greater than or equal to the count present in the Temperate Forest's current year.
6. WHEN the Desert biome is rendered THEN the system SHALL include dunes, sand-toned terrain, rock formations, cacti, dry-shrub-styled vegetation, at least one distant-mountain backdrop object, a dry riverbed, and desert wildlife, AND SHALL NOT include any water-kind object or green-toned terrain palette.
7. WHEN the Alpine biome is rendered THEN the system SHALL include elevated cliff terrain, at least one conifer tree, an alpine meadow, rock formations, at least one snow-patch-styled object, a mountain stream, and alpine wildlife.
8. WHEN the Freshwater Lake biome is rendered THEN the system SHALL include a large irregular lake with a `featureRadius` greater than any pond/marsh `featureRadius` used elsewhere, a shoreline, aquatic-vegetation-styled objects, surrounding forest/meadow, rocks, at least one visible fish, at least one duck-styled bird, at least one frog, and at least one dragonfly-styled object.
9. WHEN the Grassland/Savanna biome is rendered THEN the system SHALL include large open flat-grassland terrain, tall-grass-styled vegetation clusters, scattered trees, shrub-styled vegetation, a watering hole, termite mounds, grazing wildlife, birds, and at least one flying-insect-styled object.
10. WHEN the Coral Reef biome is rendered THEN the system SHALL include seafloor terrain, coral formations, at least one sea turtle, at least one anemone, marine-vegetation-styled objects, rocks, multiple fish schools, underwater particles, and light-shaft rays, AND SHALL NOT include any terrestrial terrain, non-underwater water feature, or tree object.
11. WHEN a new `ObjectKind` (`crab`, `turtle`, `anemone`) is introduced to support Requirements 1.3 and 1.10 THEN the system SHALL add a corresponding rendering primitive, an `EnvironmentalObjectRenderer` switch case, and a `kindLabel` entry in `ObjectInspector`, following the existing single-purpose-primitive-file pattern.

### Requirement 2: 3D visual quality and scene composition

**User Story:** As a user, I want each biome's 3D scene to look intentional and polished rather than sparse or visually flat, so that the experience feels like a crafted place rather than a placeholder.

#### Acceptance Criteria

1. WHEN a vegetation-linked object (`cactus`, `coral`, `tropicalFlower`, `termiteMound`, `anemone`) is rendered THEN the system SHALL apply the same seeded density-dropout mechanism currently applied only to `WILDLIFE_KINDS`, scaled by `vegetationDensity`, so that these objects visibly thin out as vegetation density decreases and return as it recovers.
2. WHEN a wildlife-linked object of kind `crab` or `turtle` is rendered THEN the system SHALL be included in the existing `WILDLIFE_KINDS` seeded dropout mechanism scaled by `biodiversityLevel`.
3. WHEN any biome's `Terrain`, water variant, or atmosphere renders THEN the system SHALL use only the existing `terrainStrategies`, water-variant, and `AtmosphereRenderer` registries (no new terrain/water/atmosphere strategy kinds are introduced by this feature).
4. WHERE a biome reuses a shared primitive (`Tree`, `Rock`, `MeadowPatch`, `ReedCluster`, `Pollinator`) for a biome-specific purpose (e.g. `MeadowPatch` as savanna tall grass, `ReedCluster` as reef kelp, `Pollinator` as a dragonfly) THEN the system SHALL apply a distinguishing `biome.style` color override rather than rendering it with the same default appearance used elsewhere.

### Requirement 3: Biodiversity density, ecological layering, and interactivity

**User Story:** As a user, I want each biome to feel densely and intentionally populated across landscape, vegetation, small life, larger wildlife, and environmental traces, so that exploring it feels like discovering a real ecosystem rather than a sparse demo scene.

#### Acceptance Criteria

1. WHEN any biome's current-year object list is evaluated THEN the system SHALL contain at least 8 interactive (non-null `biodiversityCategory` or otherwise clickable) objects.
2. WHEN a biome's objects are reviewed THEN the system SHALL include at least one object representing each of the following layers where ecologically applicable to that biome: landscape/terrain feature, vegetation, small life (insect/amphibian/small-creature-styled), larger wildlife, and an environmental trace (fallen log, dry riverbed, mushroom cluster, termite mound, or tracks-equivalent).
3. WHEN `ObjectInspector` renders an object with a defined `trophicRole`, `habitat`, `diet`, `environmentalPressures`, and `relatedSpecies` THEN the system SHALL continue to display each corresponding section (this feature backfills these fields on the newly added objects from Requirement 1; the display logic itself already exists and is unchanged).
4. WHEN a newly introduced object (`crab`, `turtle`, `anemone`, or any object added to satisfy Requirement 1) has a non-null `biodiversityCategory` THEN the system SHALL populate `trophicRole`, `habitat`, and at least one of `diet`/`environmentalPressures`, consistent with the existing biodiversity-hierarchy backfill standard.
5. WHEN a Vault finishes loading THEN the system SHALL display a dismissible `EcosystemOverviewPanel` showing the biome's name, a computed health percentage, a computed biodiversity species count (via `BiodiversityProfileService`), a list of the biome's key features, and a list of its main environmental pressures.
6. WHEN the `EcosystemOverviewPanel`'s health percentage is computed THEN the system SHALL derive it purely from the current year's resolved `VaultStateMetrics` (no hand-authored per-biome health value), so the displayed percentage always matches the currently selected year and scenario.
7. WHEN a user dismisses the `EcosystemOverviewPanel` THEN the system SHALL hide it for the remainder of that Vault session and SHALL NOT show it again until the Vault is re-entered.
8. WHEN the `EcosystemOverviewPanel`'s "main pressures" list is populated THEN the system SHALL derive it from the distinct `environmentalPressures` values already present on that biome's current-year objects, deduplicated, rather than hand-authored duplicate text.

### Requirement 4: Multi-year timeline expansion

**User Story:** As a user viewing any biome, I want a richer, more granular timeline that shows distinct stages of change, so that the ecosystem's history feels like a continuous story rather than 3-4 disconnected snapshots.

#### Acceptance Criteria

1. WHEN a biome's `years` array is reviewed THEN the system SHALL contain at least 6 year entries per biome, each with an authored (non-templated) `summary` and `keyChanges` distinct from every other year in that biome.
2. WHEN a biome's `years` array is reviewed THEN the system SHALL include at least one projected year with `year >= 2050` beyond the biome's present-day year, in addition to at least one earlier historical year showing denser/more-pristine conditions than the present-day year.
3. WHEN a biome includes two or more projected years (e.g. 2050 and 2075) THEN the system SHALL author distinguishable `summary`/`keyChanges` content for each projected year rather than duplicating the same text with only numbers changed.
4. WHEN `Timeline` renders a biome with more than 5 years THEN the system SHALL continue to support drag/snap/tap selection of every year (existing behavior in `Timeline.tsx` is unchanged and re-verified against the expanded arrays).

### Requirement 5: Future scenario divergence across multiple projected years

**User Story:** As a user comparing "Continue as Is" and "Protect & Restore" at any future year, I want to see a clear, growing divergence between the two paths the further into the future I look, so that the choice feels consequential rather than a flat one-time adjustment.

#### Acceptance Criteria

1. WHEN `resolveMetricsForYear` is called for a projected year THEN the system SHALL scale the applied scenario modifier by the elapsed time between the biome's present-day year and the requested projected year, relative to the elapsed time to the biome's first projected year, so that a later projected year (e.g. 2075) diverges further from the present than an earlier one (e.g. 2050) under the same scenario.
2. WHEN a biome has exactly one projected year THEN the system SHALL apply the scenario modifier at the same scale as the existing (pre-this-feature) behavior, so single-projected-year biomes are unaffected during any transitional period.
3. WHEN `applyScenario` computes a scaled modifier for any projected year THEN the system SHALL clamp all four resulting metrics to `[0, 1]`, consistent with existing behavior.
4. WHEN a projected year is selected AND a scenario is active THEN the system SHALL display a scenario-impact summary showing a labeled percentage difference (e.g. "+18% represented biodiversity under Protect & Restore") between the two scenarios' resolved `biodiversityLevel` for that year, alongside a visible "Illustrative simulation — not a scientific forecast" label.
5. WHEN the scenario-impact summary is computed THEN the system SHALL derive its percentage difference purely from `resolveMetricsForYear` outputs for both scenarios at the same year (no hand-authored delta values).

### Requirement 6: Ecosystem browsing (Explore) overhaul

**User Story:** As a user browsing ecosystems, I want to search and filter by ecosystem type and see cards that each look and read differently, so that I can find what I'm interested in and get a sense of variety before entering a Vault.

#### Acceptance Criteria

1. WHEN `DiscoverPage` renders THEN the system SHALL display a text search input that filters the visible ecosystem list by matching against ecosystem `name`, `location`, and `description`.
2. WHEN `DiscoverPage` renders THEN the system SHALL display filter controls for exactly these categories: Forest, Wetland, Desert, Mountain, Freshwater, Grassland, Marine, and Tropical, each mapped to one or more `EcosystemType` values, and SHALL show only ecosystems matching the active filter(s) when one or more is selected.
3. WHEN no ecosystems match the active search text and filter combination THEN the system SHALL display an empty-state message rather than an empty grid.
4. WHEN `EcosystemCard` renders an ecosystem THEN the system SHALL display a visual treatment unique to that ecosystem's type (distinct from a shared gradient alone), the ecosystem name, type label, a computed biodiversity species count (via `BiodiversityProfileService`), a computed health indicator, a timeline-year-count indicator, and a visible "Enter Vault" affordance.
5. WHEN a user activates a filter or search THEN the system SHALL update the visible ecosystem grid without a full page navigation.

### Requirement 7: Location-aware "Take It Outside" with multi-region fallback

**User Story:** As a user anywhere in the world, I want "Take It Outside" to suggest nature locations near my actual detected region — or clearly labeled demo locations from a relevant region — never a hardcoded single city presented as being near me.

#### Acceptance Criteria

1. WHEN the region dataset is defined THEN the system SHALL include at least the following named regions, each with its own bounding box and curated demo location list: Vadodara, Ahmedabad, Mumbai, Delhi, Bengaluru, Hyderabad, New York, and Portland.
2. WHEN `LocationService.resolveLocation()` returns a `ResolvedLocation` THEN the system SHALL determine the nearest matching region dataset (if any) by checking the resolved coordinates against every region's bounding box, rather than checking against a single hardcoded Portland bounding box.
3. IF the resolved coordinates fall within more than one region's bounding box, or within none THEN the system SHALL select the nearest region by centroid distance for none-match, or the first contained match for multiple-match, and SHALL clearly label the resulting suggestions as demo/example data tied to that region.
4. WHEN `TakeItOutsidePanel` displays demo/fallback locations THEN the system SHALL label each such location card with a visible "Demo location" tag, distinct from any location derived from the user's live resolved coordinates.
5. WHEN `TakeItOutsidePanel` renders THEN the system SHALL use the copy "TAKE IT OUTSIDE" as the panel title, "You explored this ecosystem digitally. Now find something similar in the real world." as the introductory copy, and "Nearby Nature — Based on your location" as the heading for the resolved-location results section.
6. WHEN a location card (resolved or demo) is rendered THEN the system SHALL display the location's name, ecosystem type, distance (or "Distance unknown" for demo locations without a real user location), a short description, an "Explore" action, and a "Directions" action.
7. IF geolocation permission is denied, unavailable, or times out THEN the system SHALL display the message "We couldn't access your location." together with a "Choose Location" manual-selection option, consistent with the existing `LocationSelector` fallback flow.
8. WHEN a region dataset's demo locations are shown without a resolved location (manual selection path) THEN the system SHALL let the user pick from at least the 8 regions in Requirement 7.1 rather than only offering a single Pacific-Northwest option.

### Requirement 8: Camera, atmosphere, and ambient audio

**User Story:** As a user entering any biome, I want a camera framing, lighting/fog mood, and optional ambient sound specific to that biome, so that each Vault feels like a distinct place from the first second.

#### Acceptance Criteria

1. WHEN a biome's `cameraDefaults` are reviewed THEN the system SHALL confirm each of the 8 biomes has a distinct `position`/`target` pair appropriate to its stated vantage (forest: low eye-level facing into the trees; wetland: standing near water facing reeds; desert: elevated on a dune facing a valley; alpine: mountain-trail overlook; tropical: inside dense vegetation facing the waterfall; coral reef: underwater near a coral formation; lake: shoreline facing across open water; savanna: open-plain vantage), and SHALL correct any biome whose camera does not match its stated vantage.
2. WHEN a biome's `atmosphere` is reviewed THEN the system SHALL confirm each of the 8 biomes has a distinct fog/lighting profile consistent with its described mood, and SHALL correct any biome whose profile is not visually distinguishable from another biome's.
3. WHEN an `AudioService` ambient soundscape is defined for a biome THEN the system SHALL synthesize it from Web Audio API primitives (oscillators/noise buffers/filters) rather than requiring bundled audio asset files, and SHALL mix the layers specified for that biome (forest: birds + wind; wetland: water + birds + insects; desert: wind; alpine: wind + distant water; tropical: rainforest ambience; grassland: wind + insects; coral reef: underwater ambience; lake: water + birds).
4. WHEN a user activates the mute control THEN the system SHALL silence all ambient audio immediately and SHALL persist the muted state across navigation within the same session.
5. IF ambient audio fails to initialize (e.g. browser autoplay restrictions, unsupported Web Audio API) THEN the system SHALL continue to render and operate the Vault normally with no functional degradation.
6. WHEN a Vault is entered THEN the system SHALL NOT autoplay ambient audio before a user gesture, consistent with standard browser autoplay policies; playback SHALL begin on the first user interaction with the Vault (e.g. clicking the unmute/mute control or any scene interaction) rather than automatically.

### Requirement 9: Performance

**User Story:** As a user on a typical laptop, I want the Vault experience to run smoothly across all 8 biomes, so that added visual density does not degrade the experience.

#### Acceptance Criteria

1. WHEN new instanced vegetation/wildlife primitives are added to satisfy Requirements 1-3 THEN the system SHALL implement them using `instancedMesh` with a `useFrame` matrix-update pattern, consistent with the existing `MeadowPatch`/`ReedCluster`/`Coral`/`FishSchool` pattern, rather than one mesh per instance.
2. WHEN the production build is generated THEN the system SHALL split at least the `VaultPage` route (and its 3D dependencies) into a separate lazily-loaded chunk from the initial bundle, so the landing/discover experience does not pay the full Three.js/R3F bundle cost upfront.
3. WHEN `AudioService` is active THEN the system SHALL reuse a single shared `AudioContext` per session rather than creating a new context per biome visit.
4. WHEN authored object counts per biome are reviewed after this feature's content additions THEN the system SHALL keep each biome's total authored `EnvironmentalObject` count within the existing 20-60 range used by prior biomes (dense elements achieved via instancing/count parameters, not dozens of additional individually-authored objects).

### Requirement 10: General QA and dead-end audit

**User Story:** As a user navigating any part of NatureVault, I want every interactive control across every page and mode to work correctly with no visual glitches, console errors, or dead ends, so that the app feels finished.

#### Acceptance Criteria

1. WHEN this feature's changes are complete THEN the system SHALL have no button, link, or control across Landing, Discover, Navigation, Profile, Archive, Ecosystem selection, all 8 Vaults, Timeline, Biodiversity panel, Object Inspector, Story Mode, Compare, Take It Outside, Demo Mode, and back-navigation that fails to navigate, open a panel, or change visible state when activated.
2. WHEN any of the 8 biomes is entered, its timeline dragged across every year, its Biodiversity view toggled with each category filter, Compare opened in both split and swipe modes with the year-picker exercised, and Take It Outside triggered with geolocation both allowed and denied THEN the system SHALL exhibit no console errors and no visually broken/missing assets.
3. WHEN the browser is refreshed on any route (including `/vault/:ecosystemId` for each of the 8 ecosystem ids) THEN the system SHALL restore to a working state (no blank screen, no unhandled error) consistent with the app's existing persistence/session behavior.
4. WHEN the full automated test suite and production build are run after this feature's changes THEN the system SHALL pass with zero failing tests and zero build errors.
