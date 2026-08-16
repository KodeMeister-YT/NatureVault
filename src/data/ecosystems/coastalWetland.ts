import type { VaultDefinition } from '../../types/vault';

export const coastalWetlandVault: VaultDefinition = {
  ecosystemId: 'coastal-wetland',
  name: 'Coastal Wetland',
  location: 'Siuslaw Estuary, Oregon Coast',
  terrain: {
    kind: 'rolling-hills',
    // Muted marsh green / straw-reed / dark tidal mud, distinct from the forest-green
    // palette shared by evergreenValley.ts and alpineEcosystem.ts.
    palette: { primary: '#4c5a3a', secondary: '#8a7d47', shoreline: '#3a3226', developed: '#5c5a52' },
  },
  // Duller, siltier estuary tones than evergreenValley/alpineEcosystem's clearer pond
  // colors (#2b5866 / #5f9aa0), so the wetland's tidal channel reads as murkier water.
  water: { kind: 'pond-marsh', deepColor: '#324a42', shallowColor: '#7c8f6a' },
  atmosphere: {
    skyTreatment: 'sky-and-clouds',
    // Cooler, greyer coastal-haze light rather than the warm evergreen-valley sun.
    sun: { color: '#d9e2df', intensity: 1.7, position: [12, 10, 14] },
    ambient: { color: '#c3d2ce', intensity: 0.5 },
    hemisphere: { skyColor: '#a9bfc7', groundColor: '#3a4232', intensity: 0.6 },
    // Denser, closer fog than the copied evergreen defaults (18/55) to read as coastal haze.
    fog: { color: '#c9d6d2', near: 10, far: 38 },
  },
  // Low, wide estuary vantage: camera sits slightly lower and further back, aimed flatter
  // across the channel rather than up at a forest approach.
  cameraDefaults: { position: [0, 1.5, 11], target: [0, 0.9, -3], fov: 58, minDistance: 3, maxDistance: 34, maxPolarAngle: Math.PI / 2.1 },
  style: { entries: [{ kind: 'reed', colorPrimary: '#6f8a52', colorAccent: '#9c8a4e' }] },
  years: [
    {
      year: 1980,
      label: '1980',
      metrics: { vegetationDensity: 0.95, waterLevel: 0.95, biodiversityLevel: 0.92, developmentLevel: 0.05 },
      summary: 'A broad tidal wetland with dense reeds and open channels supports large numbers of migratory birds.',
      keyChanges: ['Expansive wetland area', 'High water quality', 'Abundant bird populations'],
    },
    {
      year: 1995,
      label: '1995',
      metrics: { vegetationDensity: 0.88, waterLevel: 0.88, biodiversityLevel: 0.84, developmentLevel: 0.12 },
      summary: 'The wetland is still largely intact, but the county has just granted the first drainage permits for land bordering the estuary.',
      keyChanges: ['Early drainage permits granted', 'Wetland still largely intact', 'First survey flags declining shorebird counts nearby'],
    },
    {
      year: 2010,
      label: '2010',
      metrics: { vegetationDensity: 0.78, waterLevel: 0.76, biodiversityLevel: 0.72, developmentLevel: 0.24 },
      summary: 'Approved drainage work has begun reshaping the channel banks, and the wetland\u2019s edges are visibly shrinking for the first time.',
      keyChanges: ['Visible wetland shrinkage begins', 'Channel banks reshaped by drainage work', 'Reed beds start thinning at the margins'],
    },
    {
      year: 2026,
      label: '2026',
      metrics: { vegetationDensity: 0.62, waterLevel: 0.6, biodiversityLevel: 0.58, developmentLevel: 0.4 },
      summary: 'Drainage for nearby development has reduced wetland area and altered water flow patterns.',
      keyChanges: ['Reduced wetland area', 'Altered water flow', 'Fewer resting sites for migratory birds'],
    },
    {
      year: 2035,
      label: '2035',
      metrics: { vegetationDensity: 0.5, waterLevel: 0.49, biodiversityLevel: 0.45, developmentLevel: 0.51 },
      summary: 'A decade on from 2026, the wetland\u2019s trajectory is starting to diverge — continued drainage keeps eroding it, while early restoration efforts elsewhere show the wetland can recover if given the chance.',
      keyChanges: ['Trajectory diverging by management choice', 'Continued drainage keeps eroding remaining reed beds', 'Early restoration pilots show recovery is possible'],
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
    { id: 'bg-hill-1', kind: 'mountain', biodiversityCategory: null, name: 'Coastal Bluff', position: [-2, 0, -26], presentInYears: [1980, 1995, 2010, 2026, 2035, 2050], description: 'Low forested hills rising behind the wetland, marking the edge of the estuary basin.', ecologicalRole: 'Shelters the wetland from coastal wind and feeds it with seasonal runoff.', historicalChange: 'The ridgeline itself is unchanged, though development has crept up its lower slopes.' },
    { id: 'bg-tree-1', kind: 'tree', biodiversityCategory: 'plants', name: 'Sitka Spruce', position: [-9, 0, -15], presentInYears: [1980, 1995, 2010, 2026, 2035, 2050], description: 'A line of coastal spruce marking the far edge of the wetland.', ecologicalRole: 'Anchors the transition zone between upland forest and tidal marsh.', historicalChange: 'This treeline has thinned slightly as the wetland edge has been developed.', trophicRole: 'producer', habitat: 'Upland forest edge bordering the tidal marsh', environmentalPressures: ['Encroaching development at the wetland edge', 'Canopy thinning from land clearing'] },
    { id: 'bg-tree-2', kind: 'tree', biodiversityCategory: 'plants', name: 'Sitka Spruce', position: [-6.5, 0, -16], presentInYears: [1980, 1995, 2010, 2026, 2035, 2050], description: 'Part of the distant treeline framing the estuary.', ecologicalRole: 'Provides nesting habitat for raptors that hunt over the open wetland.', historicalChange: 'Largely stable, though canopy density has thinned over time.', trophicRole: 'producer', habitat: 'Distant treeline along the estuary basin', environmentalPressures: ['Gradual canopy thinning', 'Reduced buffer against coastal wind'] },
    { id: 'bg-tree-3', kind: 'tree', biodiversityCategory: 'plants', name: 'Shore Pine', position: [8, 0, -17], presentInYears: [1980, 1995, 2010, 2026, 2035, 2050], description: 'A wind-shaped pine on the far bank.', ecologicalRole: 'Stabilizes the upper bank soil against erosion.', historicalChange: 'Unaffected directly, but the open ground beneath it has changed with development nearby.', trophicRole: 'producer', habitat: 'Windswept far bank of the estuary', environmentalPressures: ['Bank erosion', 'Nearby land clearing'] },
    { id: 'bg-tree-4', kind: 'tree', biodiversityCategory: 'plants', name: 'Shore Pine', position: [11, 0, -14.5], presentInYears: [1980, 1995, 2010, 2026], description: 'Part of the far-bank treeline.', ecologicalRole: 'Anchors soil and provides perching sites for raptors.', historicalChange: 'Lost in the degraded 2050 scenario as the far bank is cleared for development.', trophicRole: 'producer', habitat: 'Far-bank treeline', environmentalPressures: ['Bank clearing for development', 'Habitat loss by the 2030s'] },

    // ---------------- MIDGROUND: the water body itself + shoreline reeds ----------------
    { id: 'wetland-channel', kind: 'river', biodiversityCategory: 'water', name: 'Estuary Channel', position: [1, 0, -3], presentInYears: [1980, 1995, 2010, 2026, 2035, 2050], description: 'The tidal channel connecting the wetland to the coast, its irregular banks shaped by decades of tidal flow.', ecologicalRole: 'Supports aquatic organisms and surrounding ecosystems, and cycles nutrients with the tide.', historicalChange: 'Flow patterns have shifted and the channel has narrowed as surrounding drainage infrastructure was added.', relatedSpecies: ['Great Blue Heron', 'Chum Salmon'], habitat: 'Tidal channel connecting the estuary to the open coast', environmentalPressures: ['Altered flow from drainage infrastructure', 'Channel narrowing', 'Sedimentation'] },

    { id: 'reeds-shore-1', kind: 'reed', biodiversityCategory: 'plants', name: 'Tidal Reeds', position: [-3.5, 0, -1], presentInYears: [1980, 1995, 2010, 2026, 2035, 2050], description: 'Dense reed beds along the near shoreline that filter runoff before it reaches open water.', ecologicalRole: 'Reeds trap sediment and absorb excess nutrients, protecting water quality downstream.', historicalChange: 'Reed bed area has shrunk as adjacent land was drained for development.', connection: { chain: ['Reeds', 'Water filtration', 'Clear channel', 'Fish habitat'] }, trophicRole: 'producer', habitat: 'Near-shore reed bed at the water\u2019s edge', environmentalPressures: ['Wetland drainage reducing soil moisture', 'Shoreline development encroachment'] },
    { id: 'reeds-shore-2', kind: 'reed', biodiversityCategory: 'plants', name: 'Tidal Reeds', position: [4.5, 0, -0.5], presentInYears: [1980, 1995, 2010, 2026, 2035, 2050], description: 'A second reed bed curling along the eastern shoreline.', ecologicalRole: 'Provides shelter and breeding habitat for insects and small wildlife.', historicalChange: 'This bed has thinned noticeably compared to its 1980 extent.', trophicRole: 'producer', habitat: 'Eastern shoreline reed bed', environmentalPressures: ['Reduced reed bed extent from drainage', 'Bank erosion'] },
    { id: 'reeds-shore-3', kind: 'reed', biodiversityCategory: 'plants', name: 'Tidal Reeds', position: [-6, 0, -5.5], presentInYears: [1980, 1995, 2010, 2026], description: 'Reeds growing in the shallows further from the main channel.', ecologicalRole: 'Slows water flow, allowing sediment to settle rather than washing downstream.', historicalChange: 'Lost in the 2050 continue-as-is scenario as the shallows dry out.', trophicRole: 'producer', habitat: 'Shallow marsh reeds away from the main channel', environmentalPressures: ['Shallow-water drying', 'Loss of habitat by the 2030s'] },
    { id: 'reeds-shore-4', kind: 'reed', biodiversityCategory: 'plants', name: 'Tidal Reeds', position: [7, 0, -4], presentInYears: [1980, 1995, 2010, 2026, 2035, 2050], description: 'A dense stand of reeds at the far shallow end of the channel.', ecologicalRole: 'Breeding habitat for amphibians and a nursery area for young fish.', historicalChange: 'Reduced in area but still present through 2050 under both scenarios.', trophicRole: 'producer', habitat: 'Dense reed stand at the shallow channel end', environmentalPressures: ['Reduced reed bed area', 'Sedimentation changes'] },

    { id: 'wetland-pollinator-1', kind: 'plant', biodiversityCategory: 'pollinators', name: 'Marsh Wildflowers', position: [5.5, 0, 3.5], presentInYears: [1980, 1995, 2010, 2026], description: 'A patch of salt-tolerant wildflowers along the wetland edge.', ecologicalRole: 'Supports pollinators that maintain plant diversity along the wetland margin.', historicalChange: 'This patch has thinned as surrounding soil moisture has decreased.', connection: { chain: ['Flower', 'Bee', 'Pollination', 'Marsh plant reproduction'] }, trophicRole: 'producer', habitat: 'Salt-tolerant wildflower patch at the wetland edge', environmentalPressures: ['Decreased soil moisture', 'Habitat loss by the 2030s'] },

    // ---------------- FOREGROUND: rocks, path, close vegetation, wildlife ----------------
    { id: 'shore-rock-1', kind: 'rock', biodiversityCategory: null, name: 'Shoreline Rock', position: [-2, 0, 4.5], presentInYears: [1980, 1995, 2010, 2026, 2035, 2050], description: 'A weathered rock at the water\u2019s edge, a favorite perch for herons.', ecologicalRole: 'Provides a dry perch for birds hunting in the shallows.', historicalChange: 'Unchanged by development, this rock looks the same across all years.' },
    { id: 'shore-rock-2', kind: 'rock', biodiversityCategory: null, name: 'Shoreline Rock', position: [2.5, 0, 5.5], presentInYears: [1980, 1995, 2010, 2026, 2035, 2050], description: 'A smaller rock cluster near the entry path.', ecologicalRole: 'Shelters small crustaceans and insects at the waterline.', historicalChange: 'Unchanged across the simulated years.' },
    { id: 'entry-path', kind: 'path', biodiversityCategory: null, name: 'Wetland Trail', position: [0, 0, 6], presentInYears: [1980, 1995, 2010, 2026, 2035, 2050], description: 'A footpath leading down to the water\u2019s observation point.', ecologicalRole: 'Low-impact trails let people access the wetland without disturbing sensitive habitat.', historicalChange: 'This trail has remained largely unchanged, though its surroundings have not.' },
    { id: 'foreground-grass-1', kind: 'plant', biodiversityCategory: 'plants', name: 'Marsh Grass', position: [-4.5, 0, 5], presentInYears: [1980, 1995, 2010, 2026, 2035, 2050], description: 'A cluster of coarse marsh grass at the trailhead.', ecologicalRole: 'Stabilizes the upper bank and filters runoff before it reaches the channel.', historicalChange: 'Coverage has thinned somewhat but remains present in every simulated year.', trophicRole: 'producer', habitat: 'Upper bank at the trailhead', environmentalPressures: ['Trampling from foot traffic', 'Reduced runoff filtration capacity'] },
    { id: 'foreground-grass-2', kind: 'plant', biodiversityCategory: 'plants', name: 'Marsh Grass', position: [3.5, 0, 6.5], presentInYears: [1980, 1995, 2010, 2026, 2035, 2050], description: 'Marsh grass growing along the near bank.', ecologicalRole: 'Supports insects that in turn feed wetland birds.', historicalChange: 'Density has decreased moderately since 1980.', trophicRole: 'producer', habitat: 'Near-bank marsh grass stand', environmentalPressures: ['Density decline since 1980', 'Reduced insect habitat'] },

    { id: 'wetland-bird-1', kind: 'bird', biodiversityCategory: 'birds', name: 'Great Blue Heron', position: [1, 1, -2], presentInYears: [1980, 1995, 2010, 2026, 2035, 2050], description: 'A wading bird commonly seen fishing in shallow wetland water.', ecologicalRole: 'A top predator within the wetland food web, indicating overall habitat health.', historicalChange: 'Sightings have declined somewhat as shallow feeding habitat has been reduced.', connection: { chain: ['Fish', 'Heron', 'Indicator of habitat health'] }, trophicRole: 'secondary-consumer', habitat: 'Shallow wetland channels and reed margins', diet: 'Fish, amphibians, and small aquatic invertebrates', environmentalPressures: ['Reduced shallow feeding habitat', 'Declining fish populations'] },
    { id: 'wetland-bird-2', kind: 'bird', biodiversityCategory: 'birds', name: 'Mallard', position: [-1.5, 1.5, -4], presentInYears: [1980, 1995, 2010, 2026, 2035, 2050], description: 'A dabbling duck often seen paddling in the open channel.', ecologicalRole: 'Feeds on aquatic plants and invertebrates, helping cycle nutrients through the wetland.', historicalChange: 'Populations have decreased somewhat as open water area has shrunk.', trophicRole: 'primary-consumer', habitat: 'Open tidal channel and shallow water', diet: 'Aquatic plants, seeds, and invertebrates', environmentalPressures: ['Shrinking open water area', 'Reduced aquatic vegetation'] },
    { id: 'wetland-frog-1', kind: 'frog', biodiversityCategory: 'wildlife', name: 'Pacific Chorus Frog', position: [-3.2, 0, 1.5], presentInYears: [1980, 1995, 2010, 2026, 2035, 2050], description: 'A small frog resting at the reed-lined edge of the water.', ecologicalRole: 'Amphibians like this frog are highly sensitive indicators of wetland water quality.', historicalChange: 'Frog populations have declined alongside reduced reed cover and water quality.', trophicRole: 'primary-consumer', habitat: 'Reed-lined shallow water margins', diet: 'Insects and other small invertebrates', environmentalPressures: ['Declining water quality', 'Reduced reed cover', 'Habitat fragmentation'] },

    // ---------------- Development pressure objects (built early 2000s onward) ----------------
    { id: 'drainage-pipe', kind: 'building', biodiversityCategory: null, name: 'Drainage Outfall', position: [9, 0, -1], presentInYears: [2010, 2026, 2035, 2050], description: 'A stormwater drainage structure built at the wetland\u2019s edge.', ecologicalRole: 'Represents the human infrastructure redirecting water away from the wetland.', historicalChange: 'Built in the early 2000s, this structure is the main driver of the wetland\u2019s reduced water level in 2026.' },
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
