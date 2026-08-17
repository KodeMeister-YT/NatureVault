# Requirements Document

## NatureVault Experience Expansion

## Introduction

`biome-architecture-expansion` and `visual-qa-polish-pass` delivered a data-driven `BiomeDefinition` architecture across 8 biomes, per-biome terrain/water/atmosphere/audio identity, a `BiodiversityProfileService`, a multi-region `LocationService`, and a search/filter `DiscoverPage`. This feature is the "killer experience" layer requested next: it adds Ecosystem Health, Ecosystem Web, a Life Around You biodiversity exploration mode, Capture Discovery, and a Nature Journal as net-new systems; extends `ObjectInspector` with a taxonomic category line and richer connected-species display; optionally adds a deterministic, local "Ask the Ecosystem" guide; and closes out the remaining work with a full QA/regression pass over everything the two prior specs already shipped. These requirements were derived from `.kiro/specs/naturevault-experience-expansion/design.md`, which should be treated as the technical reference for component names, prop shapes, and file locations while implementing each requirement below.

An audit performed while writing this design found that several of the user's requested items are **already implemented** by the two prior specs and require verification/regression coverage only, not new implementation: per-biome interactive object density (14–20 objects per biome in the current year, already exceeding the requested 10–15+), the multi-year timeline with two projected years and scenario divergence, the Portland-fallback location bug fix and biome-matched nearby-nature suggestions, and the Explore/Discover page's search, filters, and per-card indicators. These are captured below as explicit verification requirements (Requirements 8–11) rather than re-specified as new functional requirements, per the design's gap analysis.

## Glossary

