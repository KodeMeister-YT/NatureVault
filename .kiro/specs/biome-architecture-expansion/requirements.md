# Requirements Document

## Biome Architecture Expansion

## Introduction

NatureVault's four existing ecosystems (Evergreen Valley, Coastal Wetland, Alpine Ecosystem, Urban Green Space) all render through one generic terrain/water pipeline, so switching ecosystems changes labels and object placement but not the fundamental shape of the world. This feature introduces a data-driven `Biome` architecture (terrain strategies, water variants, atmosphere profiles, biodiversity hierarchy) so each ecosystem can declare a genuinely distinct world as data, expands the ecosystem roster from 4 to 8 biomes, enriches the environmental object model and inspector panel, fixes the "Take It Outside" location bug (hardcoded Portland fallback shown as "near you" regardless of actual location), generalizes the Timeline to a variable number of year snapshots, and closes remaining navigation dead-ends. These requirements were derived from `.kiro/specs/biome-architecture-expansion/design.md`, which should be treated as the technical reference for component names, prop shapes, and file locations while implementing each requirement below.

## Glossary

- **Biome / BiomeDefinition**: The data-driven definition of a single ecosystem (e.g. Desert, Coral Reef), combining `terrain`, `water`, `atmosphere`, `cameraDefaults`, `style`, `objects`, and metadata (`ecosystemId`, `name`, `location`, `years`, `storyChapters`). Renamed from, and kept backward-compatible with, the existing `VaultDefinition` type.
- **TerrainKind**: A union of ground-shape strategies a `BiomeDefinition` can select (`flat-grassland`, `rolling-hills`, `duned-desert`, `elevated-cliffs`, `seafloor`), each with its own height/color computation in the `terrainStrategies` registry.
- **WaterKind**: A union of water-feature types a `BiomeDefinition` can select (`river`, `pond`, `creek`, `lake`, `waterfall`, `none`, `underwater-ambient`), determining which water variant component (if any) renders for that biome.
- **AtmosphereProfile**: The data describing a biome's sky, sun, ambient/hemisphere lighting, and fog (`skyTreatment`, `sun`, `ambient`, `hemisphere`, `fog`), consumed by `AtmosphereRenderer` and `SceneComposition` to drive scene lighting and mood.
- **TrophicRole**: A classification of an `EnvironmentalObject`'s position in the food web (e.g. Producer, Primary Consumer, Decomposer), displayed as a badge in `ObjectInspector` and aggregated by `BiodiversityProfileService`.
- **BiodiversityProfile**: The computed summary of species/object counts for a biome (`totalSpecies`, `byCategory`, `byTrophicRole`), derived from `biome.objects` rather than hand-authored data.
- **ScenarioService**: The service responsible for resolving a biome's metrics for a given year, including applying "what-if" scenario modifiers to the biome's maximum year.
- **resolveMetricsForYear**: The `ScenarioService` function that, given a biome and a requested year, returns that year's resolved metrics, applying scenario modifiers only when the requested year equals the biome's maximum year.
- **isWithinDemoRegion**: The location-service helper that determines whether a user's resolved coordinates fall within the Portland-area bounding box used by the curated `demoLocations` dataset, used to gate when demo data may be shown.

## Requirements

### Requirement 1: Biome data model

**User Story:** As a developer extending NatureVault, I want each ecosystem's terrain, water, atmosphere, and visual style declared as data on a `BiomeDefinition`, so that adding a new ecosystem means writing a new data file rather than modifying rendering components.

#### Acceptance Criteria

