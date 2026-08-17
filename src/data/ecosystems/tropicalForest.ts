import type { BiomeDefinition } from '../../types/vault';

export const tropicalForestVault: BiomeDefinition = {
  ecosystemId: 'tropical-forest',
  name: 'RÃ­o Esmeralda Rainforest',
  location: 'RÃ­o Esmeralda Reserve, Central America',
  terrain: {
    kind: 'rolling-hills',
    // Lush, humid rainforest-floor palette â€” deep saturated green with a
    // warm loamy secondary tone, distinct from evergreenValley's deep
    // conifer green (#294f2a/#5c6b3e) and coastalWetland's muted marsh tones.
    palette: { primary: '#1f5c34', secondary: '#4a7a3a', shoreline: '#3f5a2a', developed: '#5a4f3a' },
  },
  water: { kind: 'waterfall', deepColor: '#3f7f8c', shallowColor: '#bfe8ea' },
  atmosphere: {
    skyTreatment: 'sky-and-clouds',
    // Warm, diffuse humid-haze light â€” not harsh like desert, not cool like
    // alpine. Soft golden-green sun filtered through dense canopy moisture.
    sun: { color: '#e8dca0', intensity: 1.9, position: [12, 15, 7] },
    ambient: { color: '#bcd8a0', intensity: 0.5 },
    hemisphere: { skyColor: '#a8c9a0', groundColor: '#2f4a28', intensity: 0.6 },
    // Dense near fog per design.md's explicit note â€” a near value well under
    // every other biome's (coastalWetland 10, evergreenValley 12, freshwaterLake
    // 22, alpine 26, desert 30), so the humid haze reads as genuinely close.
    fog: { color: '#4a6a48', near: 6, far: 36 },
  },
  cameraDefaults: { position: [0, 1.6, 8], target: [0, 2, -3], fov: 58, minDistance: 2.5, maxDistance: 28, maxPolarAngle: Math.PI / 2.05 },
  style: {
    entries: [
      // Vivid blue-morpho-inspired blue for the tropical forest's butterfly, distinct
      // from the shared default pollinator amber (#e0a83c) and from grasslandSavanna's
      // orange/monarch butterfly override.
      { kind: 'pollinator', variant: 'butterfly', colorPrimary: '#3f6fd6', colorAccent: '#6f9aec' },
    ],
  },
  years: [
    {
      year: 1995,
      label: '1995',
      metrics: { vegetationDensity: 0.95, waterLevel: 0.9, biodiversityLevel: 0.92, developmentLevel: 0.03 },
      summary: 'An unbroken rainforest canopy shelters a dense understory of vines and flowering plants, fed by a year-round waterfall.',
      keyChanges: ['Continuous, multi-layered canopy', 'Healthy waterfall flow', 'Abundant understory biodiversity'],
    },
    {
      year: 2005,
      label: '2005',
      metrics: { vegetationDensity: 0.87, waterLevel: 0.86, biodiversityLevel: 0.83, developmentLevel: 0.09 },
      summary: 'A logging access road has reached the reserve\u2019s outer boundary, opening the first small gaps in an otherwise still-continuous canopy.',
      keyChanges: ['Logging access road reaches the reserve boundary', 'First canopy gaps open along the access trail', 'Interior canopy still largely intact'],
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
    {
      year: 2075,
      label: '2075',
      metrics: { vegetationDensity: 0.34, waterLevel: 0.42, biodiversityLevel: 0.27, developmentLevel: 0.56 },
      summary: 'A generation further on, the gap between the two paths has widened sharply \u2014 either the canopy has fragmented into isolated patches, or decades of protection have let the reserve\u2019s interior recover toward its former density.',
      keyChanges: ['Divergence between scenarios compounds over 25 more years', 'Canopy fragmentation risk peaks under continued logging', 'Illustrative \u2014 not a scientific forecast'],
    },
  ],
  objects: [
    { id: 'tropical-canopy-1', kind: 'canopyTree', variant: 'broadleaf', biodiversityCategory: 'plants', name: 'Kapok Tree', position: [-4, 0, -3], presentInYears: [1995, 2005, 2015, 2026, 2050, 2075], description: 'A towering kapok tree whose broad, flat canopy forms part of the reserve\u2019s upper layer.', ecologicalRole: 'Its wide canopy anchors the forest\u2019s upper layer, hosting epiphytes and sheltering the understory below.', historicalChange: 'Canopy width has held steady, though neighboring trees at the reserve edge have been thinned by logging.', connection: { chain: ['Canopy Tree', 'Insects', 'Birds', 'Predators', 'Decomposition'] }, trophicRole: 'producer', habitat: 'Rainforest upper canopy', environmentalPressures: ['Selective logging at the reserve edge', 'Reduced humidity from canopy gaps nearby'] },
    { id: 'tropical-canopy-2', kind: 'canopyTree', variant: 'broadleaf', biodiversityCategory: 'plants', name: 'Strangler Fig', position: [3, 0, -4], presentInYears: [1995, 2005, 2015, 2026, 2050, 2075], description: 'A strangler fig with a wide, layered canopy near the waterfall pool.', ecologicalRole: 'Produces fruit relied on by birds and monkeys, and its dense canopy holds moisture over the pool below.', historicalChange: 'Fruit production has remained steady, but neighboring canopy loss has left it more exposed to wind.', trophicRole: 'producer', habitat: 'Canopy near the waterfall pool', environmentalPressures: ['Increased wind exposure from nearby canopy gaps', 'Warmer, drier dry seasons'] },
    { id: 'tropical-canopy-3', kind: 'canopyTree', variant: 'broadleaf', biodiversityCategory: 'plants', name: 'Ceiba Tree', position: [-6, 0, 3], presentInYears: [1995, 2005, 2015, 2026], description: 'A ceiba tree at the reserve\u2019s western edge, closest to the logging boundary.', ecologicalRole: 'One of the tallest trees in this stretch of forest, providing nesting sites high above the understory.', historicalChange: 'Lost by 2050 under the continue-as-is scenario as logging reaches the western boundary.', trophicRole: 'producer', habitat: 'Western reserve-edge canopy', environmentalPressures: ['Encroaching logging boundary', 'Habitat loss by 2050'] },
    { id: 'tropical-vine-1', kind: 'vine', biodiversityCategory: 'plants', name: 'Liana Vine Cluster', position: [-4, 0, -2.6], presentInYears: [1995, 2005, 2015, 2026, 2050, 2075], description: 'A cluster of liana vines draping down from the kapok tree\u2019s lower branches.', ecologicalRole: 'Provides aerial pathways for monkeys and shelter for climbing insects and frogs.', historicalChange: 'Cover has thinned slightly as the humidity beneath the canopy has dropped.', trophicRole: 'producer', habitat: 'Hanging from canopy-tree branches', environmentalPressures: ['Declining understory humidity', 'Canopy gaps reducing moisture retention'] },
    { id: 'tropical-vine-2', kind: 'vine', biodiversityCategory: 'plants', name: 'Liana Vine Cluster', position: [3.2, 0, -3.6], presentInYears: [1995, 2005, 2015, 2026, 2050, 2075], description: 'Vines trailing from the strangler fig down toward the waterfall pool.', ecologicalRole: 'Anchors moisture-loving epiphytes and gives tree frogs a route between canopy and water.', historicalChange: 'Remains present in every simulated year, though individual strands have become sparser.', trophicRole: 'producer', habitat: 'Draping from fig canopy toward the pool', environmentalPressures: ['Weaker dry-season waterfall flow', 'Reduced ambient humidity'] },
    { id: 'tropical-flower-1', kind: 'tropicalFlower', biodiversityCategory: 'pollinators', name: 'Heliconia Cluster', position: [-1.5, 0, 1.5], presentInYears: [1995, 2005, 2015, 2026, 2050, 2075], description: 'A vivid cluster of heliconia blooms at the forest floor\u2019s edge.', ecologicalRole: 'A key nectar source for hummingbirds and butterflies moving through the understory.', historicalChange: 'Bloom density has held steady, though pollinator visits have become less frequent as forest edges have opened.', connection: { chain: ['Flower', 'Pollinator', 'Fruit/Seeds', 'Small mammals'] }, trophicRole: 'producer', habitat: 'Sunlit understory clearing edge', environmentalPressures: ['Reduced pollinator visitation', 'Understory drying near canopy gaps'] },
    { id: 'tropical-flower-2', kind: 'tropicalFlower', biodiversityCategory: 'pollinators', name: 'Passionflower Patch', position: [2, 0, 2.5], presentInYears: [1995, 2005, 2015, 2026, 2050, 2075], description: 'A bright patch of passionflowers climbing low shrubs near the waterfall pool.', ecologicalRole: 'Supports butterfly larvae and provides nectar for pollinating insects.', historicalChange: 'Remains present throughout, a resilient patch even as surrounding cover has thinned.', trophicRole: 'producer', habitat: 'Low shrubs near the waterfall pool', environmentalPressures: ['Thinning surrounding shade cover'] },
    { id: 'tropical-waterfall-1', kind: 'waterfall', biodiversityCategory: 'water', name: 'Esmeralda Falls', position: [0, 0, -6], presentInYears: [1995, 2005, 2015, 2026, 2050, 2075], description: 'A year-round waterfall cascading into a clear pool at the heart of the reserve.', ecologicalRole: 'Feeds the reserve\u2019s streams and pools, sustaining amphibians, birds, and the humid microclimate the canopy depends on.', historicalChange: 'Dry-season flow has weakened as upstream canopy loss has reduced water retention in the watershed.', featureRadius: 7, trophicRole: 'producer', habitat: 'Forest waterfall and pool', environmentalPressures: ['Upstream canopy loss reducing water retention', 'Weaker dry-season flow'] },
    { id: 'tropical-toucan-1', kind: 'bird', biodiversityCategory: 'birds', name: 'Keel-billed Toucan', position: [-2, 5, -4], presentInYears: [1995, 2005, 2015, 2026, 2050, 2075], description: 'A toucan moving between canopy trees, its bright bill visible above the understory.', ecologicalRole: 'A key seed disperser â€” its diet of canopy fruit spreads tree seeds across the reserve.', historicalChange: 'Sightings have become less frequent near the logging boundary as fruiting trees there have thinned.', connection: { chain: ['Fruit', 'Toucan', 'Seed dispersal', 'Forest regeneration'] }, trophicRole: 'secondary-consumer', habitat: 'Rainforest canopy and upper understory', diet: 'Fruit, insects, and small lizards', environmentalPressures: ['Loss of fruiting canopy trees near the boundary', 'Habitat fragmentation'] },
    { id: 'tropical-treefrog-1', kind: 'frog', biodiversityCategory: 'wildlife', name: 'Red-eyed Tree Frog', position: [1, 0, -5], presentInYears: [1995, 2005, 2015, 2026, 2050, 2075], description: 'A tree frog resting on broad leaves near the waterfall pool.', ecologicalRole: 'An indicator species highly sensitive to humidity and water quality changes in the forest.', historicalChange: 'Populations near the pool have held on better than elsewhere in the reserve, thanks to the waterfall\u2019s continued moisture.', trophicRole: 'secondary-consumer', habitat: 'Broadleaf vegetation near the waterfall pool', diet: 'Insects and other small invertebrates', environmentalPressures: ['Sensitivity to declining humidity', 'Water quality changes upstream'] },
    { id: 'tropical-monkey-1', kind: 'animal', biodiversityCategory: 'wildlife', name: 'Howler Monkey', position: [-3, 0, 4], presentInYears: [1995, 2005, 2015, 2026], description: 'A howler monkey troop moving through the mid-canopy, their calls audible across the reserve.', ecologicalRole: 'Disperses seeds across long distances and helps regulate canopy leaf growth through browsing.', historicalChange: 'Troop range has contracted as logging has fragmented the canopy pathways they travel; absent from the degraded 2050 scenario.', trophicRole: 'primary-consumer', habitat: 'Mid-to-upper canopy travel routes', diet: 'Leaves, fruit, and flowers', environmentalPressures: ['Canopy fragmentation limiting travel routes', 'Loss of connected canopy cover'] },
    { id: 'tropical-pollinator-1', kind: 'pollinator', variant: 'butterfly', biodiversityCategory: 'pollinators', name: 'Blue Morpho Butterfly', position: [-1.5, 0.4, 1.8], presentInYears: [1995, 2005, 2015, 2026, 2050, 2075], description: 'A blue morpho butterfly drifting between heliconia blooms at the forest floor\u2019s edge.', ecologicalRole: 'Pollinates understory flowers and serves as a food source for insectivorous birds and frogs.', historicalChange: 'Sightings have thinned slightly as canopy gaps have dried the understory it depends on.', connection: { chain: ['Flower', 'Butterfly', 'Pollination', 'Fruit production'] }, trophicRole: 'primary-consumer', habitat: 'Sunlit understory near flowering plants', diet: 'Flower nectar and rotting fruit', environmentalPressures: ['Drier understory conditions near canopy gaps', 'Declining flower density at forest edges'] },
    { id: 'tropical-canopy-4', kind: 'canopyTree', variant: 'broadleaf', biodiversityCategory: 'plants', name: 'Cecropia Tree', position: [5, 0, 2], presentInYears: [1995, 2005, 2015, 2026, 2050, 2075], description: 'A fast-growing cecropia tree filling a gap in the eastern canopy.', ecologicalRole: 'Its open, umbrella-like canopy is among the first to colonize light gaps, giving climbing vines an early foothold.', historicalChange: 'Has spread further into gaps opened by logging, though it cannot fully replace the mature canopy it fills in for.', trophicRole: 'producer', habitat: 'Canopy gap on the eastern side of the reserve', environmentalPressures: ['Expanding canopy gaps from logging', 'Increased sun exposure at gap edges'] },
    { id: 'tropical-vine-3', kind: 'vine', biodiversityCategory: 'plants', name: 'Liana Vine Cluster', position: [5.4, 0, 2.6], presentInYears: [1995, 2005, 2015, 2026, 2050, 2075], description: 'Vines climbing the cecropia tree toward the light of the canopy gap.', ecologicalRole: 'Knits neighboring canopy trees together, giving monkeys and climbing insects a continuous route overhead.', historicalChange: 'Has grown denser here as the canopy gap has widened, though this is a sign of disturbance rather than recovery.', trophicRole: 'producer', habitat: 'Climbing the canopy-gap tree line', environmentalPressures: ['Canopy gap expansion', 'Increased light favoring fast vine growth over slower canopy regrowth'] },
    { id: 'tropical-vine-4', kind: 'vine', biodiversityCategory: 'plants', name: 'Liana Vine Cluster', position: [-6.4, 0, 3.6], presentInYears: [1995, 2005, 2015, 2026, 2050, 2075], description: 'A dense tangle of vines along the reserve\u2019s western edge, closest to the logging boundary.', ecologicalRole: 'Provides emergency cover for understory wildlife displaced from thinning canopy nearby.', historicalChange: 'Remains present through every simulated year, even as the ceiba tree it once climbed was lost to logging.', trophicRole: 'producer', habitat: 'Western reserve-edge understory', environmentalPressures: ['Loss of supporting canopy trees nearby', 'Encroaching logging boundary'] },
    { id: 'tropical-fern-1', kind: 'fern', biodiversityCategory: 'plants', name: 'Giant Bird\u2019s-Nest Fern', position: [-2, 0, 4], presentInYears: [1995, 2005, 2015, 2026, 2050, 2075], description: 'A giant bird\u2019s-nest fern anchored low on a tree trunk in the dense forest-floor understory.', ecologicalRole: 'Its cupped fronds collect leaf litter and rainwater, creating a microhabitat for insects and tree frogs.', historicalChange: 'Has held on well compared to more exposed understory plants, sheltered by the surrounding canopy.', trophicRole: 'producer', habitat: 'Forest-floor understory, low on tree trunks', environmentalPressures: ['Drying understory near canopy gaps'] },
    { id: 'tropical-moss-1', kind: 'moss', biodiversityCategory: 'plants', name: 'Epiphytic Moss Mat', position: [4, 0, 5], presentInYears: [1995, 2005, 2015, 2026, 2050, 2075], description: 'A thick mat of moss carpeting fallen branches on the humid forest floor.', ecologicalRole: 'Retains moisture at ground level and hosts invertebrates that feed the forest\u2019s smaller wildlife.', historicalChange: 'Cover has thinned slightly as the understory has dried with reduced canopy shade nearby.', trophicRole: 'producer', habitat: 'Humid forest floor and fallen branches', environmentalPressures: ['Drying forest floor from canopy loss', 'Reduced humidity at ground level'] },
    { id: 'tropical-log-1', kind: 'log', biodiversityCategory: 'fungi', name: 'Fallen Kapok Limb', position: [-5, 0, -1], presentInYears: [1995, 2005, 2015, 2026, 2050, 2075], description: 'A fallen kapok limb decomposing on the forest floor, host to mushrooms and forest-floor insects.', ecologicalRole: 'Recycles nutrients back into the soil and provides shelter for ground-dwelling invertebrates and small amphibians.', historicalChange: 'Has remained in place and steadily decomposing throughout the simulated period.', connection: { chain: ['Fallen tree', 'Fungi', 'Decomposition', 'Soil nutrients'] }, trophicRole: 'decomposer', habitat: 'Decomposing deadwood on the forest floor', environmentalPressures: ['Fewer new fallen limbs as canopy trees are removed nearby'] },
    { id: 'tropical-fungi-1', kind: 'fungi', biodiversityCategory: 'fungi', name: 'Bracket Fungi Cluster', position: [-5.3, 0, -0.7], presentInYears: [1995, 2005, 2015, 2026, 2050, 2075], description: 'A cluster of bracket fungi breaking down the fallen kapok limb beside it.', ecologicalRole: 'Fungi recycle deadwood into soil nutrients and form symbiotic networks with the surrounding canopy roots.', historicalChange: 'Fungal diversity here tracks closely with deadwood availability, holding steady as this limb continues to decompose.', trophicRole: 'decomposer', habitat: 'Decomposing deadwood on the forest floor', environmentalPressures: ['Fewer fallen limbs as canopy trees are removed nearby'] },
    { id: 'tropical-bird-2', kind: 'bird', biodiversityCategory: 'birds', name: 'Scarlet Macaw', position: [4, 4.5, 1], presentInYears: [1995, 2005, 2015, 2026, 2050, 2075], description: 'A scarlet macaw pair moving between fruiting trees in the eastern canopy.', ecologicalRole: 'Disperses large seeds that many smaller birds cannot carry, helping regenerate canopy-gap trees.', historicalChange: 'Pairs have become harder to spot as fruiting trees near the logging boundary have thinned.', trophicRole: 'secondary-consumer', habitat: 'Rainforest canopy near fruiting trees', diet: 'Fruit, nuts, and seeds', environmentalPressures: ['Loss of fruiting canopy trees', 'Habitat fragmentation near the logging boundary'] },
    { id: 'tropical-frog-2', kind: 'frog', biodiversityCategory: 'wildlife', name: 'Poison Dart Frog', position: [-1, 0, -4.5], presentInYears: [1995, 2005, 2015, 2026, 2050, 2075], description: 'A brightly colored poison dart frog moving through leaf litter near the waterfall pool.', ecologicalRole: 'Preys on small forest-floor insects and, like the tree frog nearby, signals the humidity and water quality of its surroundings.', historicalChange: 'Has persisted near the pool\u2019s continued moisture even as drier patches elsewhere in the reserve have lost frog populations.', trophicRole: 'secondary-consumer', habitat: 'Leaf litter near the waterfall pool', diet: 'Ants, mites, and other small invertebrates', environmentalPressures: ['Sensitivity to declining humidity', 'Water quality changes upstream'] },
    { id: 'tropical-flower-3', kind: 'tropicalFlower', biodiversityCategory: 'pollinators', name: 'Bird-of-Paradise Cluster', position: [0, 0, 4], presentInYears: [1995, 2005, 2015, 2026, 2050, 2075], description: 'A cluster of bird-of-paradise flowers growing in a sunlit gap near the forest floor.', ecologicalRole: 'Provides nectar for hummingbirds and butterflies moving between the understory and forest floor.', historicalChange: 'Bloom density has held steady, sheltered from the drying effects felt closer to the logging boundary.', trophicRole: 'producer', habitat: 'Sunlit forest-floor clearing', environmentalPressures: ['Drying conditions expanding from nearby canopy gaps'] },

    // ---------------- Additional density backfill: keep Tropical Forest denser than Temperate Forest (Requirement 1.5) ----------------
    { id: 'tropical-epiphyte-1', kind: 'moss', biodiversityCategory: 'plants', name: 'Orchid Epiphyte Mat', position: [-3.5, 0, -5.5], presentInYears: [1995, 2005, 2015, 2026, 2050, 2075], description: 'A dense mat of epiphytic orchids and moss clinging to a low branch near the kapok tree.', ecologicalRole: 'Draws moisture and nutrients from the humid air rather than the soil, and its flowers feed hovering pollinators unable to reach the canopy above.', historicalChange: 'Cover has thinned slightly as ambient humidity has dropped alongside canopy loss nearby.', trophicRole: 'producer', habitat: 'Low branches near the kapok tree', environmentalPressures: ['Declining ambient humidity', 'Canopy loss reducing moisture retention'] },
    { id: 'tropical-fern-2', kind: 'fern', biodiversityCategory: 'plants', name: 'Tree Fern Cluster', position: [4.5, 0, 5.5], presentInYears: [1995, 2005, 2015, 2026, 2050, 2075], description: 'A cluster of tall tree ferns unfurling new fronds near the eastern canopy gap.', ecologicalRole: 'Its broad fronds catch falling leaf litter and shelter ground insects that feed the forest\u2019s smaller wildlife.', historicalChange: 'Has spread into the light reaching through the nearby canopy gap, though this growth reflects disturbance rather than recovery.', trophicRole: 'producer', habitat: 'Forest floor near the eastern canopy gap', environmentalPressures: ['Canopy gap expansion altering light levels', 'Drying understory nearby'] },
    { id: 'tropical-log-2', kind: 'log', biodiversityCategory: 'fungi', name: 'Fallen Ceiba Limb', position: [-6.5, 0, 2.4], presentInYears: [1995, 2005, 2015, 2026, 2050, 2075], description: 'A limb from the lost ceiba tree, left decomposing near the western reserve edge.', ecologicalRole: 'Recycles scarce nutrients back into the thin forest-edge soil and shelters ground-dwelling invertebrates displaced by nearby logging.', historicalChange: 'Has remained in place and continued decomposing throughout the simulated period, even after the tree it fell from was lost.', connection: { chain: ['Fallen tree', 'Fungi', 'Decomposition', 'Soil nutrients'] }, trophicRole: 'decomposer', habitat: 'Decomposing deadwood near the western reserve edge', environmentalPressures: ['Fewer new fallen limbs as canopy trees are removed nearby'] },
    { id: 'tropical-fungi-2', kind: 'fungi', biodiversityCategory: 'fungi', name: 'Luminous Mushroom Cluster', position: [-6.8, 0, 2.7], presentInYears: [1995, 2005, 2015, 2026, 2050, 2075], description: 'A cluster of pale, faintly luminous mushrooms fruiting from the fallen ceiba limb beside it.', ecologicalRole: 'Breaks down deadwood in tandem with the limb it grows on, releasing nutrients back into the forest-edge soil.', historicalChange: 'Fungal diversity here has held steady, tracking closely with the deadwood availability it depends on.', trophicRole: 'decomposer', habitat: 'Decomposing deadwood near the western reserve edge', environmentalPressures: ['Fewer fallen limbs as canopy trees are removed nearby'] },
    { id: 'tropical-insect-1', kind: 'pollinator', biodiversityCategory: 'pollinators', name: 'Leafcutter Ant Trail', position: [1.8, 0.1, -1.2], presentInYears: [1995, 2005, 2015, 2026, 2050, 2075], description: 'A steady trail of leafcutter ants carrying fragments of leaf back toward an underground nest near the heliconia cluster.', ecologicalRole: 'Its foraging recycles enormous volumes of leaf matter into fungal gardens underground, one of the forest floor\u2019s most active nutrient cyclers.', historicalChange: 'Trail activity has remained steady, though foraging routes have shortened as nearby canopy cover has thinned.', trophicRole: 'primary-consumer', habitat: 'Forest floor near the heliconia cluster', diet: 'Leaf fragments, cultivated for an underground fungal garden', environmentalPressures: ['Shortened foraging routes from canopy loss', 'Drying leaf litter near forest edges'] },
    { id: 'tropical-bird-3', kind: 'bird', biodiversityCategory: 'birds', name: 'Resplendent Quetzal', position: [2.5, 5.2, -5], presentInYears: [1995, 2005, 2015, 2026, 2050, 2075], description: 'A resplendent quetzal perched near the waterfall pool, its long tail feathers trailing beneath the canopy.', ecologicalRole: 'Feeds on wild avocado and other canopy fruit, dispersing seeds across the reserve as it moves between fruiting trees.', historicalChange: 'Sightings have grown less frequent as the mature, fruit-bearing canopy trees it depends on have thinned near the boundary.', trophicRole: 'secondary-consumer', habitat: 'Mature rainforest canopy near water', diet: 'Wild avocado, other canopy fruit, and insects', environmentalPressures: ['Loss of mature fruiting canopy trees', 'Habitat fragmentation'] },
    { id: 'tropical-frog-3', kind: 'frog', biodiversityCategory: 'wildlife', name: 'Glass Frog', position: [0.6, 0, -6.4], presentInYears: [1995, 2005, 2015, 2026, 2050, 2075], description: 'A translucent-skinned glass frog clinging to a leaf directly over the waterfall pool.', ecologicalRole: 'An amphibian highly sensitive to water quality, breeding only where the pool stays consistently clear and cool.', historicalChange: 'Has persisted at the pool\u2019s edge thanks to the waterfall\u2019s continued moisture, even as drier stretches elsewhere have lost frog populations.', trophicRole: 'secondary-consumer', habitat: 'Leaves directly overhanging the waterfall pool', diet: 'Small insects and other invertebrates', environmentalPressures: ['Sensitivity to water quality changes upstream', 'Declining humidity at the reserve\u2019s edges'] },
    { id: 'tropical-rock-1', kind: 'rock', variant: 'slab', biodiversityCategory: null, name: 'Falls-Side Slab', position: [1.2, 0.3, -6.8], presentInYears: [1995, 2005, 2015, 2026, 2050, 2075], description: 'A flat, moss-slicked slab of stone at the edge of the waterfall pool, kept perpetually damp by the spray.', ecologicalRole: 'Its wet surface hosts algae and moss that graze-feeding tadpoles and insects depend on.', historicalChange: 'Unchanged in shape across the simulated years, though its moss cover has thinned slightly with the weaker dry-season flow.' },
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