- **BiomeDefinition**: The existing data-driven ecosystem definition (`terrain`, `water`, `atmosphere`, `cameraDefaults`, `style`, `objects`, `years`, `storyChapters`). Unchanged in shape except for the additive fields introduced below.
- **EnvironmentalObject**: The existing per-object data shape (`id`, `kind`, `biodiversityCategory`, `position`, `presentInYears`, `description`, `ecologicalRole`, `historicalChange`, `relatedSpecies`, `connection`, plus optional biodiversity-hierarchy fields). This feature adds `lifeForm` and extends `connection` with `edges`.
- **EcosystemHealthBreakdown**: The computed 5-indicator summary (Biodiversity, Habitat, Water, Vegetation, Human Pressure) plus an overall 0–100 score, derived purely from the current year/scenario's resolved `VaultStateMetrics`.
- **EcosystemWebGraph**: The resolved set of direct (1-hop) relationships for a selected object, split into `outgoing` (this object's own declared edges) and `incoming` (other objects that declare an edge targeting this object).
- **LifeForm**: A taxonomic classification (`plant`, `insect`, `bird`, `reptile`, `mammal`, `fungi`, `aquatic`) used both as the Life Around You filter key and as the ObjectInspector "Category" line.
- **Life Around You**: The biodiversity exploration mode that highlights objects matching a selected `LifeForm` and dims all others, independent of the existing Biodiversity View / `BiodiversityCategory` filter.
- **Capture Discovery**: The explicit user action of saving a specific object, at a specific year, with an optional personal note, into the Nature Journal — distinct from the existing passive "Viewed X" observation logged on every object click.
- **Nature Journal**: The chronological list of captured discoveries surfaced on `MyVaultPage`, sourced from `Observation` entries with `isCaptured === true`.
- **Ask the Ecosystem**: The optional (P2) deterministic, local, rule-based question-answering feature that grounds its answers in the currently loaded biome's own data (selected object, timeline state, connections, environmental pressures) without calling any external AI API.
- **System** (as used in acceptance criteria below): the NatureVault client application (a browser-only React/Three.js single-page app with no backend), acting through the specific service/component named in each requirement.

## Requirements

### Requirement 1: Ecosystem Health breakdown

**User Story:** As a user entering a Vault, I want to see a simple health score broken into meaningful indicators, so that I understand at a glance which parts of the ecosystem are under pressure.

#### Acceptance Criteria

1. WHEN a Vault finishes loading THE System SHALL display an overall Ecosystem Health score as "N / 100" derived from the currently resolved `VaultStateMetrics`.
2. WHEN the Ecosystem Health score is displayed THE System SHALL break it into five indicators — Biodiversity, Habitat, Water, Vegetation, and Human Pressure — each rendered as a proportional bar.
3. WHEN the user changes the selected timeline year THE System SHALL recompute and display an updated Ecosystem Health score and indicator set without requiring the user to reopen any panel.
4. WHEN the user switches between the "Continue as Is" and "Protect & Restore" scenarios at a projected year THE System SHALL display a different Ecosystem Health score for each scenario whenever their resolved metrics differ.
5. THE System SHALL derive every Ecosystem Health indicator value from the biome's existing `VaultStateMetrics` fields rather than from a hand-authored per-biome health value.
6. WHEN the Ecosystem Health score or any indicator is displayed THE System SHALL show the disclaimer "Educational simulation indicator — not a scientific assessment." alongside it.
7. THE System SHALL NOT introduce a second, independently-computed health score that can disagree with the existing `EcosystemOverviewPanel`'s health percentage for the same metrics.

### Requirement 2: Ecosystem Web — connection data model

**User Story:** As a developer extending NatureVault's ecological content, I want a lightweight, referential relationship model on top of the existing connection data, so that per-biome food-web relationships can be authored without inventing a new data system.

#### Acceptance Criteria

1. WHEN `EcosystemConnection` is extended THE System SHALL add an optional `edges` field containing zero or more entries, each referencing another `EnvironmentalObject.id` within the same biome and a `relationship` kind (e.g. preys-on, pollinates, decomposes, shelters-in), IN ADDITION TO the existing `chain: string[]` field, which SHALL remain unchanged.
2. IF an edge's referenced object id does not exist within the same biome THEN THE System SHALL exclude that edge from any resolved connection graph rather than raising an error or rendering a broken reference.
3. WHERE a biome's objects declare `connection.edges` THE System SHALL ensure the relationships vary by ecosystem (e.g. forest tree→insects→birds→predators→fungi; wetland plant→insect→fish→bird→predator; desert cactus→pollinator→seeds→small mammals→predator; reef coral→algae→reef fish→larger fish→predator) rather than reusing an identical generic chain across every biome.
4. WHEN an object A declares an edge targeting object B THEN THE System SHALL make that relationship discoverable from B's own resolved connection graph (as an incoming relationship) without requiring the relationship to be separately authored on B.

### Requirement 3: Ecosystem Web — interactive visualization

**User Story:** As a user exploring an ecosystem, I want to select an organism and see its direct ecological relationships highlighted in the 3D scene, so that I understand the ecosystem is a connected web rather than a set of unrelated objects.

#### Acceptance Criteria

1. WHEN a user selects an object that has one or more resolved connection-graph relationships AND enables the Ecosystem Web toggle THE System SHALL render a subtly animated line in the 3D scene from the selected object to each directly connected object's position, up to a maximum of 6 lines.
2. WHEN a user selects an object with no resolved connection-graph relationships THE System SHALL render no connection lines and SHALL NOT display an error.
3. WHEN the Ecosystem Web toggle is enabled and an object is selected THE System SHALL display a "Connected species" list in the object detail panel showing 2 to 4 connected species along with their relationship (e.g. "pollinates", "preys on").
4. WHEN a user clicks a connected-species entry in the object detail panel THE System SHALL select that connected object, updating the detail panel and the highlighted connections to reflect the newly selected object.
5. THE System SHALL limit the Ecosystem Web visualization to the directly (1-hop) connected objects of the currently selected object, so the visualization remains readable rather than a dense multi-hop network graph.

### Requirement 4: Life Around You biodiversity exploration mode

**User Story:** As a user exploring a Vault, I want to filter what I see by broad category of life (plants, insects, birds, reptiles, mammals, fungi, aquatic life), so that biodiversity within the 3D environment is easier to discover than by clicking objects at random.

#### Acceptance Criteria

1. WHEN any `EnvironmentalObject` is evaluated for its life-form classification THE System SHALL resolve a defined `LifeForm` value for it, whether or not that object has an explicitly authored `lifeForm` field, by falling back to a documented mapping from its existing `biodiversityCategory`.
2. WHEN the user activates the Life Around You mode THE System SHALL present selectable categories for Plants, Insects, Birds, Reptiles, Mammals, Fungi, and Aquatic Life.
3. WHEN the user selects a Life Around You category THE System SHALL visually highlight interactive 3D objects whose resolved life form matches the selected category and SHALL dim all other interactive objects.
4. WHEN the user selects a Life Around You category THE System SHALL leave purely decorative scenery objects (objects with no biodiversity category) unaffected by the dimming.
5. THE System SHALL implement Life Around You as an independent filter dimension FROM the existing Biodiversity View category filter, so that activating one does not disable or overwrite the other's stored selection.
6. WHEN the user deactivates the Life Around You mode or exits the Vault session THE System SHALL clear the active life-form selection.

### Requirement 5: Capture Discovery and Nature Journal

**User Story:** As a user who finds something interesting while exploring, I want to explicitly save it with an optional note, so that I build a personal record of discoveries I can revisit later.

#### Acceptance Criteria

1. WHEN a user opens an object's detail panel THE System SHALL display a "Save to Nature Journal" action distinct from the passive observation already logged when the object was selected.
2. WHEN a user activates "Save to Nature Journal" THE System SHALL allow the user to optionally enter a short personal note before confirming the save.
3. WHEN a user confirms a capture THE System SHALL store an entry containing the object's name, its ecosystem, the year being viewed, the user's optional note, and a snapshot of the object's ecological significance.
4. WHEN a user confirms a capture THE System SHALL display a confirmation message reading "Discovery added to your Nature Journal."
5. WHEN a user navigates to the Nature Journal THE System SHALL display captured discoveries in reverse-chronological order, each showing the organism/environment, ecosystem, year, note (if provided), and ecological significance.
6. IF no discoveries have been captured THEN THE System SHALL display an empty-state message directing the user to capture their first discovery, rather than an empty list.
7. THE System SHALL NOT alter or remove the existing passive observation logging behavior that records an entry on every object selection, regardless of whether that object is ever explicitly captured.

### Requirement 6: Rich object detail panels — category and connected species

**User Story:** As a user inspecting an organism or environmental feature, I want a clear taxonomic category and a prominent view of related species, so that the detail panel gives me a complete, consistent picture of the object's place in its ecosystem.

#### Acceptance Criteria

1. WHEN the object detail panel renders an object with a non-null biodiversity category THE System SHALL display a distinct "Category" line (e.g. "Mammal", "Insect", "Bird") derived from that object's resolved life form, IN ADDITION TO its existing rendering-kind label.
2. WHEN the object detail panel renders a purely decorative scenery object (null biodiversity category) THE System SHALL omit the "Category" line, consistent with existing conditional-section behavior for other optional fields.
3. THE System SHALL preserve every existing object detail panel section (description, ecological role, habitat, diet, historical change, environmental pressures, related species, trophic-role badge) exactly as currently implemented, adding new sections only where this feature specifies them.

### Requirement 7: Ask the Ecosystem (Optional / P2)

**User Story:** As a user curious about an ecosystem's relationships, I want to ask natural-language questions and get an answer grounded in what I'm currently looking at, so that I can explore cause-and-effect without needing to read every panel manually.

#### Acceptance Criteria

1. WHERE the Ask the Ecosystem feature is enabled THE System SHALL let the user submit a free-text question about the currently loaded biome.
2. WHEN the user submits a question THE System SHALL generate an answer using only local, deterministic logic over the current biome's data (selected object, timeline year, active scenario, connection graph, environmental pressures) without making any network request to an external AI service.
3. WHEN the user's question matches a recognized intent (e.g. "why are there fewer X", "what happens if Y disappears", "why does Z matter", "what depends on this", "how could this recover") THE System SHALL produce an answer that references the specific biome data relevant to that intent.
4. IF the user's question does not match any recognized intent THEN THE System SHALL still return a non-empty, data-grounded summary of the current biome/year/health rather than a generic "I don't understand" response.
5. THE System SHALL NOT require any API key, environment variable, or external network dependency for Ask the Ecosystem to function.
6. THE System SHALL display, alongside each answer, a brief indication of which data points the answer was grounded in.

### Requirement 8: Per-biome interactive object density (Verification)

**User Story:** As a user exploring any biome, I want each biome to contain enough distinct, meaningful things to discover, so that no ecosystem feels sparse compared to another.

#### Acceptance Criteria

1. THE System SHALL maintain at least 10 interactive (non-null biodiversity category) `EnvironmentalObject` entries present in each biome's current (latest-authored) year.
2. THE System SHALL maintain every biome's total authored `objects.length` within the existing `[20, 60]` budget.
3. WHERE a future change to this feature adds `lifeForm` or `connection.edges` fields to existing objects THE System SHALL apply those additions to existing object entries rather than introducing objects solely to reach a density target.

### Requirement 9: Multi-year timeline and future scenario divergence (Verification)

**User Story:** As a user viewing any biome's timeline, I want a rich multi-year history and a meaningfully diverging future scenario comparison, so that the ecosystem's change over time feels substantial.

#### Acceptance Criteria

1. THE System SHALL maintain at least 6 authored year entries per biome, including at least one historical year denser than the present-day year and at least two projected years (2050 and a later year) with distinct, non-templated summaries.
2. WHEN a projected year is selected under an active scenario THE System SHALL apply a scenario-modifier scale proportional to elapsed time from the biome's present-day year, so that a later projected year diverges at least as much as an earlier projected year under the same scenario.
3. WHEN a projected year is selected under an active scenario THE System SHALL display a derived percentage-difference summary between the two scenarios' resolved biodiversity levels, labeled as an illustrative simulation rather than a scientific forecast.
4. THE System SHALL continue to support drag, snap, and tap year selection across every biome's full year array, including biomes with 6 or more years.

### Requirement 10: Take It Outside location reliability (Verification)

**User Story:** As a user anywhere in the world, I want "Take It Outside" to never present an unrelated hardcoded city's locations as being near me.

#### Acceptance Criteria

1. THE System SHALL NOT display a location's city or region name unless it was derived from the user's own live, successfully-resolved geolocation coordinates.
2. IF geolocation permission is denied, unavailable, or times out THEN THE System SHALL display "We couldn't access your location." together with a manual region-selection option, rather than any default or fallback location presented as nearby.
3. WHEN a resolved location's coordinates match a curated demo region THE System SHALL label the corresponding suggestions with that region's own name and a visible "Demo location" tag, never as unlabeled "near you" content.
4. WHEN a user has explored a biome of a given ecosystem type THE System SHALL bias nearby-nature suggestions toward locations whose type keyword loosely matches that ecosystem type, falling back to the full regional list when no type-specific match exists.

### Requirement 11: Explore/Discover page search and filters (Verification)

**User Story:** As a user browsing ecosystems, I want to search and filter by ecosystem type and see visually distinct cards, so that I can find what interests me before entering a Vault.

#### Acceptance Criteria

1. THE System SHALL maintain a text search input on the Discover page that filters the visible ecosystem list by name, location, and description.
2. THE System SHALL maintain filter controls for Forest, Wetland, Desert, Mountain, Freshwater, Grassland, Marine, and Tropical, each mapped to one or more ecosystem types.
3. THE System SHALL maintain, on every ecosystem card, a visual treatment unique to that ecosystem's type, the ecosystem name, type label, a computed biodiversity species count, a computed health indicator, a timeline-year-count indicator, and a visible "Enter Vault" affordance.
4. IF no ecosystems match the active search and filter combination THEN THE System SHALL display an empty-state message rather than an empty grid.

### Requirement 12: Correctness and regression safety

**User Story:** As a developer maintaining NatureVault, I want this feature's additions to be provably correct and non-regressive, so that new interactive systems don't silently break existing, already-shipped functionality.

#### Acceptance Criteria

1. THE System SHALL ensure every `EcosystemHealthBreakdown` value is derived purely from `VaultStateMetrics` such that identical metrics always produce an identical breakdown.
2. THE System SHALL ensure `EcosystemWebService.resolveGraph` never returns a resolved edge whose target object does not exist within the same biome.
3. THE System SHALL ensure every `EnvironmentalObject` resolves to a defined life form via `getLifeForm`, whether or not `lifeForm` is explicitly authored on that object.
4. THE System SHALL ensure that explicitly capturing a discovery never removes, duplicates without intent, or corrupts the existing passive observation-count statistics displayed on `MyVaultPage` and `ImpactPage`.
5. WHEN the full automated test suite and production build are run after this feature's changes THE System SHALL pass with zero failing tests and zero build errors.
6. WHEN this feature's changes are complete THE System SHALL have no button, link, or control across Landing, Discover, Navigation, Profile, Archive, all 8 Vaults, Timeline, Biodiversity panel, Life Around You panel, Ecosystem Health panel, Object Inspector, Ecosystem Web, Story Mode, Compare, Capture Discovery, Nature Journal, Take It Outside, Ask the Ecosystem (if built), and Demo Mode that fails to navigate, open a panel, or change visible state when activated.