1. WHEN a new type module `src/types/biome.ts` is added THEN the system SHALL define `TerrainKind`, `TerrainConfig`, `TerrainPalette`, `WaterKind`, `WaterConfig`, `SkyTreatment`, `AtmosphereProfile`, `CameraDefaults`, `BiomeStyleEntry`, `BiomeStyle`, `TrophicRole`, and `BiodiversityProfile` types.
2. WHEN `src/types/vault.ts` is updated THEN the system SHALL extend the existing vault/ecosystem type (renamed `BiomeDefinition`) with required `terrain`, `water`, `atmosphere`, `cameraDefaults`, and `style` fields, IN ADDITION TO the existing `ecosystemId`, `name`, `location`, `years`, `objects`, and `storyChapters` fields.
3. WHEN the rename from `VaultDefinition` to `BiomeDefinition` is made THEN the system SHALL keep a `VaultDefinition` type alias pointing to `BiomeDefinition` SO THAT existing imports in `VaultService`, `ScenarioService`, `CompareView`, and other consumers continue to compile without modification.
4. IF a biome data file omits any of `terrain`, `water`, `atmosphere`, `cameraDefaults`, or `style` THEN the system SHALL fail to compile (TypeScript required-field error), rather than silently rendering with fallback defaults.
5. WHEN a new `TerrainKind`, `WaterKind`, or `SkyTreatment` value is added to its union type THEN the system SHALL require a corresponding entry in that value's dispatch registry (terrain strategies / water variant renderer / atmosphere renderer) to compile, so an unregistered strategy cannot ship.
6. WHEN `EnvironmentalObject` is extended THEN the system SHALL add the following fields as optional (non-breaking) additions: `variant`, `trophicRole`, `habitat`, `diet`, `environmentalPressures`, and `featureRadius`, IN ADDITION TO all existing fields (`id`, `kind`, `biodiversityCategory`, `name`, `position`, `presentInYears`, `description`, `ecologicalRole`, `historicalChange`, `relatedSpecies`, `connection`).
7. WHEN `ObjectKind` is extended THEN the system SHALL add `creek`, `lake`, `waterfall`, `fern`, `moss`, `log`, `cactus`, `dryRiverbed`, `vine`, `tropicalFlower`, `canopyTree`, `coral`, `fishSchool`, and `termiteMound` as new kind values, IN ADDITION TO all existing kind values.

### Requirement 2: Terrain strategy system

**User Story:** As a user exploring different biomes, I want each biome's ground to look and feel structurally different (flat, duned, cliffed, underwater), so that switching ecosystems feels like entering a different place rather than a recolored copy of the same hill.

#### Acceptance Criteria

1. WHEN the terrain system is refactored THEN the system SHALL provide a `terrainStrategies` registry with one strategy implementation per `TerrainKind` value: `flat-grassland`, `rolling-hills`, `duned-desert`, `elevated-cliffs`, and `seafloor`.
2. WHEN `Terrain.tsx` builds its procedural geometry THEN the system SHALL delegate per-vertex height computation and per-vertex color computation to `terrainStrategies[config.kind]` rather than inlining a single hardcoded height/color function.
3. WHEN the `rolling-hills` strategy is created THEN the system SHALL preserve the existing noise/coloring behavior currently in `Terrain.tsx` exactly, so the four existing ecosystems that rely on it show no unintended visual regression.
4. WHEN the `duned-desert` strategy computes height THEN the system SHALL produce visibly larger-amplitude, lower-frequency undulation than `rolling-hills`, so dunes are visually distinguishable from rolling hills.
5. WHEN the `elevated-cliffs` strategy computes height THEN the system SHALL produce a base elevation offset with sharper, higher-amplitude ridges and a distinct rock-face color band above a height threshold, so the Alpine biome shows real elevation rather than flat terrain with a background mountain prop.
6. WHEN the `seafloor` strategy computes height THEN the system SHALL always return a height at or below the water surface plane (i.e., `<= -params.seafloorDepth`), so the terrain never protrudes above the underwater scene.
7. GIVEN fixed inputs `(x, z, index, config)`, WHEN `computeHeight` or `computeColor` is called multiple times THEN the system SHALL return identical output every time (pure, deterministic functions), so cached/memoized geometry remains stable across re-renders.
8. WHEN `Terrain.tsx`'s shoreline-carving logic runs THEN the system SHALL derive each water body's influence radius from that object's `featureRadius` field rather than the hardcoded `kind === 'river' ? 9 : 4.5` conditional currently duplicated in `VaultScene.tsx` and `CompareView.tsx`.

### Requirement 3: Water variant system

**User Story:** As a user exploring different biomes, I want water features to look and behave appropriately for their type (creek, marsh, lake, waterfall, or no water at all), so that a desert's absence of water and a wetland's marsh feel like deliberate, distinct design choices.

#### Acceptance Criteria

