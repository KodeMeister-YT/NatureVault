import type { VaultDefinition } from '../../types/vault';

export const evergreenValleyVault: VaultDefinition = {
  ecosystemId: 'evergreen-valley',
  name: 'Evergreen Valley',
  location: 'Oregon, Pacific Northwest',
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
        'A continuous forest canopy covers the valley. The river runs high and clear, and wildlife moves freely across an unbroken habitat.',
      keyChanges: [
        'Dense, continuous forest canopy',
        'Healthy, high-flow river',
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
        'Roads and scattered development have fragmented the forest. The river runs lower, and wildlife habitat has become patchier.',
      keyChanges: [
        'Reduced forest coverage',
        'Expanded roads and a small settlement',
        'Reduced river water level',
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
    },
    {
      id: 'tree-cedar-1',
      kind: 'tree',
      biodiversityCategory: 'plants',
      name: 'Western Red Cedar',
      position: [4, 0, -7],
      presentInYears: [1995, 2026],
      description: 'A large cedar near the riverbank, thriving in the moist soil close to water.',
      ecologicalRole:
        'Cedars near waterways help stabilize banks and provide shade that keeps river temperatures cool for aquatic life.',
      historicalChange:
        'This cedar and others near the bank were among the first lost as development reached the river corridor.',
    },
    {
      id: 'river-main',
      kind: 'river',
      biodiversityCategory: 'water',
      name: 'Evergreen River',
      position: [0, 0, 0],
      presentInYears: [1995, 2026, 2050],
      description:
        'The river that runs the length of the valley, feeding the pond and surrounding wetland soil.',
      ecologicalRole: 'Supports aquatic organisms and surrounding ecosystems.',
      historicalChange:
        'Water level and flow have decreased over the simulated period due to development, runoff, and changing precipitation.',
      relatedSpecies: ['Coho Salmon', 'River Otter'],
    },
    {
      id: 'pond-1',
      kind: 'pond',
      biodiversityCategory: 'water',
      name: 'Willow Pond',
      position: [7, 0, 6],
      presentInYears: [1995, 2026, 2050],
      description: 'A small pond fed by the river, ringed with willows and reeds.',
      ecologicalRole:
        'Provides still water habitat for amphibians and insects, and a drinking source for wildlife.',
      historicalChange:
        'The pond has shrunk in the simulated 2026 and 2050 states as the water table has dropped.',
      relatedSpecies: ['Pacific Chorus Frog'],
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
      description: 'A small structure built along the ridge overlooking the river.',
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
      title: 'The River',
      year: 1995,
      narration:
        'Water flow and surrounding vegetation shape the ecosystem. The Evergreen River ran high, feeding the pond and keeping the soil rich with moisture.',
      focusObjectId: 'river-main',
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
