import type { BiomeDefinition } from '../../types/vault';

export const evergreenValleyVault: BiomeDefinition = {
  ecosystemId: 'evergreen-valley',
  name: 'Evergreen Valley',
  location: 'Oregon, Pacific Northwest',
  terrain: {
    kind: 'rolling-hills',
    // Deep conifer-forest green / mossy understory palette, tuned to read as a lush
    // temperate forest — distinct from coastalWetland's duller marsh-and-mud tones
    // (#4c5a3a/#8a7d47/#3a3226) and desert's warm sand palette (#c9a877/#a9855a).
    palette: { primary: '#294f2a', secondary: '#5c6b3e', shoreline: '#3f3626', developed: '#585449' },
  },
  water: { kind: 'creek-stream', deepColor: '#2b5866', shallowColor: '#5f9aa0' },
  atmosphere: {
    skyTreatment: 'sky-and-clouds',
    // Dappled canopy light: warm green-gold sun filtered through fir/cedar cover,
    // rather than the open coastal-haze light of coastalWetland or the harsh bright
    // sun of desert.
    sun: { color: '#d8e8a0', intensity: 2.0, position: [10, 16, 8] },
    ambient: { color: '#a8c9a0', intensity: 0.4 },
    hemisphere: { skyColor: '#9fc2b0', groundColor: '#2f4a28', intensity: 0.55 },
    // Denser, cooler, greener near-fog than any other authored biome — reflects a
    // shaded forest floor rather than open coastal haze (coastalWetland: #c9d6d2/10/38)
    // or clear dry desert air (desert: #f0e0b8/30/85).
    fog: { color: '#3a4a36', near: 12, far: 40 },
  },
  // Forest-approach, eye-level vantage looking down a gentle slope toward the creek.
  cameraDefaults: { position: [0, 1.6, 8], target: [0, 1.4, -3], fov: 56, minDistance: 2.5, maxDistance: 30, maxPolarAngle: Math.PI / 2.05 },
  style: { entries: [] },
  years: [
    {
      year: 1995,
      label: '1995',
      metrics: {
        vegetationDensity: 0.95,
        waterLevel: 0.9,
        biodiversityLevel: 0.9,
        developmentLevel: 0.05,
      },
      summary:
        'A continuous forest canopy covers the valley. Fernbrook Creek runs high and clear, and wildlife moves freely across an unbroken habitat.',
      keyChanges: [
        'Dense, continuous forest canopy',
        'Healthy, high-flow creek',
        'Minimal human infrastructure',
        'Abundant wildlife corridors',
      ],
    },
    {
      year: 2026,
      label: '2026',
      metrics: {
        vegetationDensity: 0.62,
        waterLevel: 0.6,
        biodiversityLevel: 0.55,
        developmentLevel: 0.45,
      },
      summary:
        'Roads and scattered development have fragmented the forest. The creek runs lower, and wildlife habitat has become patchier.',
      keyChanges: [
        'Reduced forest coverage',
        'Expanded roads and a small settlement',
        'Reduced creek water level',
        'Fragmented wildlife habitat',
      ],
    },
    {
      year: 2050,
      label: '2050',
      metrics: {
        vegetationDensity: 0.4,
        waterLevel: 0.4,
        biodiversityLevel: 0.3,
        developmentLevel: 0.7,
      },
      summary:
        'Under a "continue as is" scenario, the valley could see continued habitat loss and lower water availability. Under "protect & restore," it could recover most of its historical character.',
      keyChanges: [
        'Outcome depends on the chosen scenario',
        'Illustrative — not a scientific forecast',
      ],
    },
  ],
  objects: [
    {
      id: 'tree-douglas-fir-1',
      kind: 'tree',
      biodiversityCategory: 'plants',
      name: 'Douglas Fir',
      position: [-6, 0, -4],
      presentInYears: [1995, 2026, 2050],
      description:
        'A mature Douglas fir standing near the forest edge, one of the dominant conifer species in this valley.',
      ecologicalRole:
        'Provides habitat and contributes to forest structure. Its canopy moderates temperature and light reaching the forest floor.',
      historicalChange:
        'Tree cover in this area has declined in the simulated scenario as roads and development expanded through the mid-2020s.',
      relatedSpecies: ['Northern Spotted Owl', 'Douglas Squirrel'],
      connection: { chain: ['Forest', 'Bird habitat', 'Seed dispersal', 'Plant regeneration'] },
      trophicRole: 'producer',
      habitat: 'Mature conifer forest edge',
      environmentalPressures: ['Canopy loss from nearby road construction', 'Fragmentation from development'],
    },
    {
      id: 'tree-douglas-fir-2',
      kind: 'tree',
      biodiversityCategory: 'plants',
      name: 'Douglas Fir',
      position: [-9, 0, 3],
      presentInYears: [1995, 2026, 2050],
      description: 'A stand of conifers along the western ridge of the valley.',
      ecologicalRole:
        'Stores carbon, stabilizes soil on the slope, and supports a range of understory plants.',
      historicalChange:
        'This stand has thinned over time as the surrounding canopy has opened up.',
      relatedSpecies: ['Douglas Squirrel'],
      trophicRole: 'producer',
      habitat: 'Western ridge conifer stand',
      environmentalPressures: ['Canopy thinning', 'Soil destabilization on the slope'],
    },
    {
      id: 'tree-cedar-1',
      kind: 'tree',
      biodiversityCategory: 'plants',
      name: 'Western Red Cedar',
      position: [4, 0, -7],
      presentInYears: [1995, 2026],
      description: 'A large cedar near the creek bank, thriving in the moist soil close to water.',
      ecologicalRole:
        'Cedars near waterways help stabilize banks and provide shade that keeps creek temperatures cool for aquatic life.',
      historicalChange:
        'This cedar and others near the bank were among the first lost as development reached the creek corridor.',
      trophicRole: 'producer',
      habitat: 'Moist soil along the creek bank',
      environmentalPressures: ['Bank clearing from development', 'Loss of streamside shade'],
    },
    {
      id: 'creek-main',
      kind: 'creek',
      biodiversityCategory: 'water',
      name: 'Fernbrook Creek',
      position: [0, 0, 0],
      presentInYears: [1995, 2026, 2050],
      description:
        'A narrow, gently meandering stream that runs the length of the valley, feeding the pond and keeping the surrounding forest floor moist.',
      ecologicalRole: 'Supports aquatic organisms and surrounding ecosystems.',
      historicalChange:
        'Flow has decreased over the simulated period due to development, runoff, and changing precipitation.',
      relatedSpecies: ['Coho Salmon', 'River Otter'],
      featureRadius: 9,
      habitat: 'Shaded forest stream channel',
      environmentalPressures: ['Reduced flow from upstream development', 'Warmer water from lost streamside shade'],
    },
    {
      id: 'pond-1',
      kind: 'pond',
      biodiversityCategory: 'water',
      name: 'Willow Pond',
      position: [7, 0, 6],
      presentInYears: [1995, 2026, 2050],
      description: 'A small pond fed by the creek, ringed with willows and reeds.',
      ecologicalRole:
        'Provides still water habitat for amphibians and insects, and a drinking source for wildlife.',
      historicalChange:
        'The pond has shrunk in the simulated 2026 and 2050 states as the water table has dropped.',
      relatedSpecies: ['Pacific Chorus Frog'],
      habitat: 'Willow-ringed forest pond',
      environmentalPressures: ['Dropping water table', 'Reduced inflow from the creek'],
    },
    {
      id: 'meadow-flowers-1',
      kind: 'plant',
      biodiversityCategory: 'pollinators',
      name: 'Wildflower Meadow',
      position: [3, 0, 8],
      presentInYears: [1995, 2026, 2050],
      description: 'A sunlit meadow of wildflowers that draws bees and butterflies through summer.',
      ecologicalRole:
        'Supports pollinator populations that are essential to plant reproduction across the wider valley.',
      historicalChange:
        'The meadow has stayed relatively stable, but pollinator diversity has decreased alongside surrounding habitat loss.',
      relatedSpecies: ['Western Bumblebee'],
      connection: { chain: ['Flower', 'Bee', 'Pollination', 'Plant reproduction', 'Food web'] },
      trophicRole: 'producer',
      habitat: 'Sunlit forest-edge meadow clearing',
      environmentalPressures: ['Declining pollinator diversity', 'Habitat loss at the meadow edge'],
    },
    {
      id: 'fern-1',
      kind: 'fern',
      biodiversityCategory: 'plants',
      name: 'Sword Fern Cluster',
      position: [-4, 0, -1],
      presentInYears: [1995, 2026, 2050],
      description: 'A spreading cluster of sword ferns carpeting the shaded forest floor beneath the conifers.',
      ecologicalRole:
        'Holds moisture in the topsoil and provides cover for ground-dwelling insects and small amphibians.',
      historicalChange:
        'Fern cover has thinned somewhat as the canopy above has opened up, exposing the floor to more direct sun.',
      trophicRole: 'producer',
      habitat: 'Shaded understory beneath the conifer canopy',
      environmentalPressures: ['Increased sun exposure from canopy loss', 'Soil drying at the forest edge'],
    },
    {
      id: 'fern-2',
      kind: 'fern',
      biodiversityCategory: 'plants',
      name: 'Sword Fern Cluster',
      position: [2, 0, -5],
      presentInYears: [1995, 2026, 2050],
      description: 'A second fern cluster growing along the damp bank just above Fernbrook Creek.',
      ecologicalRole: 'Filters runoff before it reaches the creek and stabilizes the loose bank soil.',
      historicalChange: 'Remains present in every simulated year, though its extent has shrunk slightly.',
      trophicRole: 'producer',
      habitat: 'Damp streambank above Fernbrook Creek',
      environmentalPressures: ['Bank erosion', 'Reduced soil moisture as creek flow has dropped'],
    },
    {
      id: 'moss-1',
      kind: 'moss',
      biodiversityCategory: 'plants',
      name: 'Moss Carpet',
      position: [-8, 0, -1],
      presentInYears: [1995, 2026, 2050],
      description: 'A soft carpet of moss covering fallen branches and stones on the forest floor.',
      ecologicalRole:
        'Retains moisture at the soil surface and provides habitat for tiny invertebrates that feed the wider food web.',
      historicalChange:
        'Moss cover has declined slightly as the forest floor has dried out with reduced canopy shade.',
      trophicRole: 'producer',
      habitat: 'Damp, shaded forest floor',
      environmentalPressures: ['Drying forest floor from canopy loss', 'Reduced humidity at ground level'],
    },
    {
      id: 'moss-2',
      kind: 'moss',
      biodiversityCategory: 'plants',
      name: 'Moss Carpet',
      position: [5, 0, -2],
      presentInYears: [1995, 2026, 2050],
      description: 'Moss growing thick on the north-facing side of the western ridge, out of direct sun.',
      ecologicalRole: 'Cushions rainfall impact on bare soil, reducing erosion on the slope.',
      historicalChange: 'Stable through the simulated period, favored by its shaded north-facing position.',
      trophicRole: 'producer',
      habitat: 'Shaded north-facing slope',
      environmentalPressures: ['Erosion on the surrounding slope', 'Gradual canopy thinning nearby'],
    },
    {
      id: 'log-1',
      kind: 'log',
      biodiversityCategory: 'fungi',
      name: 'Fallen Cedar Log',
      position: [-3, 0, 2],
      presentInYears: [1995, 2026, 2050],
      description:
        'A fallen cedar trunk slowly decomposing on the forest floor, framed here as decomposer habitat rather than scenery — its bark hosts the fungi patch nearby and shelters ground-dwelling invertebrates.',
      ecologicalRole:
        'Decomposing wood recycles nutrients back into the soil and provides structure and moisture for fungi and invertebrates.',
      historicalChange:
        'This log has been present and steadily decomposing throughout the simulated period.',
      connection: { chain: ['Fallen tree', 'Decomposers', 'Nutrient cycling', 'Soil health'] },
      trophicRole: 'decomposer',
      habitat: 'Decomposing deadwood on the forest floor',
      environmentalPressures: ['Fewer new fallen logs as mature trees are removed', 'Drier deadwood from reduced canopy shade'],
    },
    {
      id: 'bird-spotted-owl',
      kind: 'bird',
      biodiversityCategory: 'birds',
      name: 'Northern Spotted Owl',
      position: [-5, 3, -2],
      presentInYears: [1995, 2026],
      description: 'A nocturnal owl that depends on mature, dense forest structure.',
      ecologicalRole:
        'An indicator species — its presence signals a healthy, mature forest ecosystem.',
      historicalChange:
        'Changes in forest structure can affect available habitat. Its range in this valley has narrowed in the simulation.',
      relatedSpecies: ['Douglas Fir'],
      trophicRole: 'secondary-consumer',
      habitat: 'Mature, dense conifer forest',
      diet: 'Flying squirrels, woodrats, and other small mammals',
      environmentalPressures: ['Loss of mature forest structure', 'Habitat fragmentation'],
    },
    {
      id: 'bird-flock-1',
      kind: 'bird',
      biodiversityCategory: 'birds',
      name: "Steller's Jay",
      position: [2, 4, -3],
      presentInYears: [1995, 2026, 2050],
      description: 'A vividly colored jay commonly seen moving between forest and meadow edges.',
      ecologicalRole: 'Disperses seeds and preys on insects, helping regulate forest edge habitats.',
      historicalChange: 'Remains common across all simulated years, adapting well to forest edges.',
      trophicRole: 'secondary-consumer',
      habitat: 'Forest and meadow edges',
      diet: 'Insects, seeds, and occasionally small vertebrates or eggs',
      environmentalPressures: ['Changing forest-edge structure as development expands'],
    },
    {
      id: 'animal-deer-1',
      kind: 'animal',
      biodiversityCategory: 'wildlife',
      name: 'Black-tailed Deer',
      position: [-2, 0, 5],
      presentInYears: [1995, 2026, 2050],
      description: 'A deer grazing at the edge of the meadow, common throughout the valley.',
      ecologicalRole: 'Grazing shapes meadow and understory vegetation patterns.',
      historicalChange:
        'Deer have adapted to fragmented habitat, though safe movement corridors have narrowed.',
      trophicRole: 'primary-consumer',
      habitat: 'Meadow edges and forest understory',
      diet: 'Grasses, forbs, and shrub browse',
      environmentalPressures: ['Narrowing movement corridors', 'Habitat fragmentation from roads'],
    },
    {
      id: 'fungi-patch-1',
      kind: 'fungi',
      biodiversityCategory: 'fungi',
      name: 'Forest Floor Fungi',
      position: [-7, 0, 0],
      presentInYears: [1995, 2026],
      description: 'A cluster of mushrooms breaking down fallen wood on the forest floor.',
      ecologicalRole:
        'Fungi recycle nutrients back into the soil and form symbiotic networks with tree roots.',
      historicalChange:
        'Fungal diversity tracks closely with old-growth structure, and has declined as mature trees were removed.',
      connection: { chain: ['Fallen wood', 'Fungi', 'Nutrient cycling', 'Soil health', 'Tree growth'] },
      trophicRole: 'decomposer',
      habitat: 'Fallen wood and leaf litter on the forest floor',
      environmentalPressures: ['Loss of old-growth structure', 'Fewer fallen logs as mature trees are removed'],
    },
    {
      id: 'rock-outcrop-1',
      kind: 'rock',
      biodiversityCategory: null,
      name: 'Granite Outcrop',
      position: [-10, 1, -8],
      presentInYears: [1995, 2026, 2050],
      description: 'An exposed rock formation at the base of the western ridge.',
      ecologicalRole: 'Provides shelter for small mammals and a warm surface for reptiles.',
      historicalChange: 'Unchanged by development, this outcrop looks the same across all years.',
    },
    {
      id: 'mountain-backdrop',
      kind: 'mountain',
      biodiversityCategory: null,
      name: 'Cascade Foothills',
      position: [0, 0, -22],
      presentInYears: [1995, 2026, 2050],
      description: 'The mountain range framing the valley, visible from nearly every vantage point.',
      ecologicalRole:
        'Feeds the watershed through snowmelt and shapes local weather and rainfall patterns.',
      historicalChange:
        'Snowpack and treeline on these slopes have shifted gradually with changing regional climate patterns.',
    },
    {
      id: 'road-1',
      kind: 'road',
      biodiversityCategory: null,
      name: 'Valley Access Road',
      position: [5, 0, 2],
      presentInYears: [2026, 2050],
      description: 'A road built through the valley to support the growing settlement.',
      ecologicalRole:
        'Roads fragment habitat, creating barriers that many species avoid crossing.',
      historicalChange:
        "This road didn't exist in 1995. Its construction is one of the main drivers of habitat fragmentation shown in 2026.",
    },
    {
      id: 'building-cabin-1',
      kind: 'building',
      biodiversityCategory: null,
      name: 'Ridge Cabin',
      position: [8, 0, -2],
      presentInYears: [2026, 2050],
      description: 'A small structure built along the ridge overlooking the creek.',
      ecologicalRole:
        'Represents low-density human development and its footprint on surrounding habitat.',
      historicalChange:
        'Development in this area began in the early 2000s and has expanded gradually since.',
    },
    {
      id: 'path-1',
      kind: 'path',
      biodiversityCategory: null,
      name: 'Forest Trail',
      position: [-1, 0, 1],
      presentInYears: [1995, 2026, 2050],
      description: 'A footpath winding through the forest, used by both wildlife and hikers.',
      ecologicalRole: 'Low-impact trails allow human access while minimizing habitat disruption.',
      historicalChange: 'This trail has remained largely unchanged, though its surroundings have not.',
    },
  ],
  storyChapters: [
    {
      id: 'ch1',
      title: 'The Forest',
      year: 1995,
      narration:
        '30 years ago, this valley contained a continuous forest canopy. Douglas fir and cedar stood dense enough to keep the forest floor cool and shaded year-round.',
      focusObjectId: 'tree-douglas-fir-1',
    },
    {
      id: 'ch2',
      title: 'The Creek',
      year: 1995,
      narration:
        'Water flow and surrounding vegetation shape the ecosystem. Fernbrook Creek ran high, feeding the pond and keeping the soil rich with moisture.',
      focusObjectId: 'creek-main',
    },
    {
      id: 'ch3',
      title: 'The Fragmentation',
      year: 2026,
      narration:
        'Roads and development divided habitats. As the valley opened up to access roads and a small settlement, the once-continuous forest broke into disconnected patches.',
      focusObjectId: 'road-1',
    },
    {
      id: 'ch4',
      title: 'The Choice',
      year: 2050,
      narration:
        'What happens next depends on how the environment is managed. From here, two very different futures are possible.',
    },
    {
      id: 'ch5',
      title: 'Two Futures',
      year: 2050,
      narration:
        'Compare "Continue as Is" with "Protect & Restore" to see how different choices could shape the next 25 years of this valley.',
      scenarioId: 'continue-as-is',
    },
  ],
};