1. WHEN the water rendering system is refactored THEN the system SHALL extract the existing shader vertex/fragment source and uniform setup from `Water.tsx` into a shared hook (`useWaterShaderMaterial`) used by every water variant component.
2. WHEN the water variant components are created THEN the system SHALL provide `PondMarsh` (existing irregular-blob behavior, handling `pond`/`river` kinds), `CreekStream` (narrow elongated shape with directional flow shimmer, handling `creek`), `LakeShoreline` (larger radius, lower irregularity, handling `lake`), and `Waterfall` (near-vertical plane with fast one-directional flow plus an instanced foam burst, handling `waterfall`).
3. WHEN a `WaterFeatureRenderer` component is added THEN the system SHALL dispatch each visible water-kind `EnvironmentalObject` to its matching variant component based on `object.kind`.
4. IF a biome's `water.kind` is `'none'` THEN the system SHALL NOT render any water-kind (`river`, `pond`, `creek`, `lake`, `waterfall`) object for that biome (enforced by biome data authoring; no water primitive is instantiated for Desert).
5. IF a biome's `water.kind` is `'underwater-ambient'` THEN the system SHALL NOT use `WaterFeatureRenderer` for that biome's water; the submerged appearance SHALL instead be produced entirely by the atmosphere layer (Requirement 4).
6. WHEN `EnvironmentalObjectRenderer`'s existing `river`/`pond` switch cases are migrated THEN the system SHALL move that dispatch logic into `WaterFeatureRenderer` so `EnvironmentalObjectRenderer` no longer directly renders water primitives.

### Requirement 4: Atmosphere and lighting system

**User Story:** As a user exploring different biomes, I want each biome's sky, fog, and lighting to feel distinct (e.g. a desert's harsh bright sun vs. a reef's cool underwater tint), so that atmosphere reinforces the sense of visiting a genuinely different place.

#### Acceptance Criteria

1. WHEN `AtmosphereProfile` is defined THEN the system SHALL include `skyTreatment`, `sun` (color/intensity/position), `ambient` (color/intensity), `hemisphere` (skyColor/groundColor/intensity), and `fog` (color/near/far) fields.
2. WHEN an `AtmosphereRenderer` component is added THEN the system SHALL dispatch on `profile.skyTreatment`, rendering `SkyAndClouds` for `'sky-and-clouds'` and a new `UnderwaterAmbience` component for `'underwater-ambience'`.
3. WHEN `SkyAndClouds` is updated THEN the system SHALL source its sun color and fog turbidity/coloring from the active biome's `atmosphere` profile rather than hardcoded literals.
4. WHEN `UnderwaterAmbience` is created THEN the system SHALL render a submerged scene with no sky dome, using fog plus animated translucent light-shaft planes and slow-rising instanced bubble particles.
5. WHEN `SceneComposition` renders lighting and fog THEN the system SHALL source all `directionalLight`, `ambientLight`, `hemisphereLight`, and `fog` properties from `biome.atmosphere` rather than the literal values currently hardcoded separately in `VaultScene.tsx` and `CompareView.tsx`.
6. WHEN fog is applied to a scene THEN the system SHALL use a declarative `<fog attach="fog" .../>` element driven by `biome.atmosphere.fog` rather than an imperative `scene.fog = new THREE.Fog(...)` assignment in a `Canvas` `onCreated` callback, so both `VaultScene` and `CompareView` receive fog without duplicating setup code.

### Requirement 5: Shared scene composition (fixing CompareView duplication)

**User Story:** As a developer maintaining NatureVault, I want the interactive Vault scene and the Compare view's mini-scenes to share one rendering implementation, so that biome-driven terrain/water/atmosphere/object rendering logic exists in exactly one place.

#### Acceptance Criteria

1. WHEN a `SceneComposition` component is created THEN the system SHALL contain the full render tree (lighting, fog, atmosphere, terrain, water, and per-object rendering with selection/hover/dimming logic) currently duplicated between `VaultScene.tsx`'s `SceneContents` and `CompareView.tsx`'s `MiniScene`.
2. WHEN `VaultScene.tsx` is refactored THEN the system SHALL reduce it to a `Canvas` (using `biome.cameraDefaults`) plus `OrbitControls` wrapping a single `<SceneComposition interactive={true} .../>`.
3. WHEN `CompareView.tsx`'s `MiniScene` is refactored THEN the system SHALL reduce it to a `Canvas` plus `OrbitControls` wrapping a single `<SceneComposition interactive={false} .../>`, using the same component as `VaultScene`.
4. WHEN either consumer renders `SceneComposition` for a given biome and year THEN the system SHALL produce visually consistent terrain, water, atmosphere, and object rendering between the main Vault view and the Compare view for that same biome/year combination.

### Requirement 6: Eight-biome ecosystem roster

**User Story:** As a user browsing NatureVault, I want to explore eight visually and ecologically distinct biomes, so that the app represents a meaningfully broader range of Earth's ecosystems than the current four near-identical environments.

#### Acceptance Criteria

