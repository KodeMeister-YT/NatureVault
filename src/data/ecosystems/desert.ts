import type { BiomeDefinition } from '../../types/vault';

export const desertVault: BiomeDefinition = {
  ecosystemId: 'desert',
  name: 'Painted Basin Desert',
  location: 'Painted Basin, Southern Oregon High Desert',
  terrain: {
    kind: 'duned-desert',
    // Warm sand / dry clay palette, distinct from every green-toned biome.
    palette: { primary: '#c9a877', secondary: '#a9855a', developed: '#8a8070' },
    params: { duneAmplitude: 2.4 },
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
  },
  cameraDefaults: { position: [0, 1.8, 10], target: [0, 1, -2], fov: 58, minDistance: 3, maxDistance: 40, maxPolarAngle: Math.PI / 2.1 },
  style: { entries: [{ kind: 'cactus', colorPrimary: '#5f7a54' }] },
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
  ],
  objects: [
    { id: 'desert-cactus-1', kind: 'cactus', biodiversityCategory: 'plants', name: 'Saguaro Cactus', position: [-4, 0, -3], presentInYears: [1985, 2005, 2026, 2050], description: 'A tall saguaro standing among scattered dune grasses, one of the basin\u2019s oldest visible plants.', ecologicalRole: 'Provides nesting cavities for desert birds and stores water that supports the wider food web during drought.', historicalChange: 'Growth has slowed and new saguaro establishment has become rarer as groundwater draw has increased nearby.', trophicRole: 'producer', habitat: 'Open dune basin', environmentalPressures: ['Groundwater depletion', 'Off-road disturbance'] },
    { id: 'desert-cactus-2', kind: 'cactus', biodiversityCategory: 'plants', name: 'Barrel Cactus', position: [3, 0, -1.5], presentInYears: [1985, 2005, 2026, 2050], description: 'A squat barrel cactus tucked between dune ridges.', ecologicalRole: 'Its shallow root network stabilizes loose dune sand and its flowers feed desert pollinators.', historicalChange: 'Remains present but smaller in stature as available soil moisture has decreased.', trophicRole: 'producer', habitat: 'Dune ridge crevices', environmentalPressures: ['Reduced soil moisture', 'Sand destabilization from off-road vehicles'] },
    { id: 'desert-cactus-3', kind: 'cactus', biodiversityCategory: 'plants', name: 'Saguaro Cactus', position: [-7, 0, 2], presentInYears: [1985, 2005, 2026, 2050], description: 'A younger saguaro on the basin\u2019s western slope.', ecologicalRole: 'A future nesting site for desert birds once mature enough to develop cavities.', historicalChange: 'Growth rate has slowed markedly since 2005 as the water table has dropped.', trophicRole: 'producer', habitat: 'Western dune slope', environmentalPressures: ['Groundwater depletion', 'Slowed growth rate'] },
    { id: 'desert-cactus-4', kind: 'cactus', biodiversityCategory: 'plants', name: 'Barrel Cactus', position: [6, 0, 4], presentInYears: [1985, 2005, 2026], description: 'A barrel cactus near the dry wash\u2019s edge, benefiting from occasional storm runoff.', ecologicalRole: 'Anchors the narrow band of denser vegetation that follows the dry wash.', historicalChange: 'Lost by 2050 under the continue-as-is scenario as storm runoff along the wash becomes rarer still.', trophicRole: 'producer', habitat: 'Dry wash margin', environmentalPressures: ['Declining storm runoff frequency', 'Habitat loss by 2050'] },

    { id: 'desert-riverbed-1', kind: 'dryRiverbed', biodiversityCategory: null, name: 'Painted Wash', position: [1, 0, 0], presentInYears: [1985, 2005, 2026, 2050], description: 'A cracked, sandy channel cutting across the basin floor \u2014 it only carries water during rare storms, but its shape and the dense vegetation along its banks are the clearest evidence a waterway ever ran here.', ecologicalRole: 'Concentrates the little available moisture after storms, supporting a narrow band of denser vegetation along its banks even in dry years.', historicalChange: 'The channel itself is unchanged in shape, though flow events have become rarer and the vegetation lining it has thinned.' },

    { id: 'desert-hawk-1', kind: 'bird', biodiversityCategory: 'birds', name: "Harris's Hawk", position: [0, 5, -6], presentInYears: [1985, 2005, 2026, 2050], description: 'A hawk that patrols the basin from above, hunting small mammals and reptiles.', ecologicalRole: 'A top predator that indicates a functioning desert food web beneath it.', historicalChange: 'Sightings have grown less frequent as prey populations have thinned alongside vegetation loss.', trophicRole: 'secondary-consumer', habitat: 'Open desert airspace above the basin', diet: 'Small mammals, reptiles, and large insects', environmentalPressures: ['Declining prey base', 'Habitat fragmentation from development'] },
    { id: 'desert-lizard-1', kind: 'animal', biodiversityCategory: 'wildlife', name: 'Desert Spiny Lizard', position: [-2, 0, 3.5], presentInYears: [1985, 2005, 2026, 2050], description: 'A lizard basking on a sun-warmed rock near the dry wash.', ecologicalRole: 'Controls insect populations and is itself prey for hawks and other predators.', historicalChange: 'Population has held relatively steady, though individuals now range further to find shade and moisture.', trophicRole: 'primary-consumer', habitat: 'Sun-warmed rocks and burrows near the dry wash', diet: 'Insects and other small invertebrates', environmentalPressures: ['Rising ground temperatures', 'Reduced shade cover'] },
    { id: 'desert-rock-1', kind: 'rock', biodiversityCategory: null, name: 'Sandstone Outcrop', position: [5, 0, -4.5], presentInYears: [1985, 2005, 2026, 2050], description: 'A weathered sandstone formation rising from the dune floor, a favored perch and burrow site.', ecologicalRole: 'Provides shade and shelter for lizards and small mammals during the heat of the day.', historicalChange: 'Unchanged by development, this formation looks the same across all years.' },
    { id: 'desert-rock-2', kind: 'rock', biodiversityCategory: null, name: 'Dune Boulder', position: [-5.5, 0, -1], presentInYears: [1985, 2005, 2026, 2050], description: 'A partially sand-buried boulder near the western dune ridge.', ecologicalRole: 'Anchors sand against wind erosion and offers nighttime warmth retention for reptiles.', historicalChange: 'Unchanged across the simulated years.' },

    { id: 'desert-development-1', kind: 'building', biodiversityCategory: null, name: 'Well Pump Station', position: [9, 0, 2], presentInYears: [2005, 2026, 2050], description: 'A groundwater pump station built to serve development on the basin\u2019s edge.', ecologicalRole: 'Represents the human infrastructure drawing down the water table that desert plants and wildlife depend on.', historicalChange: 'Built in the mid-2000s, this station is the main driver of the basin\u2019s declining vegetation density.' },
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
