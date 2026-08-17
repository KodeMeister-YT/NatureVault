import type { BiomeDefinition } from '../../types/vault';

export const grasslandSavannaVault: BiomeDefinition = {
  ecosystemId: 'grassland-savanna',
  name: 'Kalahi Plains Savanna',
  location: 'Kalahi Plains, East African Savanna',
  terrain: {
    kind: 'flat-grassland',
    // Golden/dry savanna grass palette — warm ochre and sun-bleached tan,
    // distinct from freshwaterLake's cool lakeside flat-grassland palette
    // (#6b8f5a/#a9a56a/#d8cfa0).
    palette: { primary: '#c9a24a', secondary: '#a9843a', shoreline: '#8a6f3a', developed: '#7a6a4a' },
  },
  water: { kind: 'pond-marsh', deepColor: '#4a6a4c', shallowColor: '#8aae7a' },
  atmosphere: {
    skyTreatment: 'sky-and-clouds',
    // Warm, dry savanna daylight — softer and more golden than desert's harsh
    // white-hot sun (intensity 3.2), calmer and warmer than freshwaterLake's
    // clear lakeside light.
    sun: { color: '#ffdf9a', intensity: 2.6, position: [16, 15, 8] },
    ambient: { color: '#e8cf9a', intensity: 0.4 },
    hemisphere: { skyColor: '#eaddb0', groundColor: '#7a6438', intensity: 0.55 },
    fog: { color: '#e6d4a0', near: 24, far: 65 },
  },
  cameraDefaults: { position: [0, 1.7, 10], target: [0, 1, -3], fov: 56, minDistance: 3, maxDistance: 36, maxPolarAngle: Math.PI / 2.1 },
  style: {
    entries: [
      // Golden/tan tall-grass tint, distinct from the shared default `plant` green
      // (#8fae5c) so the savanna's MeadowPatch-as-tall-grass reuse reads as dry
      // golden grassland rather than a generic green meadow patch.
      { kind: 'plant', variant: 'tallGrass', colorPrimary: '#c9a24a', colorAccent: '#a9843a' },
      // Dusty green-brown shrub tint, distinct from both the tall-grass override above
      // and the shared default green, so the low shrub reads as tougher, woodier
      // vegetation rather than more tall grass.
      { kind: 'plant', variant: 'shrub', colorPrimary: '#6e6a42', colorAccent: '#8a7a4a' },
      // Warm orange/monarch tint for the savanna's African Monarch butterfly, distinct
      // from tropicalForest's blue-morpho butterfly override and the shared default
      // pollinator amber (#e0a83c).
      { kind: 'pollinator', variant: 'butterfly', colorPrimary: '#e07a2c', colorAccent: '#c95a1e' },
    ],
  },
  years: [
    {
      year: 1995,
      label: '1995',
      metrics: { vegetationDensity: 0.7, waterLevel: 0.6, biodiversityLevel: 0.78, developmentLevel: 0.05 },
      summary: 'Open grassland stretches to the horizon, dotted with acacia trees and termite mounds, and grazing herds move freely between the plains and a seasonal watering hole.',
      keyChanges: ['Continuous open grassland', 'Healthy watering hole', 'Large grazing herds'],
    },
    {
      year: 2005,
      label: '2005',
      metrics: { vegetationDensity: 0.64, waterLevel: 0.55, biodiversityLevel: 0.69, developmentLevel: 0.12 },
      summary: 'The first livestock enclosures appear at the plain\u2019s western edge, marking the start of organized grazing-land conversion, though wild herds still range freely across most of the open grassland.',
      keyChanges: ['First livestock enclosures established at the western edge', 'Wild herds still range across most of the open grassland', 'Watering hole still recharges fully each dry season'],
    },
    {
      year: 2015,
      label: '2015',
      metrics: { vegetationDensity: 0.58, waterLevel: 0.5, biodiversityLevel: 0.6, developmentLevel: 0.2 },
      summary: 'Expanding livestock grazing land at the plains\u2019 edge has begun competing with wild herds for forage, and the watering hole runs lower each dry season.',
      keyChanges: ['Livestock grazing land expands at the edge', 'Lower dry-season watering hole levels', 'Reduced forage for wild herds'],
    },
    {
      year: 2026,
      label: '2026',
      metrics: { vegetationDensity: 0.46, waterLevel: 0.42, biodiversityLevel: 0.44, developmentLevel: 0.34 },
      summary: 'Continued land conversion for grazing has fragmented the open plains, and wild grazer herds are smaller and more concentrated near the shrinking watering hole.',
      keyChanges: ['Fragmented open grassland', 'Smaller wild grazer herds', 'Watering hole under pressure from year-round livestock use'],
    },
    {
      year: 2050,
      label: '2050',
      metrics: { vegetationDensity: 0.36, waterLevel: 0.32, biodiversityLevel: 0.32, developmentLevel: 0.46 },
      summary: 'Outcome depends on the chosen scenario \u2014 continued land conversion for grazing, or managed grazing-land practices that let the plains recover.',
      keyChanges: ['Outcome depends on the chosen scenario', 'Illustrative \u2014 not a scientific forecast'],
    },
    {
      year: 2075,
      label: '2075',
      metrics: { vegetationDensity: 0.29, waterLevel: 0.27, biodiversityLevel: 0.27, developmentLevel: 0.54 },
      summary: 'A quarter-century beyond 2050, the two paths have diverged sharply: unmanaged grazing-land conversion would leave the plains fragmented into isolated grass islands around a nearly dry watering hole, while sustained protection would let deep-rooted grasses and wild herds reclaim much of the range.',
      keyChanges: ['Divergence between scenarios compounds over 25 more years', 'Continue-as-is: isolated grass islands around a nearly dry watering hole', 'Protect & Restore: reclaimed grassland and rebounding wild herds', 'Illustrative \u2014 not a scientific forecast'],
    },
  ],
  objects: [
    { id: 'savanna-acacia-1', kind: 'tree', variant: 'broadleaf', biodiversityCategory: 'plants', name: 'Umbrella Acacia', position: [-5, 0, -3], presentInYears: [1995, 2005, 2015, 2026, 2050, 2075], description: 'A wide, flat-topped acacia standing alone on the open plain, one of the few tall silhouettes on the horizon.', ecologicalRole: 'Its broad canopy is one of the only shade sources on the plain, and its seed pods feed grazing herds.', historicalChange: 'Growth has slowed as grazing pressure has compacted the soil around its roots.', connection: { chain: ['Acacia', 'Insects', 'Birds', 'Predator'] }, trophicRole: 'producer', habitat: 'Open savanna plain', environmentalPressures: ['Soil compaction from grazing pressure', 'Reduced seedling survival'] },
    { id: 'savanna-acacia-2', kind: 'tree', variant: 'broadleaf', biodiversityCategory: 'plants', name: 'Umbrella Acacia', position: [4, 0, -5], presentInYears: [1995, 2005, 2015, 2026, 2050, 2075], description: 'A mature acacia near the watering hole, its canopy a favored gathering shade for herds.', ecologicalRole: 'Shades the watering hole approach and its pods supplement herd diets during dry months.', historicalChange: 'Remains present in every simulated year, though its canopy has thinned slightly.', trophicRole: 'producer', habitat: 'Near the watering hole', environmentalPressures: ['Heavy grazing traffic nearby', 'Soil erosion at the watering hole approach'] },
    { id: 'savanna-acacia-3', kind: 'tree', variant: 'broadleaf', biodiversityCategory: 'plants', name: 'Whistling Thorn Acacia', position: [-8, 0, 4], presentInYears: [1995, 2005, 2015, 2026], description: 'A thorny acacia at the plain\u2019s western edge, closest to expanding grazing land.', ecologicalRole: 'Its thorns and ant symbionts deter browsing, letting it persist even under grazing pressure.', historicalChange: 'Lost by 2050 under the continue-as-is scenario as grazing land conversion reaches the western edge.', trophicRole: 'producer', habitat: 'Western plain edge', environmentalPressures: ['Encroaching grazing-land conversion', 'Habitat loss by 2050'] },
    { id: 'savanna-mound-1', kind: 'termiteMound', biodiversityCategory: null, name: 'Termite Mound', position: [1, 0, 1.5], presentInYears: [1995, 2005, 2015, 2026, 2050, 2075], description: 'A tall termite mound rising from the grassland, one of many scattered across the plain.', ecologicalRole: 'Termite mounds aerate and enrich the soil, and their nutrient-rich mounds support distinct plant growth nearby.', historicalChange: 'Unchanged in shape across the simulated years, a durable feature of the plain.' },
    { id: 'savanna-mound-2', kind: 'termiteMound', biodiversityCategory: null, name: 'Termite Mound', position: [-2.5, 0, 3], presentInYears: [1995, 2005, 2015, 2026, 2050, 2075], description: 'A smaller termite mound near the acacia grove.', ecologicalRole: 'Provides burrowing habitat for small reptiles once abandoned by its original colony.', historicalChange: 'Unchanged across the simulated years.' },
    { id: 'savanna-mound-3', kind: 'termiteMound', biodiversityCategory: null, name: 'Termite Mound', position: [6, 0, 2], presentInYears: [1995, 2005, 2015, 2026, 2050, 2075], description: 'A weathered mound near the eastern grazing paths.', ecologicalRole: 'Its hardened structure withstands trampling from passing herds better than the surrounding soil.', historicalChange: 'Unchanged across the simulated years, though the ground around it has become more compacted.' },
    { id: 'savanna-waterhole', kind: 'pond', biodiversityCategory: 'water', name: 'Kalahi Watering Hole', position: [3, 0, -1], presentInYears: [1995, 2005, 2015, 2026, 2050, 2075], description: 'A shallow watering hole that draws grazing herds from across the plain, especially in the dry season.', ecologicalRole: 'The plain\u2019s central water source, supporting grazers, birds, and the surrounding grassland\u2019s soil moisture.', historicalChange: 'Dry-season levels have dropped as year-round livestock use has increased demand on the hole.', featureRadius: 4, trophicRole: 'producer', habitat: 'Central savanna watering hole', environmentalPressures: ['Year-round livestock demand', 'Lower dry-season recharge'] },
    { id: 'savanna-grazer-1', kind: 'animal', biodiversityCategory: 'wildlife', name: 'Plains Zebra', position: [0, 0, 4], presentInYears: [1995, 2005, 2015, 2026, 2050, 2075], description: 'A zebra grazing in the open grassland, part of a wider herd moving across the plain.', ecologicalRole: 'Grazing keeps grass height in check, shaping the plain\u2019s vegetation structure and supporting new growth.', historicalChange: 'Herd sizes have declined as grazing land available to wild herds has shrunk.', connection: { chain: ['Grass', 'Grazing herds', 'Predator', 'Decomposition'] }, trophicRole: 'primary-consumer', habitat: 'Open savanna grassland', diet: 'Grasses and sedges', environmentalPressures: ['Shrinking available grazing land', 'Competition with livestock for forage'] },
    { id: 'savanna-grazer-2', kind: 'animal', biodiversityCategory: 'wildlife', name: 'Wildebeest', position: [-3, 0, -6], presentInYears: [1995, 2005, 2015, 2026, 2050, 2075], description: 'A wildebeest grazing near the acacia grove, part of a herd that follows seasonal grass growth.', ecologicalRole: 'Seasonal grazing migrations distribute nutrients across the plain through dung and trampling.', historicalChange: 'Migration range has narrowed as fenced grazing land has interrupted traditional routes.', trophicRole: 'primary-consumer', habitat: 'Open plain and grove edges', diet: 'Grasses', environmentalPressures: ['Fenced grazing land interrupting migration routes', 'Reduced forage availability'] },
    { id: 'savanna-grazer-3', kind: 'animal', biodiversityCategory: 'wildlife', name: 'Plains Zebra', position: [5, 0, 5], presentInYears: [1995, 2005, 2015, 2026], description: 'A second zebra near the eastern grazing paths, close to the expanding livestock boundary.', ecologicalRole: 'Part of the same herd structure that maintains grassland health through grazing pressure.', historicalChange: 'Lost from this area by 2050 under the continue-as-is scenario as livestock grazing displaces wild herds here.', trophicRole: 'primary-consumer', habitat: 'Eastern grazing paths', diet: 'Grasses and sedges', environmentalPressures: ['Displacement by expanding livestock grazing', 'Habitat loss by 2050'] },
    { id: 'savanna-bird-1', kind: 'bird', biodiversityCategory: 'birds', name: 'Secretary Bird', position: [-1, 3.5, -2], presentInYears: [1995, 2005, 2015, 2026, 2050, 2075], description: 'A secretary bird stalking through the grass, hunting for snakes and insects.', ecologicalRole: 'A ground-hunting predator that helps keep snake and rodent populations in check across the plain.', historicalChange: 'Sightings have become less frequent as grassland fragmentation has reduced its hunting range.', trophicRole: 'secondary-consumer', habitat: 'Open grassland hunting range', diet: 'Snakes, insects, and small mammals', environmentalPressures: ['Grassland fragmentation reducing hunting range', 'Declining prey availability'] },
    { id: 'savanna-tallgrass-1', kind: 'plant', variant: 'tallGrass', biodiversityCategory: 'plants', name: 'Golden Savanna Grass', position: [-6, 0, -1], presentInYears: [1995, 2005, 2015, 2026, 2050, 2075], description: 'A dense stand of tall, golden grass swaying near the acacia grove, one of the plain\u2019s defining textures.', ecologicalRole: 'Provides cover for ground-nesting birds and small mammals, and its deep roots hold the plain\u2019s thin topsoil in place.', historicalChange: 'Stands have thinned at the plain\u2019s edges as livestock grazing has intensified, though this stand near the grove has held on.', trophicRole: 'producer', habitat: 'Open savanna grassland near the acacia grove', environmentalPressures: ['Livestock grazing pressure at the plain\u2019s edges', 'Soil compaction reducing regrowth'] },
    { id: 'savanna-tallgrass-2', kind: 'plant', variant: 'tallGrass', biodiversityCategory: 'plants', name: 'Golden Savanna Grass', position: [4.5, 0, 2.5], presentInYears: [1995, 2005, 2015, 2026, 2050, 2075], description: 'A second stand of tall grass bordering the watering hole, where herds pass daily on their way to drink.', ecologicalRole: 'Filters runoff before it reaches the watering hole and offers grazing forage close to water.', historicalChange: 'Has been cropped shorter each year as year-round livestock traffic near the watering hole has increased.', trophicRole: 'producer', habitat: 'Grassland bordering the watering hole', environmentalPressures: ['Year-round livestock traffic near the watering hole', 'Repeated grazing preventing full regrowth'] },
    { id: 'savanna-shrub-1', kind: 'plant', variant: 'shrub', biodiversityCategory: 'plants', name: 'Dwarf Savanna Shrub', position: [-4, 0, 6.5], presentInYears: [1995, 2005, 2015, 2026, 2050, 2075], description: 'A low, wiry shrub growing in open grass near the plain\u2019s western edge, tougher than the surrounding grasses during dry spells.', ecologicalRole: 'Its dense low branches shelter ground-nesting birds and small reptiles from the sun and from passing grazing herds.', historicalChange: 'Has spread slightly as grazing pressure has favored tougher, less palatable shrub growth over grass in this area.', trophicRole: 'producer', habitat: 'Open grassland near the western plain edge', environmentalPressures: ['Grazing pressure favoring shrub over grass regrowth', 'Soil compaction from nearby livestock paths'] },
    { id: 'savanna-pollinator-1', kind: 'pollinator', variant: 'butterfly', biodiversityCategory: 'pollinators', name: 'African Monarch Butterfly', position: [-6, 0.5, -0.5], presentInYears: [1995, 2005, 2015, 2026, 2050, 2075], description: 'An African monarch butterfly drifting low over the tall grass near the acacia grove, pausing at scattered wildflowers.', ecologicalRole: 'Pollinates wildflowers scattered through the grassland and serves as a food source for insectivorous birds.', historicalChange: 'Sightings have grown less frequent as wildflower patches have thinned alongside the grassland\u2019s overall decline.', connection: { chain: ['Wildflower', 'Butterfly', 'Pollination', 'Seed production'] }, trophicRole: 'primary-consumer', habitat: 'Tall grass and scattered wildflowers near the acacia grove', diet: 'Flower nectar', environmentalPressures: ['Thinning wildflower patches', 'Grassland fragmentation reducing forage range'] },

    // ---------------- Additional density backfill (Requirement 9.4 verification) ----------------
    { id: 'savanna-lion-1', kind: 'animal', biodiversityCategory: 'wildlife', name: 'Lioness', position: [7, 0, -3.5], presentInYears: [1995, 2005, 2015, 2026, 2050, 2075], description: 'A lioness resting in the shade of the acacia grove near the watering hole, watching the grazing herds.', ecologicalRole: 'A top predator that keeps grazer populations in check and shapes their movement across the plain.', historicalChange: 'Territory has shrunk as fenced grazing land has fragmented the range it once hunted freely.', trophicRole: 'secondary-consumer', habitat: 'Acacia grove shade near the watering hole', diet: 'Zebra, wildebeest, and other grazing herd species', environmentalPressures: ['Fragmented hunting range from fenced grazing land', 'Declining wild grazer populations'] },
    { id: 'savanna-giraffe-1', kind: 'animal', biodiversityCategory: 'wildlife', name: 'Masai Giraffe', position: [-7, 0, 6], presentInYears: [1995, 2005, 2015, 2026, 2050, 2075], description: 'A giraffe browsing the upper canopy of an acacia near the plain\u2019s western edge.', ecologicalRole: 'Browses foliage well above the reach of other grazers, shaping acacia canopy height across the plain.', historicalChange: 'Sightings have become less frequent as acacia cover at the western edge has thinned under grazing-land conversion.', trophicRole: 'primary-consumer', habitat: 'Acacia canopy near the western plain edge', diet: 'Acacia leaves and shoots', environmentalPressures: ['Thinning acacia cover from land conversion', 'Reduced browse availability'] },
    { id: 'savanna-mongoose-1', kind: 'animal', biodiversityCategory: 'wildlife', name: 'Banded Mongoose', position: [1.5, 0, 4.8], presentInYears: [1995, 2005, 2015, 2026, 2050, 2075], description: 'A troop of banded mongoose foraging near an old termite mound.', ecologicalRole: 'Controls insect and small-reptile populations, and often dens in abandoned termite mounds.', historicalChange: 'Troop range has held steady near the mounds it depends on, though foraging territory has narrowed elsewhere.', trophicRole: 'secondary-consumer', habitat: 'Abandoned termite mounds and open grassland', diet: 'Insects, small reptiles, and eggs', environmentalPressures: ['Narrowing foraging territory', 'Habitat fragmentation'] },
    { id: 'savanna-bird-2', kind: 'bird', biodiversityCategory: 'birds', name: 'Lilac-breasted Roller', position: [2, 3, 5.5], presentInYears: [1995, 2005, 2015, 2026, 2050, 2075], description: 'A brightly colored roller perched on a low acacia branch, watching for insects stirred up by passing herds.', ecologicalRole: 'Hunts insects flushed by grazing herds, linking bird foraging success directly to herd movement across the plain.', historicalChange: 'Sightings have tracked the decline of wild herds it depends on to flush insect prey.', trophicRole: 'secondary-consumer', habitat: 'Low acacia branches near grazing paths', diet: 'Insects flushed by grazing herds', environmentalPressures: ['Declining wild herd movement', 'Reduced insect-flushing activity'] },
    { id: 'savanna-fungi-1', kind: 'fungi', biodiversityCategory: 'fungi', name: 'Dung Fungi Patch', position: [-1, 0, -4.5], presentInYears: [1995, 2005, 2015, 2026, 2050, 2075], description: 'A patch of fungi breaking down dried herd dung scattered near a grazing path.', ecologicalRole: 'Recycles nutrients from herd dung back into the grassland soil, supporting new grass growth.', historicalChange: 'Has remained present throughout, though the dung it depends on has become less concentrated as wild herd sizes have declined.', connection: { chain: ['Herd dung', 'Fungi', 'Soil nutrients', 'Grass growth'] }, trophicRole: 'decomposer', habitat: 'Grazing paths near the acacia grove', environmentalPressures: ['Less concentrated dung as wild herd sizes decline'] },
    { id: 'savanna-rock-1', kind: 'rock', variant: 'layered', biodiversityCategory: null, name: 'Kopje Outcrop', position: [8, 0.6, -1], presentInYears: [1995, 2005, 2015, 2026, 2050, 2075], description: 'A layered rocky outcrop rising from the plain, one of the few elevated vantage points for spotting predators or prey.', ecologicalRole: 'Offers shelter for small reptiles and a lookout perch used by the secretary bird and other ground predators.', historicalChange: 'Unchanged across the simulated years.' },
    { id: 'savanna-elephant-1', kind: 'animal', biodiversityCategory: 'wildlife', name: 'African Bush Elephant', position: [-9, 0, -6], presentInYears: [1995, 2005, 2015, 2026, 2050, 2075], description: 'An elephant pushing through the acacia grove at the plain\u2019s western edge, uprooting shrubs as it browses.', ecologicalRole: 'Shapes vegetation structure across the plain by knocking down trees and shrubs, opening space for grass to grow.', historicalChange: 'Range has narrowed as fenced grazing land has closed off traditional migration corridors.', trophicRole: 'primary-consumer', habitat: 'Acacia groves and open plain', diet: 'Grasses, bark, and acacia foliage', environmentalPressures: ['Fenced grazing land blocking migration corridors', 'Human-wildlife conflict at grazing boundaries'] },
  ],
  storyChapters: [
    {
      id: 'ch1',
      title: 'The Plains',
      year: 1995,
      narration: 'In 1995, open grassland stretched to the horizon, dotted with acacia trees and termite mounds, and grazing herds moved freely across the plain.',
      focusObjectId: 'savanna-acacia-1',
    },
    {
      id: 'ch2',
      title: 'The Watering Hole',
      year: 1995,
      narration: 'The Kalahi Watering Hole drew herds from across the plain, especially through the dry season, and shaped the grassland around it.',
      focusObjectId: 'savanna-waterhole',
    },
    {
      id: 'ch3',
      title: 'The Fences',
      year: 2026,
      narration: 'Expanding livestock grazing land has fragmented the open plain, and wild herds now compete for forage and water with year-round livestock use.',
      focusObjectId: 'savanna-grazer-1',
    },
    {
      id: 'ch4',
      title: 'The Choice',
      year: 2050,
      narration: 'From here, grazing-land conversion could keep expanding, or managed grazing practices could let the plain recover. What happens next depends on that choice.',
    },
    {
      id: 'ch5',
      title: 'Two Futures',
      year: 2050,
      narration: 'Compare "Continue as Is" with "Protect & Restore" to see how different choices could shape the next 25 years of this savanna.',
      scenarioId: 'continue-as-is',
    },
  ],
};