1. WHEN the ecosystem roster is finalized THEN the system SHALL provide exactly these eight biomes: Coastal Wetland, Temperate/Pacific Northwest Forest, Tropical Forest, Desert, Alpine/Mountain, Freshwater Lake, Grassland/Savanna, and Coral Reef/Marine.
2. WHEN the Coastal Wetland biome is upgraded THEN the system SHALL apply the full new biome architecture (terrain, water, atmosphere, style, expanded timeline, full biodiversity hierarchy) as the flagship reference implementation.
3. WHEN the Temperate Forest (Evergreen Valley) biome is upgraded THEN the system SHALL replace its existing pond/river water feature with a `creek` (`CreekStream` variant) and add `fern`, `moss`, and `log` objects.
4. WHEN the Alpine Ecosystem biome is upgraded THEN the system SHALL use the `elevated-cliffs` terrain strategy for its walkable ground, rather than relying solely on the existing flat terrain plus background `Mountain` prop for elevation cues.
5. WHEN the Urban Green Space biome is repurposed THEN the system SHALL replace it with a Grassland/Savanna biome (ecosystem id `grassland-savanna`, type `savanna`) using `flat-grassland` terrain, scattered trees, a small watering hole, `termiteMound` objects, and grazing animal objects, and SHALL update every file that references the old `urban-green-space` id/type (`data/ecosystems/index.ts`, `data/ecosystems/vaults.ts`, `types/ecosystem.ts`, `components/Dashboard/EcosystemCard.tsx`, `data/observations/demoLocations.ts`, `data/observations/conservationActions.ts`).
6. WHEN the Desert biome is created THEN the system SHALL use `duned-desert` terrain, `water.kind: 'none'`, and include `cactus` and `dryRiverbed` objects, with no water-kind object present anywhere in its `objects` array.
7. WHEN the Freshwater Lake biome is created THEN the system SHALL use a `lake-shoreline` water feature with a natural shoreline and a larger `featureRadius` than the existing wetland/pond features, visually distinct from the Coastal Wetland's marsh.
8. WHEN the Tropical Forest biome is created THEN the system SHALL include dense canopy (`canopyTree` variant), `vine`, a `waterfall` water feature, and `tropicalFlower` objects.
9. WHEN the Coral Reef biome is created THEN the system SHALL use `seafloor` terrain and `underwater-ambient` water/atmosphere, include `coral` and `fishSchool` objects, and SHALL NOT include any terrestrial object kinds (`tree`, `canopyTree`, `building`, `road`, `path`, `cactus`) anywhere in its `objects` array.
10. IF full flagship-level visual polish cannot be achieved for all eight biomes in this implementation pass THEN the system's design and delivery plan SHALL explicitly document which biomes receive flagship treatment (Coastal Wetland, Desert, Coral Reef, Temperate Forest) versus which are structurally complete on the new architecture but visually simpler (Alpine, Freshwater Lake, Tropical Forest, Grassland/Savanna).

### Requirement 7: Biodiversity hierarchy and enriched object detail

**User Story:** As a user inspecting an environmental object, I want to see its ecological role (producer, consumer, decomposer), habitat, diet, and environmental pressures, so that I understand not just what the object is but how it fits into its ecosystem's food web.

#### Acceptance Criteria

1. WHEN `ObjectInspector.tsx` renders an object THEN the system SHALL display a trophic-role badge (e.g. "Producer", "Primary Consumer") whenever `object.trophicRole` is present, and SHALL omit the badge when it is absent.
2. WHEN `ObjectInspector.tsx` renders an object THEN the system SHALL display "Habitat" and "Diet" sections whenever the corresponding `object.habitat`/`object.diet` fields are present, and SHALL omit each section when its field is absent.
3. WHEN `ObjectInspector.tsx` renders an object THEN the system SHALL display an "Environmental pressures" bullet list whenever `object.environmentalPressures` is a non-empty array, and SHALL omit the section otherwise.
4. WHEN `ObjectInspector.tsx`'s `kindLabel` map is updated THEN the system SHALL include a human-readable label for every new `ObjectKind` value introduced in Requirement 1.7.
5. WHEN a `BiodiversityProfileService.computeProfile(biome, year?)` function is added THEN the system SHALL compute `totalSpecies`, `byCategory` counts, and `byTrophicRole` counts by deriving them from `biome.objects` (filtered by `presentInYears` when `year` is provided) rather than from hand-authored summary data.
6. WHEN a biodiversity summary is displayed in `BiodiversityPanel` THEN the system SHALL show the computed species count broken down by category (e.g. "24 species represented — 10 Plants, 6 Birds...") alongside a fixed disclaimer stating the data is illustrative/educational simulation content, not a scientific inventory.
7. GIVEN a biome's object list for a given year, WHEN `computeProfile` is called twice with the same arguments THEN the system SHALL return the same `totalSpecies` value both times, and that value SHALL equal the count of objects present in that year with a non-null `biodiversityCategory` (i.e., the summary can never drift from the underlying object list).

