import type { BiomeDefinition } from '../../types/vault';

export const coralReefVault: BiomeDefinition = {
  ecosystemId: 'coral-reef',
  name: 'Lantern Cay Reef',
  location: 'Lantern Cay, Tropical Pacific',
  terrain: {
    kind: 'seafloor',
    // Sandy/rocky floor with a blue-green tint blended in by the seafloor strategy itself.
    palette: { primary: '#d8c79a', secondary: '#8a7d5e', developed: '#5c6a5a' },
    params: { seafloorDepth: 3.5 },
  },
  // Reef water is entirely atmosphere-driven — no discrete water-kind object exists here.
  water: { kind: 'underwater-ambient' },
  atmosphere: {
    skyTreatment: 'underwater-ambience',
    // Cool blue-green submerged light rather than a direct sun.
    sun: { color: '#8fd0d8', intensity: 1.1, position: [4, 20, 4] },
    ambient: { color: '#3f7f8c', intensity: 0.55 },
    hemisphere: { skyColor: '#2f6f7c', groundColor: '#1a3f45', intensity: 0.6 },
    // Dense, close blue-green fog reads as murky underwater visibility.
    fog: { color: '#1f5f6c', near: 4, far: 26 },
  },
  // Lower, closer camera appropriate for a submerged close-up scene.
  cameraDefaults: { position: [0, 0.6, 6], target: [0, 0, -2], fov: 62, minDistance: 1.5, maxDistance: 20, maxPolarAngle: Math.PI / 1.7 },
  style: { entries: [{ kind: 'coral', colorPrimary: '#e0765f' }] },
  years: [
    {
      year: 1990,
      label: '1990',
      metrics: { vegetationDensity: 0.9, waterLevel: 1, biodiversityLevel: 0.93, developmentLevel: 0.02 },
      summary: 'Dense, colorful coral clusters cover the seafloor, and large fish schools move freely through clear water.',
      keyChanges: ['Extensive healthy coral cover', 'Clear water visibility', 'Abundant fish schools'],
    },
    {
      year: 2010,
      label: '2010',
      metrics: { vegetationDensity: 0.68, waterLevel: 0.9, biodiversityLevel: 0.72, developmentLevel: 0.12 },
      summary: 'Rising water temperatures have triggered the first bleaching events, and some coral clusters have begun losing their color and structure.',
      keyChanges: ['First coral bleaching events recorded', 'Localized coral die-off begins', 'Fish school sizes start shrinking'],
    },
    {
      year: 2026,
      label: '2026',
      metrics: { vegetationDensity: 0.48, waterLevel: 0.78, biodiversityLevel: 0.5, developmentLevel: 0.22 },
      summary: 'Warming water and coastal runoff have reduced live coral cover significantly, and fish schools are smaller and less frequent.',
      keyChanges: ['Reduced live coral cover', 'Smaller, less frequent fish schools', 'Increased coastal runoff and sedimentation'],
    },
    {
      year: 2050,
      label: '2050',
      metrics: { vegetationDensity: 0.35, waterLevel: 0.65, biodiversityLevel: 0.38, developmentLevel: 0.32 },
      summary: 'Outcome depends on the chosen scenario \u2014 continued warming and runoff, or active reef protection and restoration.',
      keyChanges: ['Outcome depends on the chosen scenario', 'Illustrative \u2014 not a scientific forecast'],
    },
  ],
  objects: [
    { id: 'reef-coral-1', kind: 'coral', biodiversityCategory: 'water', name: 'Staghorn Coral Cluster', position: [-3, 0, -2], presentInYears: [1990, 2010, 2026, 2050], description: 'A branching staghorn coral cluster near the reef\u2019s central shelf.', ecologicalRole: 'Forms the structural foundation of the reef, sheltering fish and filtering plankton from the water column.', historicalChange: 'Bleaching events since 2010 have thinned this cluster\u2019s branches noticeably.', trophicRole: 'producer', habitat: 'Central reef shelf', diet: 'Filters plankton from the water column', environmentalPressures: ['Ocean warming and bleaching', 'Sedimentation from coastal runoff'] },
    { id: 'reef-coral-2', kind: 'coral', biodiversityCategory: 'water', name: 'Brain Coral Formation', position: [2.5, 0, -3.5], presentInYears: [1990, 2010, 2026, 2050], description: 'A dense, dome-shaped brain coral formation.', ecologicalRole: 'A slow-growing anchor species that stabilizes the reef structure over decades.', historicalChange: 'More resilient to bleaching than the staghorn clusters, but has still lost color intensity since 1990.', trophicRole: 'producer', habitat: 'Reef base near the sandy shelf', diet: 'Filters plankton from the water column', environmentalPressures: ['Ocean warming and bleaching', 'Reduced water clarity'] },
    { id: 'reef-coral-3', kind: 'coral', biodiversityCategory: 'water', name: 'Soft Coral Grove', position: [-1, 0, 3], presentInYears: [1990, 2010, 2026, 2050], description: 'A grove of swaying soft coral near a sheltered reef pocket.', ecologicalRole: 'Provides flexible cover that many small reef fish use to hide from predators.', historicalChange: 'Coverage has thinned as warmer water has stressed the colony.', trophicRole: 'producer', habitat: 'Sheltered reef pocket', diet: 'Filters plankton from the water column', environmentalPressures: ['Ocean warming', 'Increased storm-driven sediment'] },
    { id: 'reef-coral-4', kind: 'coral', biodiversityCategory: 'water', name: 'Staghorn Coral Cluster', position: [4, 0, 1.5], presentInYears: [1990, 2010, 2026], description: 'A second staghorn cluster on the reef\u2019s eastern edge.', ecologicalRole: 'Shelters juvenile fish before they move to deeper reef structure.', historicalChange: 'Lost by 2050 under the continue-as-is scenario as repeated bleaching events prevent recovery.', trophicRole: 'producer', habitat: 'Eastern reef edge', diet: 'Filters plankton from the water column', environmentalPressures: ['Repeated bleaching events', 'Habitat loss by 2050'] },

    { id: 'reef-fish-1', kind: 'fishSchool', biodiversityCategory: 'wildlife', name: 'Blue Tang School', position: [0, 0.5, -1], presentInYears: [1990, 2010, 2026, 2050], description: 'A loose school of blue tang drifting above the central coral shelf.', ecologicalRole: 'Grazes algae off coral surfaces, helping keep coral clear enough to photosynthesize its symbiotic algae.', historicalChange: 'School size has shrunk as coral cover \u2014 and the algae grazing grounds it supports \u2014 has declined.', trophicRole: 'primary-consumer', habitat: 'Open water above the reef shelf', diet: 'Algae grazed from coral and rock surfaces', environmentalPressures: ['Declining coral cover', 'Reduced grazing habitat'] },
    { id: 'reef-fish-2', kind: 'fishSchool', biodiversityCategory: 'wildlife', name: 'Clownfish Group', position: [-1.2, 0.2, 2.8], presentInYears: [1990, 2010, 2026, 2050], description: 'A small group of clownfish sheltering near the soft coral grove.', ecologicalRole: 'Lives in close association with the soft coral, defending it from some predators in exchange for shelter.', historicalChange: 'Population has held on despite coral stress, but individuals now range further to find suitable host coral.', trophicRole: 'primary-consumer', habitat: 'Soft coral grove', diet: 'Zooplankton and algae', environmentalPressures: ['Loss of host coral cover', 'Ocean warming'] },
    { id: 'reef-fish-3', kind: 'fishSchool', biodiversityCategory: 'wildlife', name: 'Snapper School', position: [3, 0.8, 0], presentInYears: [1990, 2010, 2026], description: 'A larger predatory school of snapper patrolling the reef edge.', ecologicalRole: 'A mid-level predator that keeps smaller reef fish populations in balance.', historicalChange: 'School size and frequency of sightings have declined alongside the smaller prey schools it depends on.', trophicRole: 'secondary-consumer', habitat: 'Reef edge and open water', diet: 'Smaller reef fish and invertebrates', environmentalPressures: ['Declining prey populations', 'Habitat degradation'] },

    { id: 'reef-rock-1', kind: 'rock', biodiversityCategory: null, name: 'Reef Rock Formation', position: [1.5, 0, -5], presentInYears: [1990, 2010, 2026, 2050], description: 'A rocky outcrop rising from the sandy seafloor, encrusted with algae and small invertebrates.', ecologicalRole: 'Offers hard substrate for coral larvae to settle on and crevices for small reef creatures to hide in.', historicalChange: 'Unchanged in shape, though the coral and algae encrusting it have thinned.' },
    { id: 'reef-rock-2', kind: 'rock', biodiversityCategory: null, name: 'Reef Rock Formation', position: [-4, 0, 0.5], presentInYears: [1990, 2010, 2026, 2050], description: 'A smaller rock cluster near the reef\u2019s sandy fringe.', ecologicalRole: 'Provides shelter for small invertebrates at the reef\u2019s sandy boundary.', historicalChange: 'Unchanged across the simulated years.' },
  ],
  storyChapters: [
    {
      id: 'ch1',
      title: 'The Reef',
      year: 1990,
      narration: 'In 1990, Lantern Cay\u2019s reef was a dense, colorful structure teeming with fish. Every coral cluster was part of a tightly connected underwater community.',
      focusObjectId: 'reef-coral-1',
    },
    {
      id: 'ch2',
      title: 'The Schools',
      year: 1990,
      narration: 'Blue tang and clownfish moved freely through clear water, grazing algae and sheltering among the coral \u2014 a balance built over centuries.',
      focusObjectId: 'reef-fish-1',
    },
    {
      id: 'ch3',
      title: 'The Bleaching',
      year: 2026,
      narration: 'Rising water temperatures triggered repeated bleaching events. Coral that once burst with color has thinned, and the fish that depended on it have followed.',
      focusObjectId: 'reef-coral-4',
    },
    {
      id: 'ch4',
      title: 'The Choice',
      year: 2050,
      narration: 'From here, warming and runoff could keep eroding the reef, or active protection could give it room to recover. What happens next depends on that choice.',
    },
    {
      id: 'ch5',
      title: 'Two Futures',
      year: 2050,
      narration: 'Compare "Continue as Is" with "Protect & Restore" to see how different choices could shape the next 25 years of this reef.',
      scenarioId: 'continue-as-is',
    },
  ],
};
