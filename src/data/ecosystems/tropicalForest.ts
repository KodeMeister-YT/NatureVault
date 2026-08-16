import type { BiomeDefinition } from '../../types/vault';

export const tropicalForestVault: BiomeDefinition = {
  ecosystemId: 'tropical-forest',
  name: 'Río Esmeralda Rainforest',
  location: 'Río Esmeralda Reserve, Central America',
  terrain: {
    kind: 'rolling-hills',
    // Lush, humid rainforest-floor palette — deep saturated green with a
    // warm loamy secondary tone, distinct from evergreenValley's deep
    // conifer green (#294f2a/#5c6b3e) and coastalWetland's muted marsh tones.
    palette: { primary: '#1f5c34', secondary: '#4a7a3a', shoreline: '#3f5a2a', developed: '#5a4f3a' },
  },
  water: { kind: 'waterfall', deepColor: '#3f7f8c', shallowColor: '#bfe8ea' },
  atmosphere: {
    skyTreatment: 'sky-and-clouds',
    // Warm, diffuse humid-haze light — not harsh like desert, not cool like
    // alpine. Soft golden-green sun filtered through dense canopy moisture.
    sun: { color: '#e8dca0', intensity: 1.9, position: [12, 15, 7] },
    ambient: { color: '#bcd8a0', intensity: 0.5 },
    hemisphere: { skyColor: '#a8c9a0', groundColor: '#2f4a28', intensity: 0.6 },
    // Dense near fog per design.md's explicit note — a near value well under
    // every other biome's (coastalWetland 10, evergreenValley 12, freshwaterLake
    // 22, alpine 26, desert 30), so the humid haze reads as genuinely close.
    fog: { color: '#4a6a48', near: 6, far: 36 },
  },
  cameraDefaults: { position: [0, 1.6, 8], target: [0, 2, -3], fov: 58, minDistance: 2.5, maxDistance: 28, maxPolarAngle: Math.PI / 2.05 },
  style: { entries: [] },
  years: [
    {
      year: 1995,
      label: '1995',
      metrics: { vegetationDensity: 0.95, waterLevel: 0.9, biodiversityLevel: 0.92, developmentLevel: 0.03 },
      summary: 'An unbroken rainforest canopy shelters a dense understory of vines and flowering plants, fed by a year-round waterfall.',
      keyChanges: ['Continuous, multi-layered canopy', 'Healthy waterfall flow', 'Abundant understory biodiversity'],
    },
    {
      year: 2015,
      label: '2015',
      metrics: { vegetationDensity: 0.78, waterLevel: 0.82, biodiversityLevel: 0.72, developmentLevel: 0.16 },
      summary: 'Selective logging along the reserve\u2019s edge has thinned the outer canopy, and wildlife sightings near the clearing have become less frequent.',
      keyChanges: ['Selective logging begins at the reserve edge', 'Outer canopy thinning', 'Reduced wildlife sightings near cleared areas'],
    },
    {
      year: 2026,
      label: '2026',
      metrics: { vegetationDensity: 0.6, waterLevel: 0.7, biodiversityLevel: 0.55, developmentLevel: 0.3 },
      summary: 'Continued logging pressure and a warming, drying climate have reduced canopy cover further, and the waterfall\u2019s dry-season flow has weakened.',
      keyChanges: ['Expanded logging footprint', 'Weaker dry-season waterfall flow', 'Vine and epiphyte cover declining'],
    },
    {
      year: 2050,
      label: '2050',
      metrics: { vegetationDensity: 0.46, waterLevel: 0.55, biodiversityLevel: 0.4, developmentLevel: 0.42 },
      summary: 'Outcome depends on the chosen scenario \u2014 continued logging pressure, or active reserve protection that lets the canopy recover.',
      keyChanges: ['Outcome depends on the chosen scenario', 'Illustrative \u2014 not a scientific forecast'],
    },
  ],
  objects: [
    { id: 'tropical-canopy-1', kind: 'canopyTree', variant: 'broadleaf', biodiversityCategory: 'plants', name: 'Kapok Tree', position: [-4, 0, -3], presentInYears: [1995, 2015, 2026, 2050], description: 'A towering kapok tree whose broad, flat canopy forms part of the reserve\u2019s upper layer.', ecologicalRole: 'Its wide canopy anchors the forest\u2019s upper layer, hosting epiphytes and sheltering the understory below.', historicalChange: 'Canopy width has held steady, though neighboring trees at the reserve edge have been thinned by logging.', trophicRole: 'producer', habitat: 'Rainforest upper canopy', environmentalPressures: ['Selective logging at the reserve edge', 'Reduced humidity from canopy gaps nearby'] },
    { id: 'tropical-canopy-2', kind: 'canopyTree', variant: 'broadleaf', biodiversityCategory: 'plants', name: 'Strangler Fig', position: [3, 0, -4], presentInYears: [1995, 2015, 2026, 2050], description: 'A strangler fig with a wide, layered canopy near the waterfall pool.', ecologicalRole: 'Produces fruit relied on by birds and monkeys, and its dense canopy holds moisture over the pool below.', historicalChange: 'Fruit production has remained steady, but neighboring canopy loss has left it more exposed to wind.', trophicRole: 'producer', habitat: 'Canopy near the waterfall pool', environmentalPressures: ['Increased wind exposure from nearby canopy gaps', 'Warmer, drier dry seasons'] },
    { id: 'tropical-canopy-3', kind: 'canopyTree', variant: 'broadleaf', biodiversityCategory: 'plants', name: 'Ceiba Tree', position: [-6, 0, 3], presentInYears: [1995, 2015, 2026], description: 'A ceiba tree at the reserve\u2019s western edge, closest to the logging boundary.', ecologicalRole: 'One of the tallest trees in this stretch of forest, providing nesting sites high above the understory.', historicalChange: 'Lost by 2050 under the continue-as-is scenario as logging reaches the western boundary.', trophicRole: 'producer', habitat: 'Western reserve-edge canopy', environmentalPressures: ['Encroaching logging boundary', 'Habitat loss by 2050'] },
    { id: 'tropical-vine-1', kind: 'vine', biodiversityCategory: 'plants', name: 'Liana Vine Cluster', position: [-4, 0, -2.6], presentInYears: [1995, 2015, 2026, 2050], description: 'A cluster of liana vines draping down from the kapok tree\u2019s lower branches.', ecologicalRole: 'Provides aerial pathways for monkeys and shelter for climbing insects and frogs.', historicalChange: 'Cover has thinned slightly as the humidity beneath the canopy has dropped.', trophicRole: 'producer', habitat: 'Hanging from canopy-tree branches', environmentalPressures: ['Declining understory humidity', 'Canopy gaps reducing moisture retention'] },
    { id: 'tropical-vine-2', kind: 'vine', biodiversityCategory: 'plants', name: 'Liana Vine Cluster', position: [3.2, 0, -3.6], presentInYears: [1995, 2015, 2026, 2050], description: 'Vines trailing from the strangler fig down toward the waterfall pool.', ecologicalRole: 'Anchors moisture-loving epiphytes and gives tree frogs a route between canopy and water.', historicalChange: 'Remains present in every simulated year, though individual strands have become sparser.', trophicRole: 'producer', habitat: 'Draping from fig canopy toward the pool', environmentalPressures: ['Weaker dry-season waterfall flow', 'Reduced ambient humidity'] },
    { id: 'tropical-flower-1', kind: 'tropicalFlower', biodiversityCategory: 'pollinators', name: 'Heliconia Cluster', position: [-1.5, 0, 1.5], presentInYears: [1995, 2015, 2026, 2050], description: 'A vivid cluster of heliconia blooms at the forest floor\u2019s edge.', ecologicalRole: 'A key nectar source for hummingbirds and butterflies moving through the understory.', historicalChange: 'Bloom density has held steady, though pollinator visits have become less frequent as forest edges have opened.', trophicRole: 'producer', habitat: 'Sunlit understory clearing edge', environmentalPressures: ['Reduced pollinator visitation', 'Understory drying near canopy gaps'] },
    { id: 'tropical-flower-2', kind: 'tropicalFlower', biodiversityCategory: 'pollinators', name: 'Passionflower Patch', position: [2, 0, 2.5], presentInYears: [1995, 2015, 2026, 2050], description: 'A bright patch of passionflowers climbing low shrubs near the waterfall pool.', ecologicalRole: 'Supports butterfly larvae and provides nectar for pollinating insects.', historicalChange: 'Remains present throughout, a resilient patch even as surrounding cover has thinned.', trophicRole: 'producer', habitat: 'Low shrubs near the waterfall pool', environmentalPressures: ['Thinning surrounding shade cover'] },
    { id: 'tropical-waterfall-1', kind: 'waterfall', biodiversityCategory: 'water', name: 'Esmeralda Falls', position: [0, 0, -6], presentInYears: [1995, 2015, 2026, 2050], description: 'A year-round waterfall cascading into a clear pool at the heart of the reserve.', ecologicalRole: 'Feeds the reserve\u2019s streams and pools, sustaining amphibians, birds, and the humid microclimate the canopy depends on.', historicalChange: 'Dry-season flow has weakened as upstream canopy loss has reduced water retention in the watershed.', featureRadius: 7, trophicRole: 'producer', habitat: 'Forest waterfall and pool', environmentalPressures: ['Upstream canopy loss reducing water retention', 'Weaker dry-season flow'] },
    { id: 'tropical-toucan-1', kind: 'bird', biodiversityCategory: 'birds', name: 'Keel-billed Toucan', position: [-2, 5, -4], presentInYears: [1995, 2015, 2026, 2050], description: 'A toucan moving between canopy trees, its bright bill visible above the understory.', ecologicalRole: 'A key seed disperser — its diet of canopy fruit spreads tree seeds across the reserve.', historicalChange: 'Sightings have become less frequent near the logging boundary as fruiting trees there have thinned.', trophicRole: 'secondary-consumer', habitat: 'Rainforest canopy and upper understory', diet: 'Fruit, insects, and small lizards', environmentalPressures: ['Loss of fruiting canopy trees near the boundary', 'Habitat fragmentation'] },
    { id: 'tropical-treefrog-1', kind: 'frog', biodiversityCategory: 'wildlife', name: 'Red-eyed Tree Frog', position: [1, 0, -5], presentInYears: [1995, 2015, 2026, 2050], description: 'A tree frog resting on broad leaves near the waterfall pool.', ecologicalRole: 'An indicator species highly sensitive to humidity and water quality changes in the forest.', historicalChange: 'Populations near the pool have held on better than elsewhere in the reserve, thanks to the waterfall\u2019s continued moisture.', trophicRole: 'secondary-consumer', habitat: 'Broadleaf vegetation near the waterfall pool', diet: 'Insects and other small invertebrates', environmentalPressures: ['Sensitivity to declining humidity', 'Water quality changes upstream'] },
    { id: 'tropical-monkey-1', kind: 'animal', biodiversityCategory: 'wildlife', name: 'Howler Monkey', position: [-3, 0, 4], presentInYears: [1995, 2015, 2026], description: 'A howler monkey troop moving through the mid-canopy, their calls audible across the reserve.', ecologicalRole: 'Disperses seeds across long distances and helps regulate canopy leaf growth through browsing.', historicalChange: 'Troop range has contracted as logging has fragmented the canopy pathways they travel; absent from the degraded 2050 scenario.', trophicRole: 'primary-consumer', habitat: 'Mid-to-upper canopy travel routes', diet: 'Leaves, fruit, and flowers', environmentalPressures: ['Canopy fragmentation limiting travel routes', 'Loss of connected canopy cover'] },
  ],
  storyChapters: [
    {
      id: 'ch1',
      title: 'The Canopy',
      year: 1995,
      narration: 'In 1995, an unbroken canopy of kapok, fig, and ceiba trees sheltered a dense, humid world of vines and flowering plants below.',
      focusObjectId: 'tropical-canopy-1',
    },
    {
      id: 'ch2',
      title: 'The Falls',
      year: 1995,
      narration: 'Esmeralda Falls fed the reserve year-round, keeping the air humid enough for tree frogs and orchids to thrive far from open water.',
      focusObjectId: 'tropical-waterfall-1',
    },
    {
      id: 'ch3',
      title: 'The Edge',
      year: 2026,
      narration: 'Selective logging along the reserve\u2019s boundary has thinned the outer canopy, and the fruiting trees toucans and monkeys depend on are becoming harder to find.',
      focusObjectId: 'tropical-toucan-1',
    },
    {
      id: 'ch4',
      title: 'The Choice',
      year: 2050,
      narration: 'From here, logging pressure could keep expanding, or active protection could let the canopy recover. What happens next depends on that choice.',
    },
    {
      id: 'ch5',
      title: 'Two Futures',
      year: 2050,
      narration: 'Compare "Continue as Is" with "Protect & Restore" to see how different choices could shape the next 25 years of this rainforest.',
      scenarioId: 'continue-as-is',
    },
  ],
};
