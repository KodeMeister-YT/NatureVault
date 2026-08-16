import type { VaultDefinition } from '../../types/vault';

export const coastalWetlandVault: VaultDefinition = {
  ecosystemId: 'coastal-wetland',
  name: 'Coastal Wetland',
  location: 'Siuslaw Estuary, Oregon Coast',
  terrain: {
    kind: 'rolling-hills',
    palette: { primary: '#3d5a34', secondary: '#6b6a45', shoreline: '#5a4a34', developed: '#54524a' },
  },
  water: { kind: 'pond-marsh', deepColor: '#2b5866', shallowColor: '#5f9aa0' },
  atmosphere: {
    skyTreatment: 'sky-and-clouds',
    sun: { color: '#fff1d6', intensity: 2.4, position: [18, 14, 10] },
    ambient: { color: '#cfe6df', intensity: 0.45 },
    hemisphere: { skyColor: '#bcd8e8', groundColor: '#3c4a2e', intensity: 0.65 },
    fog: { color: '#dce8de', near: 18, far: 55 },
  },
  cameraDefaults: { position: [0, 1.7, 9], target: [0, 1.3, -2], fov: 55, minDistance: 2.5, maxDistance: 32, maxPolarAngle: Math.PI / 2.05 },
  style: { entries: [] },
  years: [
    {
      year: 1980,
      label: '1980',
      metrics: { vegetationDensity: 0.95, waterLevel: 0.95, biodiversityLevel: 0.92, developmentLevel: 0.05 },
      summary: 'A broad tidal wetland with dense reeds and open channels supports large numbers of migratory birds.',
      keyChanges: ['Expansive wetland area', 'High water quality', 'Abundant bird populations'],
    },
    {
      year: 2026,
      label: '2026',
      metrics: { vegetationDensity: 0.62, waterLevel: 0.6, biodiversityLevel: 0.58, developmentLevel: 0.4 },
      summary: 'Drainage for nearby development has reduced wetland area and altered water flow patterns.',
      keyChanges: ['Reduced wetland area', 'Altered water flow', 'Fewer resting sites for migratory birds'],
    },
    {
      year: 2050,
      label: '2050',
      metrics: { vegetationDensity: 0.4, waterLevel: 0.4, biodiversityLevel: 0.35, developmentLevel: 0.6 },
      summary: 'Outcome depends on the chosen scenario — continued drainage or active wetland restoration.',
      keyChanges: ['Outcome depends on the chosen scenario', 'Illustrative — not a scientific forecast'],
    },
  ],
  objects: [
    // ---------------- BACKGROUND: distant hills / treeline framing the wetland ----------------
    { id: 'bg-hill-1', kind: 'mountain', biodiversityCategory: null, name: 'Coastal Bluff', position: [-2, 0, -26], presentInYears: [1980, 2026, 2050], description: 'Low forested hills rising behind the wetland, marking the edge of the estuary basin.', ecologicalRole: 'Shelters the wetland from coastal wind and feeds it with seasonal runoff.', historicalChange: 'The ridgeline itself is unchanged, though development has crept up its lower slopes.' },
    { id: 'bg-tree-1', kind: 'tree', biodiversityCategory: 'plants', name: 'Sitka Spruce', position: [-9, 0, -15], presentInYears: [1980, 2026, 2050], description: 'A line of coastal spruce marking the far edge of the wetland.', ecologicalRole: 'Anchors the transition zone between upland forest and tidal marsh.', historicalChange: 'This treeline has thinned slightly as the wetland edge has been developed.' },
    { id: 'bg-tree-2', kind: 'tree', biodiversityCategory: 'plants', name: 'Sitka Spruce', position: [-6.5, 0, -16], presentInYears: [1980, 2026, 2050], description: 'Part of the distant treeline framing the estuary.', ecologicalRole: 'Provides nesting habitat for raptors that hunt over the open wetland.', historicalChange: 'Largely stable, though canopy density has thinned over time.' },
    { id: 'bg-tree-3', kind: 'tree', biodiversityCategory: 'plants', name: 'Shore Pine', position: [8, 0, -17], presentInYears: [1980, 2026, 2050], description: 'A wind-shaped pine on the far bank.', ecologicalRole: 'Stabilizes the upper bank soil against erosion.', historicalChange: 'Unaffected directly, but the open ground beneath it has changed with development nearby.' },
    { id: 'bg-tree-4', kind: 'tree', biodiversityCategory: 'plants', name: 'Shore Pine', position: [11, 0, -14.5], presentInYears: [1980, 2026], description: 'Part of the far-bank treeline.', ecologicalRole: 'Anchors soil and provides perching sites for raptors.', historicalChange: 'Lost in the degraded 2050 scenario as the far bank is cleared for development.' },

    // ---------------- MIDGROUND: the water body itself + shoreline reeds ----------------
    { id: 'wetland-channel', kind: 'river', biodiversityCategory: 'water', name: 'Estuary Channel', position: [1, 0, -3], presentInYears: [1980, 2026, 2050], description: 'The tidal channel connecting the wetland to the coast, its irregular banks shaped by decades of tidal flow.', ecologicalRole: 'Supports aquatic organisms and surrounding ecosystems, and cycles nutrients with the tide.', historicalChange: 'Flow patterns have shifted and the channel has narrowed as surrounding drainage infrastructure was added.', relatedSpecies: ['Great Blue Heron', 'Chum Salmon'] },

    { id: 'reeds-shore-1', kind: 'reed', biodiversityCategory: 'plants', name: 'Tidal Reeds', position: [-3.5, 0, -1], presentInYears: [1980, 2026, 2050], description: 'Dense reed beds along the near shoreline that filter runoff before it reaches open water.', ecologicalRole: 'Reeds trap sediment and absorb excess nutrients, protecting water quality downstream.', historicalChange: 'Reed bed area has shrunk as adjacent land was drained for development.', connection: { chain: ['Reeds', 'Water filtration', 'Clear channel', 'Fish habitat'] } },
    { id: 'reeds-shore-2', kind: 'reed', biodiversityCategory: 'plants', name: 'Tidal Reeds', position: [4.5, 0, -0.5], presentInYears: [1980, 2026, 2050], description: 'A second reed bed curling along the eastern shoreline.', ecologicalRole: 'Provides shelter and breeding habitat for insects and small wildlife.', historicalChange: 'This bed has thinned noticeably compared to its 1980 extent.' },
    { id: 'reeds-shore-3', kind: 'reed', biodiversityCategory: 'plants', name: 'Tidal Reeds', position: [-6, 0, -5.5], presentInYears: [1980, 2026], description: 'Reeds growing in the shallows further from the main channel.', ecologicalRole: 'Slows water flow, allowing sediment to settle rather than washing downstream.', historicalChange: 'Lost in the 2050 continue-as-is scenario as the shallows dry out.' },
    { id: 'reeds-shore-4', kind: 'reed', biodiversityCategory: 'plants', name: 'Tidal Reeds', position: [7, 0, -4], presentInYears: [1980, 2026, 2050], description: 'A dense stand of reeds at the far shallow end of the channel.', ecologicalRole: 'Breeding habitat for amphibians and a nursery area for young fish.', historicalChange: 'Reduced in area but still present through 2050 under both scenarios.' },

    { id: 'wetland-pollinator-1', kind: 'plant', biodiversityCategory: 'pollinators', name: 'Marsh Wildflowers', position: [5.5, 0, 3.5], presentInYears: [1980, 2026], description: 'A patch of salt-tolerant wildflowers along the wetland edge.', ecologicalRole: 'Supports pollinators that maintain plant diversity along the wetland margin.', historicalChange: 'This patch has thinned as surrounding soil moisture has decreased.', connection: { chain: ['Flower', 'Bee', 'Pollination', 'Marsh plant reproduction'] } },

    // ---------------- FOREGROUND: rocks, path, close vegetation, wildlife ----------------
    { id: 'shore-rock-1', kind: 'rock', biodiversityCategory: null, name: 'Shoreline Rock', position: [-2, 0, 4.5], presentInYears: [1980, 2026, 2050], description: 'A weathered rock at the water\u2019s edge, a favorite perch for herons.', ecologicalRole: 'Provides a dry perch for birds hunting in the shallows.', historicalChange: 'Unchanged by development, this rock looks the same across all years.' },
    { id: 'shore-rock-2', kind: 'rock', biodiversityCategory: null, name: 'Shoreline Rock', position: [2.5, 0, 5.5], presentInYears: [1980, 2026, 2050], description: 'A smaller rock cluster near the entry path.', ecologicalRole: 'Shelters small crustaceans and insects at the waterline.', historicalChange: 'Unchanged across the simulated years.' },
    { id: 'entry-path', kind: 'path', biodiversityCategory: null, name: 'Wetland Trail', position: [0, 0, 6], presentInYears: [1980, 2026, 2050], description: 'A footpath leading down to the water\u2019s observation point.', ecologicalRole: 'Low-impact trails let people access the wetland without disturbing sensitive habitat.', historicalChange: 'This trail has remained largely unchanged, though its surroundings have not.' },
    { id: 'foreground-grass-1', kind: 'plant', biodiversityCategory: 'plants', name: 'Marsh Grass', position: [-4.5, 0, 5], presentInYears: [1980, 2026, 2050], description: 'A cluster of coarse marsh grass at the trailhead.', ecologicalRole: 'Stabilizes the upper bank and filters runoff before it reaches the channel.', historicalChange: 'Coverage has thinned somewhat but remains present in every simulated year.' },
    { id: 'foreground-grass-2', kind: 'plant', biodiversityCategory: 'plants', name: 'Marsh Grass', position: [3.5, 0, 6.5], presentInYears: [1980, 2026, 2050], description: 'Marsh grass growing along the near bank.', ecologicalRole: 'Supports insects that in turn feed wetland birds.', historicalChange: 'Density has decreased moderately since 1980.' },

    { id: 'wetland-bird-1', kind: 'bird', biodiversityCategory: 'birds', name: 'Great Blue Heron', position: [1, 1, -2], presentInYears: [1980, 2026, 2050], description: 'A wading bird commonly seen fishing in shallow wetland water.', ecologicalRole: 'A top predator within the wetland food web, indicating overall habitat health.', historicalChange: 'Sightings have declined somewhat as shallow feeding habitat has been reduced.', connection: { chain: ['Fish', 'Heron', 'Indicator of habitat health'] } },
    { id: 'wetland-bird-2', kind: 'bird', biodiversityCategory: 'birds', name: 'Mallard', position: [-1.5, 1.5, -4], presentInYears: [1980, 2026, 2050], description: 'A dabbling duck often seen paddling in the open channel.', ecologicalRole: 'Feeds on aquatic plants and invertebrates, helping cycle nutrients through the wetland.', historicalChange: 'Populations have decreased somewhat as open water area has shrunk.' },
    { id: 'wetland-frog-1', kind: 'frog', biodiversityCategory: 'wildlife', name: 'Pacific Chorus Frog', position: [-3.2, 0, 1.5], presentInYears: [1980, 2026, 2050], description: 'A small frog resting at the reed-lined edge of the water.', ecologicalRole: 'Amphibians like this frog are highly sensitive indicators of wetland water quality.', historicalChange: 'Frog populations have declined alongside reduced reed cover and water quality.' },

    // ---------------- Development pressure objects (2026 / 2050 only) ----------------
    { id: 'drainage-pipe', kind: 'building', biodiversityCategory: null, name: 'Drainage Outfall', position: [9, 0, -1], presentInYears: [2026, 2050], description: 'A stormwater drainage structure built at the wetland\u2019s edge.', ecologicalRole: 'Represents the human infrastructure redirecting water away from the wetland.', historicalChange: 'Built in the early 2000s, this structure is the main driver of the wetland\u2019s reduced water level in 2026.' },
  ],
  storyChapters: [
    {
      id: 'ch1',
      title: 'The Wetland',
      year: 1980,
      narration: 'In 1980, this estuary held a broad wetland that filtered water for the whole coastline. Reeds grew thick along every shoreline.',
      focusObjectId: 'reeds-shore-1',
    },
    {
      id: 'ch2',
      title: 'The Habitat',
      year: 1980,
      narration: 'Herons, ducks, and frogs relied on the dense reeds and open channels for food and shelter — a tightly connected food web.',
      focusObjectId: 'wetland-bird-1',
    },
    {
      id: 'ch3',
      title: 'The Drainage',
      year: 2026,
      narration: 'As nearby land was developed, drainage infrastructure reduced the wetland to a fraction of its size.',
      focusObjectId: 'drainage-pipe',
    },
    {
      id: 'ch4',
      title: 'The Choice',
      year: 2050,
      narration: 'From here, the wetland could keep shrinking, or be actively restored. What happens next depends on how it\u2019s managed.',
    },
    {
      id: 'ch5',
      title: 'Two Futures',
      year: 2050,
      narration: 'Compare "Continue as Is" with "Protect & Restore" to see how different choices could shape the next 25 years of this wetland.',
      scenarioId: 'continue-as-is',
    },
  ],
};
