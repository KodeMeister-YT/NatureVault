import type { BiomeDefinition } from '../../types/vault';

export const desertVault: BiomeDefinition = {
  ecosystemId: 'desert',
  name: 'Painted Basin Desert',
  location: 'Painted Basin, Southern Oregon High Desert',
  terrain: {
    kind: 'duned-desert',
    // Warm sand / dry clay palette, distinct from every green-toned biome.
    palette: { primary: '#c9a877', secondary: '#a9855a', developed: '#8a8070' },
    params: { duneAmplitude: 1.8 },
  },
  water: { kind: 'none' },
  atmosphere: {
    skyTreatment: 'sky-and-clouds',
    // Harsh bright white-warm sun, much higher intensity than any other biome
    // (evergreen/alpine use 2.4, coastalWetland uses 1.7) so the desert reads
    // as visibly harsher/brighter light.
    sun: { color: '#fff6d8', intensity: 3.2, position: [20, 18, 6] },
    ambient: { color: '#f2e2b8', intensity: 0.3 },
    hemisphere: { skyColor: '#f5e6bd', groundColor: '#8a6f4e', intensity: 0.45 },
    // Very light, far fog — a clear, dry desert sky, unlike the closer coastal
    // haze (10/38) or the forest defaults (18/55).
    fog: { color: '#f0e0b8', near: 30, far: 85 },
    // A handful of slow-drifting, near-transparent dust motes for a "hot, hazy,
    // expansive" read without adding actual fog density — see SkyAndClouds.tsx.
    dustHaze: true,
  },
  // Elevated dune-ridge vantage. With duneAmplitude 1.8 (down from the previous 2.4),
  // the terrain's empirical world-space height range across the whole 70x70 grid is
  // roughly [-1.06, 2.19] (computed via Terrain.tsx's actual PlaneGeometry + rotation,
  // not just the raw sine-sum formula, since the mesh is rotated -90deg about X before
  // rendering, which maps computeHeight's local `z` to `-worldZ`). The actual terrain
  // height at the camera's own world (x=0, z=10) is ~0.92, so camera Y (4.0) sits ~3.1
  // units above the ground directly beneath it and ~1.8 above the theoretical max height
  // anywhere on the terrain — comfortably clear of every dune crest even while orbiting
  // (well above the plain eye-level defaults used by flatter biomes, ~1.5-1.8, since this
  // is meant to read as standing atop a raised dune ridge). The target's Y (1.9) sits just
  // above the actual terrain height at its own world (x=0, z=-9) (~1.68), so the camera
  // looks down and out across the basin toward the distant mountain range — "facing a
  // valley" from a real vantage point — rather than aiming into buried geometry.
  cameraDefaults: { position: [0, 4.0, 10], target: [0, 1.9, -9], fov: 58, minDistance: 3, maxDistance: 40, maxPolarAngle: Math.PI / 2.1 },
  style: {
    entries: [
      { kind: 'cactus', colorPrimary: '#5f7a54' },
      // Dry, dusty tan-brown for the desert scrub shrub, distinct from the shared
      // default `plant` green (#8fae5c) and from the cactus override above, so the
      // shrub reads as dried-out desert vegetation rather than a generic green patch.
      { kind: 'plant', variant: 'dryShrub', colorPrimary: '#9c8552', colorAccent: '#7a6a42' },
      // Muted grey-green succulent tint, distinct from both the dry-shrub tan and the
      // shared default plant green, so the small flowering succulent reads as its own
      // distinct low vegetation rather than another dry shrub.
      { kind: 'plant', variant: 'succulent', colorPrimary: '#7a8a6a', colorAccent: '#8fae5c' },
      // Warm, sun-bleached reddish-tan tint for the desert's sandstone/boulder rocks,
      // distinct from the shared default grey rock (#7a7568) and from alpine's cool
      // near-white snow-patch override, so desert rock formations read as sun-baked
      // sandstone rather than generic grey boulders.
      { kind: 'rock', colorPrimary: '#a9754a', colorAccent: '#8a5f3a' },
      // Muted tan-brown scorpion tint, distinct from both the desert rock override
      // above and Crab's default reddish-orange, so the scorpion reads as a dusty,
      // ground-colored creature rather than a beach crab.
      { kind: 'scorpion', colorPrimary: '#5a4430', colorAccent: '#3f3020' },
    ],
  },
  years: [
    {
      year: 1985,
      label: '1985',
      metrics: { vegetationDensity: 0.28, waterLevel: 0, biodiversityLevel: 0.48, developmentLevel: 0.03 },
      summary: 'A sparse but resilient desert basin. Saguaro and scrub hold a narrow band of life along a dry wash that only runs after rare storms.',
      keyChanges: ['Stable dune structure', 'Intact dry wash channel', 'Low but resilient biodiversity'],
    },
    {
      year: 2005,
      label: '2005',
      metrics: { vegetationDensity: 0.22, waterLevel: 0, biodiversityLevel: 0.38, developmentLevel: 0.14 },
      summary: 'New groundwater wells serving development on the basin\u2019s edge have begun drawing down the water table that deep-rooted desert plants depend on.',
      keyChanges: ['Groundwater wells installed at basin edge', 'Deep-rooted vegetation begins to decline', 'First signs of reduced cactus growth rates'],
    },
    {
      year: 2015,
      label: '2015',
      metrics: { vegetationDensity: 0.19, waterLevel: 0, biodiversityLevel: 0.34, developmentLevel: 0.2 },
      summary: 'A second well cluster has gone in near the basin\u2019s eastern edge, and the barrel cacti along the dry wash are noticeably smaller than a decade ago.',
      keyChanges: ['Second well cluster drilled at the eastern edge', 'Barrel cacti along the wash show reduced growth', 'Water table continuing to drop'],
    },
    {
      year: 2026,
      label: '2026',
      metrics: { vegetationDensity: 0.17, waterLevel: 0, biodiversityLevel: 0.3, developmentLevel: 0.26 },
      summary: 'Continued groundwater draw for nearby development has thinned deep-rooted vegetation further, and the basin edge is visibly more built-up.',
      keyChanges: ['Reduced deep-rooted vegetation', 'Increased development at basin edge', 'Hawk sightings less frequent'],
    },
    {
      year: 2050,
      label: '2050',
      metrics: { vegetationDensity: 0.14, waterLevel: 0, biodiversityLevel: 0.24, developmentLevel: 0.38 },
      summary: 'Outcome depends on the chosen scenario \u2014 continued groundwater depletion, or managed water use that lets the basin stabilize.',
      keyChanges: ['Outcome depends on the chosen scenario', 'Illustrative \u2014 not a scientific forecast'],
    },
    {
      year: 2075,
      label: '2075',
      metrics: { vegetationDensity: 0.08, waterLevel: 0, biodiversityLevel: 0.15, developmentLevel: 0.5 },
      summary: 'A generation further on, the split is stark \u2014 either the water table has dropped past what deep-rooted cacti can reach and the basin has thinned to scattered scrub, or decades of managed use have let the wash\u2019s vegetation band hold steady.',
      keyChanges: ['Divergence between scenarios compounds over 25 more years', 'Risk of deep-rooted cactus die-off under continued depletion', 'Illustrative \u2014 not a scientific forecast'],
    },
  ],
  objects: [
    { id: 'desert-cactus-1', kind: 'cactus', biodiversityCategory: 'plants', name: 'Saguaro Cactus', position: [-4, 1.44, -3], presentInYears: [1985, 2005, 2015, 2026, 2050, 2075], description: 'A tall saguaro standing among scattered dune grasses, one of the basin\u2019s oldest visible plants.', ecologicalRole: 'Provides nesting cavities for desert birds and stores water that supports the wider food web during drought.', historicalChange: 'Growth has slowed and new saguaro establishment has become rarer as groundwater draw has increased nearby.', trophicRole: 'producer', habitat: 'Open dune basin', environmentalPressures: ['Groundwater depletion', 'Off-road disturbance'] },
    { id: 'desert-cactus-2', kind: 'cactus', biodiversityCategory: 'plants', name: 'Barrel Cactus', position: [3, 1.54, -1.5], presentInYears: [1985, 2005, 2015, 2026, 2050, 2075], description: 'A squat barrel cactus tucked between dune ridges.', ecologicalRole: 'Its shallow root network stabilizes loose dune sand and its flowers feed desert pollinators.', historicalChange: 'Remains present but smaller in stature as available soil moisture has decreased.', trophicRole: 'producer', habitat: 'Dune ridge crevices', environmentalPressures: ['Reduced soil moisture', 'Sand destabilization from off-road vehicles'] },
    { id: 'desert-cactus-3', kind: 'cactus', biodiversityCategory: 'plants', name: 'Saguaro Cactus', position: [-7, 1.2, 2], presentInYears: [1985, 2005, 2015, 2026, 2050, 2075], description: 'A younger saguaro on the basin\u2019s western slope.', ecologicalRole: 'A future nesting site for desert birds once mature enough to develop cavities.', historicalChange: 'Growth rate has slowed markedly since 2005 as the water table has dropped.', trophicRole: 'producer', habitat: 'Western dune slope', environmentalPressures: ['Groundwater depletion', 'Slowed growth rate'] },
    { id: 'desert-cactus-4', kind: 'cactus', biodiversityCategory: 'plants', name: 'Barrel Cactus', position: [6, 1.4, 4], presentInYears: [1985, 2005, 2015, 2026], description: 'A barrel cactus near the dry wash\u2019s edge, benefiting from occasional storm runoff.', ecologicalRole: 'Anchors the narrow band of denser vegetation that follows the dry wash.', historicalChange: 'Lost by 2050 under the continue-as-is scenario as storm runoff along the wash becomes rarer still.', trophicRole: 'producer', habitat: 'Dry wash margin', environmentalPressures: ['Declining storm runoff frequency', 'Habitat loss by 2050'] },

    { id: 'desert-riverbed-1', kind: 'dryRiverbed', biodiversityCategory: null, name: 'Painted Wash', position: [1, 1.46, 0], presentInYears: [1985, 2005, 2015, 2026, 2050, 2075], description: 'A cracked, sandy channel cutting across the basin floor \u2014 it only carries water during rare storms, but its shape and the dense vegetation along its banks are the clearest evidence a waterway ever ran here.', ecologicalRole: 'Concentrates the little available moisture after storms, supporting a narrow band of denser vegetation along its banks even in dry years.', historicalChange: 'The channel itself is unchanged in shape, though flow events have become rarer and the vegetation lining it has thinned.' },

    { id: 'desert-hawk-1', kind: 'bird', biodiversityCategory: 'birds', name: "Harris's Hawk", position: [0, 5, -6], presentInYears: [1985, 2005, 2015, 2026, 2050, 2075], description: 'A hawk that patrols the basin from above, hunting small mammals and reptiles.', ecologicalRole: 'A top predator that indicates a functioning desert food web beneath it.', historicalChange: 'Sightings have grown less frequent as prey populations have thinned alongside vegetation loss.', trophicRole: 'secondary-consumer', habitat: 'Open desert airspace above the basin', diet: 'Small mammals, reptiles, and large insects', environmentalPressures: ['Declining prey base', 'Habitat fragmentation from development'] },
    { id: 'desert-lizard-1', kind: 'animal', biodiversityCategory: 'wildlife', name: 'Desert Spiny Lizard', position: [-2, 1.27, 3.5], presentInYears: [1985, 2005, 2015, 2026, 2050, 2075], description: 'A lizard basking on a sun-warmed rock near the dry wash.', ecologicalRole: 'Controls insect populations and is itself prey for hawks and other predators.', historicalChange: 'Population has held relatively steady, though individuals now range further to find shade and moisture.', trophicRole: 'primary-consumer', habitat: 'Sun-warmed rocks and burrows near the dry wash', diet: 'Insects and other small invertebrates', environmentalPressures: ['Rising ground temperatures', 'Reduced shade cover'] },
    { id: 'desert-rock-1', kind: 'rock', biodiversityCategory: null, name: 'Sandstone Outcrop', position: [5, 1.67, -4.5], presentInYears: [1985, 2005, 2015, 2026, 2050, 2075], description: 'A weathered sandstone formation rising from the dune floor, a favored perch and burrow site.', ecologicalRole: 'Provides shade and shelter for lizards and small mammals during the heat of the day.', historicalChange: 'Unchanged by development, this formation looks the same across all years.' },
    { id: 'desert-rock-2', kind: 'rock', biodiversityCategory: null, name: 'Dune Boulder', position: [-5.5, 1.34, -1], presentInYears: [1985, 2005, 2015, 2026, 2050, 2075], description: 'A partially sand-buried boulder near the western dune ridge.', ecologicalRole: 'Anchors sand against wind erosion and offers nighttime warmth retention for reptiles.', historicalChange: 'Unchanged across the simulated years.' },
    { id: 'desert-rock-4', kind: 'rock', variant: 'slab', biodiversityCategory: null, name: 'Sun-Cracked Slab', position: [-2.3, 1.29, 3.6], presentInYears: [1985, 2005, 2015, 2026, 2050, 2075], description: 'A wide, flat slab of rock half-buried in the dune floor near the cactus stand, its surface split by decades of heat and cold.', ecologicalRole: 'Its flat face radiates stored heat well after sunset, drawing reptiles that linger there to warm themselves.', historicalChange: 'Unchanged across the simulated years.' },
    { id: 'desert-rock-5', kind: 'rock', variant: 'layered', biodiversityCategory: null, name: 'Stacked Wind Terrace', position: [6.9, 1.7, -4.6], presentInYears: [1985, 2005, 2015, 2026, 2050, 2075], description: 'A short stack of wind-carved rock layers near the sandstone outcrop, each layer slightly narrower than the one below it.', ecologicalRole: 'The gaps between its layers form narrow crevices used by lizards and small insects sheltering from the sun.', historicalChange: 'Unchanged across the simulated years.' },

    { id: 'desert-development-1', kind: 'building', biodiversityCategory: null, name: 'Well Pump Station', position: [9, 1.51, 2], presentInYears: [2005, 2015, 2026, 2050, 2075], description: 'A groundwater pump station built to serve development on the basin\u2019s edge.', ecologicalRole: 'Represents the human infrastructure drawing down the water table that desert plants and wildlife depend on.', historicalChange: 'Built in the mid-2000s, this station is the main driver of the basin\u2019s declining vegetation density.' },

    { id: 'desert-mountain-backdrop', kind: 'mountain', biodiversityCategory: null, name: 'Painted Range', position: [-1, 1.87, -24], presentInYears: [1985, 2005, 2015, 2026, 2050, 2075], description: 'A distant, sun-bleached mountain range framing the basin\u2019s northern horizon.', ecologicalRole: 'Shapes the basin\u2019s rain shadow and feeds rare flash floods down the dry wash after winter storms.', historicalChange: 'Unchanged in shape across the simulated years, though haze from nearby development has occasionally softened its outline.' },
    { id: 'desert-shrub-1', kind: 'plant', variant: 'dryShrub', biodiversityCategory: 'plants', name: 'Desert Scrub Bush', position: [2, 1.39, 2.5], presentInYears: [1985, 2005, 2015, 2026, 2050, 2075], description: 'A low, wiry scrub bush clinging to the dune floor between the cacti.', ecologicalRole: 'Its brittle branches shade the soil surface, slowing moisture loss and sheltering ground-nesting insects.', historicalChange: 'Cover has thinned alongside the basin\u2019s other deep-rooted vegetation as groundwater draw has increased.', trophicRole: 'producer', habitat: 'Open dune floor between cacti', environmentalPressures: ['Groundwater depletion', 'Soil moisture loss'] },

    // ---------------- Vegetation variety: yucca + flowering succulent (organic clustering) ----------------
    { id: 'desert-yucca-1', kind: 'plant', variant: 'yucca', biodiversityCategory: 'plants', name: 'Soaptree Yucca', position: [-9, 1.3, 3], presentInYears: [1985, 2005, 2015, 2026, 2050, 2075], description: 'A lone yucca standing apart from the nearest cactus stand, its spiky rosette of leaves topped by a tall flower spike.', ecologicalRole: 'Its rosette shelters ground insects from the sun, and its flower spike is a nectar source for night-flying moths.', historicalChange: 'Has persisted well as its deep taproot reaches moisture other shallow-rooted plants can no longer access.', trophicRole: 'producer', habitat: 'Open dune floor west of the main cactus stand', environmentalPressures: ['Groundwater depletion reducing deep-moisture availability', 'Off-road disturbance to shallow rosette roots'] },
    { id: 'desert-succulent-1', kind: 'plant', variant: 'succulent', biodiversityCategory: 'plants', name: 'Hedgehog Succulent', position: [3.6, 1.57, -2], presentInYears: [1985, 2005, 2015, 2026, 2050, 2075], description: 'A small flowering succulent tucked near the barrel cactus, its blooms drawing in a steady trickle of pollinators.', ecologicalRole: 'Its shallow flowers provide an easy nectar source for smaller pollinators that can\u2019t reach the taller cacti\u2019s blooms.', historicalChange: 'Bloom density has thinned slightly as nearby soil moisture has declined, though the plant itself has held on.', trophicRole: 'producer', habitat: 'Dune floor near the barrel cactus stand', environmentalPressures: ['Declining soil moisture', 'Reduced bloom density'] },
    { id: 'desert-pollinator-3', kind: 'pollinator', biodiversityCategory: 'pollinators', name: 'Desert Sweat Bee', position: [3.7, 1.87, -1.9], presentInYears: [1985, 2005, 2015, 2026, 2050, 2075], description: 'A tiny metallic-green sweat bee working the succulent\u2019s low blooms.', ecologicalRole: 'Pollinates low-growing succulent flowers that larger pollinators like the tarantula hawk wasp tend to pass over.', historicalChange: 'Sightings have tracked the succulent\u2019s bloom density, thinning slightly as flowering has declined.', trophicRole: 'primary-consumer', habitat: 'Low succulent blooms near the barrel cactus stand', diet: 'Flower nectar and pollen', environmentalPressures: ['Declining succulent bloom density', 'Reduced nectar availability'] },

    // ---------------- Small life detail (Requirement 3.2) ----------------
    { id: 'desert-pollinator-1', kind: 'pollinator', biodiversityCategory: 'pollinators', name: 'Tarantula Hawk Wasp', position: [1.4, 1.65, 3.2], presentInYears: [1985, 2005, 2015, 2026, 2050, 2075], description: 'A large, iridescent tarantula hawk wasp drifting between scrub blossoms near the dune floor.', ecologicalRole: 'Adults feed on nectar and pollinate desert wildflowers and cacti, while their larvae keep tarantula populations in check.', historicalChange: 'Sightings have become less frequent as the flowering shrubs and cacti it depends on for nectar have thinned alongside declining groundwater.', trophicRole: 'primary-consumer', habitat: 'Open dune floor near flowering scrub and cacti', diet: 'Flower nectar and fermented fruit', environmentalPressures: ['Groundwater depletion reducing nectar-plant flowering', 'Declining shrub and cactus cover'] },

    // ---------------- Additional density backfill (Requirement 9.4 verification) ----------------
    { id: 'desert-cactus-5', kind: 'cactus', biodiversityCategory: 'plants', name: 'Cholla Cactus', position: [-3, 1.17, 5.5], presentInYears: [1985, 2005, 2015, 2026, 2050, 2075], description: 'A spiny cholla cactus growing in a loose stand near the basin\u2019s southern dunes.', ecologicalRole: 'Its dense spiny joints provide nesting cover for small birds and its blooms feed desert pollinators.', historicalChange: 'Has persisted better than the taller saguaros, though nearby joints show more breakage from increased foot traffic.', trophicRole: 'producer', habitat: 'Southern dune floor', environmentalPressures: ['Increased foot and off-road traffic', 'Reduced soil moisture'] },
    { id: 'desert-shrub-2', kind: 'plant', variant: 'dryShrub', biodiversityCategory: 'plants', name: 'Creosote Bush', position: [7, 1.64, -2.5], presentInYears: [1985, 2005, 2015, 2026, 2050, 2075], description: 'A wiry creosote bush spaced out from its neighbors near the eastern dune ridge.', ecologicalRole: 'Its widely spaced roots draw moisture from deep in the sand, and its resinous leaves deter most browsers.', historicalChange: 'Cover has held up better than shallower-rooted shrubs as the water table has dropped, though growth has slowed.', trophicRole: 'producer', habitat: 'Eastern dune ridge', environmentalPressures: ['Groundwater depletion', 'Slowed growth rate'] },
    { id: 'desert-tortoise-1', kind: 'animal', biodiversityCategory: 'wildlife', name: 'Desert Tortoise', position: [-4.5, 1.5, -5.5], presentInYears: [1985, 2005, 2015, 2026, 2050, 2075], description: 'A desert tortoise moving slowly between burrows near the western dune slope.', ecologicalRole: 'Its burrows provide shelter for dozens of other desert species once abandoned, making it a keystone habitat engineer.', historicalChange: 'Burrow density has declined as off-road disturbance has damaged nearby burrow sites.', trophicRole: 'primary-consumer', habitat: 'Burrows in the western dune slope', diet: 'Desert grasses, cactus pads, and wildflowers', environmentalPressures: ['Off-road vehicle disturbance to burrows', 'Declining forage availability'] },
    { id: 'desert-fox-1', kind: 'animal', biodiversityCategory: 'wildlife', name: 'Kit Fox', position: [4.5, 1.63, -3.5], presentInYears: [1985, 2005, 2015, 2026, 2050, 2075], description: 'A kit fox trotting along the dune ridge at dusk, hunting for small prey.', ecologicalRole: 'A nocturnal predator that keeps rodent and insect populations in check across the basin.', historicalChange: 'Range has expanded closer to the well pump station as natural prey elsewhere in the basin has thinned.', trophicRole: 'secondary-consumer', habitat: 'Dune ridges and basin margins', diet: 'Small rodents, insects, and reptiles', environmentalPressures: ['Habitat fragmentation from development', 'Declining natural prey base'] },
    { id: 'desert-owl-1', kind: 'bird', biodiversityCategory: 'birds', name: 'Burrowing Owl', position: [-1, 2.5, 5.5], presentInYears: [1985, 2005, 2015, 2026, 2050, 2075], description: 'A burrowing owl perched at the entrance to a reused tortoise burrow.', ecologicalRole: 'Preys on insects and small rodents, and its reuse of abandoned burrows links it directly to the desert tortoise\u2019s fate.', historicalChange: 'Sightings have declined alongside the tortoise burrows it depends on for shelter.', trophicRole: 'secondary-consumer', habitat: 'Reused burrows near the dune slopes', diet: 'Insects, small rodents, and reptiles', environmentalPressures: ['Declining burrow availability', 'Habitat fragmentation'] },
    { id: 'desert-rock-3', kind: 'rock', biodiversityCategory: null, name: 'Weathered Hoodoo', position: [8, 1.39, 5], presentInYears: [1985, 2005, 2015, 2026, 2050, 2075], description: 'A tall, narrow rock spire carved by decades of wind-blown sand.', ecologicalRole: 'Offers a shaded crevice at its base used by small reptiles during the hottest hours.', historicalChange: 'Unchanged in shape across the simulated years.' },
    { id: 'desert-pollinator-2', kind: 'pollinator', biodiversityCategory: 'pollinators', name: 'Digger Bee', position: [2.6, 1.88, -3], presentInYears: [1985, 2005, 2015, 2026, 2050, 2075], description: 'A solitary digger bee working the blooms of a nearby barrel cactus.', ecologicalRole: 'Pollinates cactus flowers and nests in loose sand, helping sustain the basin\u2019s cactus population.', historicalChange: 'Nesting success has declined as looser, moister sand suitable for burrowing has become scarcer.', trophicRole: 'primary-consumer', habitat: 'Loose sand near flowering cacti', diet: 'Flower nectar and pollen', environmentalPressures: ['Scarcer loose, moist sand for nesting', 'Declining cactus bloom density'] },
    { id: 'desert-jackrabbit-1', kind: 'animal', biodiversityCategory: 'wildlife', name: 'Black-tailed Jackrabbit', position: [-6, 1.28, 0.5], presentInYears: [1985, 2005, 2015, 2026, 2050, 2075], description: 'A jackrabbit resting in the shade of a creosote bush near the basin\u2019s center.', ecologicalRole: 'A key prey species for hawks and foxes, and its grazing shapes low shrub growth across the basin.', historicalChange: 'Population has held relatively steady, though individuals now range further to find shade and forage.', trophicRole: 'primary-consumer', habitat: 'Open dune floor and shrub cover', diet: 'Grasses, shrub leaves, and cactus pads', environmentalPressures: ['Rising ground temperatures', 'Reduced shrub cover for shade'] },

    // ---------------- Environmental detail: burrow with tracks (Requirement: habitat storytelling) ----------------
    { id: 'desert-burrow-1', kind: 'burrow', biodiversityCategory: null, name: 'Tortoise Burrow', position: [-3.5, 1.54, -6.2], presentInYears: [1985, 2005, 2015, 2026, 2050, 2075], description: 'A dished burrow entrance dug into the dune slope, with a faint trail of tracks leading away from it \u2014 one of the burrows the desert tortoise and burrowing owl both depend on.', ecologicalRole: 'A habitat-engineering structure: once dug and later abandoned by a tortoise, burrows like this are reused by owls, snakes, and other small desert animals for shelter from the heat.', historicalChange: 'Burrow density nearby has declined as off-road disturbance has collapsed or buried older burrow entrances.' },

    // ---------------- Wildlife: scorpion (Requirement: dry soil / rocky-environment gap) ----------------
    { id: 'desert-scorpion-1', kind: 'scorpion', biodiversityCategory: 'wildlife', name: 'Desert Hairy Scorpion', position: [4.6, 1.66, -4.3], presentInYears: [1985, 2005, 2015, 2026, 2050, 2075], description: 'A scorpion tucked in the shade at the base of the sandstone outcrop, tail curled and ready.', ecologicalRole: 'A nocturnal predator that keeps insect and small-arthropod populations in check among the basin\u2019s rocks and dry soil.', historicalChange: 'Has held on better than more heat-sensitive species, though prey has thinned as insect populations decline alongside vegetation loss.', trophicRole: 'secondary-consumer', habitat: 'Rocky crevices and dry soil near the sandstone outcrop', diet: 'Insects, spiders, and other small arthropods', environmentalPressures: ['Declining insect prey base', 'Rising ground temperatures reducing shaded shelter'] },
    { id: 'desert-scorpion-2', kind: 'scorpion', biodiversityCategory: 'wildlife', name: 'Striped Bark Scorpion', position: [-6.2, 1.34, -1.6], presentInYears: [1985, 2005, 2015, 2026, 2050, 2075], description: 'A smaller, paler scorpion sheltering beneath the dune boulder\u2019s overhang.', ecologicalRole: 'Hunts small insects at night and is itself an occasional prey item for the kit fox and burrowing owl.', historicalChange: 'Sightings have remained fairly steady, though individuals now cluster more tightly around remaining shaded rock cover.', trophicRole: 'secondary-consumer', habitat: 'Shaded rock overhangs near the dune boulder', diet: 'Small insects and other arthropods', environmentalPressures: ['Reduced shaded rock cover', 'Rising ground temperatures'] },
  ],
  storyChapters: [
    {
      id: 'ch1',
      title: 'The Basin',
      year: 1985,
      narration: 'This desert looks empty at a glance, but every cactus and dry wash is part of a tightly tuned water economy that has held stable for generations.',
      focusObjectId: 'desert-cactus-1',
    },
    {
      id: 'ch2',
      title: 'The Wash',
      year: 1985,
      narration: 'The Painted Wash rarely carries water, but its banks hold the densest vegetation in the basin \u2014 a visible reminder of where water used to flow more often.',
      focusObjectId: 'desert-riverbed-1',
    },
    {
      id: 'ch3',
      title: 'The Wells',
      year: 2026,
      narration: 'Groundwater wells drilled to serve nearby development have quietly lowered the water table, and the basin\u2019s deep-rooted plants are the first to show it.',
      focusObjectId: 'desert-development-1',
    },
    {
      id: 'ch4',
      title: 'The Choice',
      year: 2050,
      narration: 'From here, groundwater draw could keep increasing, or water use could be managed to let the basin stabilize. What happens next depends on that choice.',
    },
    {
      id: 'ch5',
      title: 'Two Futures',
      year: 2050,
      narration: 'Compare "Continue as Is" with "Protect & Restore" to see how different choices could shape the next 25 years of this desert basin.',
      scenarioId: 'continue-as-is',
    },
  ],
};