### Requirement 8: Location service fix for "Take It Outside"

**User Story:** As a user anywhere in the world using "Take It Outside," I want to see nearby-nature suggestions relevant to my actual location (or be clearly told when the app can't determine my location), so that I am never shown an unrelated city's parks presented as being near me.

#### Acceptance Criteria

1. WHEN the user clicks "Find Nearby Nature" AND grants geolocation permission AND the reverse-geocoding request succeeds THEN the system SHALL display the resolved city/region/country and a maps-search deep link built from the user's actual coordinates.
2. WHEN the user clicks "Find Nearby Nature" AND grants geolocation permission AND the reverse-geocoding request fails (network error, non-2xx response, malformed response) THEN the system SHALL display a coordinates-based maps-search link without asserting any specific city/region name.
3. WHEN the user denies geolocation permission, OR geolocation is unavailable, OR the request times out THEN the system SHALL display a manual `LocationSelector` (region picker or free-text city search) instead of any location data.
4. IF the curated `demoLocations` dataset (Portland-area) is shown to the user THEN the system SHALL show it only when the user's resolved coordinates fall within the Portland-area bounding box used by `isWithinDemoRegion`, AND SHALL label it explicitly as example/demo data rather than as locations "near" the user.
5. THE system SHALL NOT request geolocation automatically on component mount or page load; geolocation SHALL only be requested in direct response to an explicit user action (e.g. clicking "Find Nearby Nature").
6. THE system SHALL NOT, under any combination of geolocation and geocoding outcomes, display a location as "near you" unless that location was derived from the user's own live, successfully-resolved coordinates.
7. WHEN the reverse-geocoding call is made THEN the system SHALL call it directly from the browser using a keyless endpoint (no API key required, no new server component), consistent with the app's no-backend architecture.

### Requirement 9: Timeline generalization for variable year counts

**User Story:** As a user viewing a biome with more than three year snapshots, I want the timeline to remain usable (drag/snap/tap all years), so that biomes with richer histories (e.g. 6-7 years) are just as easy to navigate as the original 3-year biomes.

#### Acceptance Criteria

1. WHEN `Timeline` receives a `years` array of any length greater than or equal to 2 THEN the system SHALL support dragging the range input and snapping to the nearest available year, consistent with its existing 3-year behavior.
2. WHEN a biome has more than 5 years THEN the system SHALL avoid rendering every year as a permanently-visible text label (to prevent tick-label crowding), while still keeping every year individually selectable/tappable.
3. WHEN `ScenarioService.resolveMetricsForYear` is invoked for a biome with any number of year snapshots THEN the system SHALL correctly resolve metrics for the requested year, applying scenario modifiers only when the requested year equals the maximum year in that biome's `years` array.
4. WHEN `CompareView` is opened for a biome with more than 2 years THEN the system SHALL provide a way for the user to choose which two years are compared (rather than always comparing `years[0]` and `years[1]`), and SHALL resolve each side's metrics via `resolveMetricsForYear` (so a scenario-adjusted future year can be selected for either side).

### Requirement 10: Navigation and dead-end audit

**User Story:** As a user browsing NatureVault, I want every interactive control to lead somewhere meaningful, so that I never hit a button that does nothing or a screen with no way forward.

#### Acceptance Criteria

1. WHEN a user completes ecosystem browsing, biome selection, Vault entry, biodiversity inspection, category filtering, or returning to the archive THEN the system SHALL ensure each of these flows has a working, reachable UI path for all eight biomes (including the renamed Grassland/Savanna).
2. WHEN a new biome is added to `data/ecosystems/index.ts` THEN the system SHALL ensure `EcosystemCard`'s `gradientByType` map includes a corresponding entry, so no new biome card falls back to an unrelated default gradient silently.
3. WHEN a user navigates to `/vault/:ecosystemId` for any of the eight valid ecosystem ids THEN the system SHALL render that biome's Vault rather than the "This vault doesn't exist yet" fallback.
4. WHEN this feature's changes are complete THEN the system SHALL have no button, link, or control in `DiscoverPage`, `ArchivePage`, `MyVaultPage`, `ImpactPage`, `ProfilePanel`, `VaultPage`, or `TakeItOutsidePanel` that fails to either navigate, open a panel, or change visible state when activated.
