import type { Ecosystem } from '../../types/ecosystem';

export const ecosystems: Ecosystem[] = [
  {
    id: 'evergreen-valley',
    name: 'Pacific Northwest Forest',
    type: 'temperate-forest',
    typeLabel: 'Temperate Forest',
    location: 'Evergreen Valley, Oregon',
    description:
      'A continuous conifer forest carved by a winding river, transformed over three decades by roads, development, and shifting rainfall.',
    availableYears: [1995, 2026, 2050],
    heroImage: 'forest',
    emoji: '🌲',
    featured: true,
    environmentalIndicators: [
      { label: 'Forest Coverage', value: 62, unit: '%' },
      { label: 'Water Quality', value: 58, unit: '%' },
      { label: 'Biodiversity Index', value: 55, unit: '%' },
    ],
  },
  {
    id: 'coastal-wetland',
    name: 'Coastal Wetland',
    type: 'wetland',
    typeLabel: 'Wetland Ecosystem',
    location: 'Siuslaw Estuary, Oregon Coast',
    description:
      'A tidal wetland that filters runoff and shelters migratory birds, gradually reshaped by drainage and coastal development.',
    availableYears: [1980, 2026, 2050],
    heroImage: 'wetland',
    emoji: '🌊',
    environmentalIndicators: [
      { label: 'Wetland Area', value: 47, unit: '%' },
      { label: 'Water Quality', value: 52, unit: '%' },
      { label: 'Biodiversity Index', value: 60, unit: '%' },
    ],
  },
  {
    id: 'alpine-ecosystem',
    name: 'Alpine Ecosystem',
    type: 'alpine',
    typeLabel: 'Mountain Environment',
    location: 'Cascade Range, Oregon',
    description:
      'A high-elevation ecosystem where receding snowpack and treeline shifts are reshaping alpine meadows and streams.',
    availableYears: [2000, 2026, 2050],
    heroImage: 'alpine',
    emoji: '🏔️',
    environmentalIndicators: [
      { label: 'Snowpack', value: 41, unit: '%' },
      { label: 'Alpine Vegetation', value: 66, unit: '%' },
      { label: 'Biodiversity Index', value: 58, unit: '%' },
    ],
  },
  {
    id: 'grassland-savanna',
    name: 'Kalahi Plains Savanna',
    type: 'savanna',
    typeLabel: 'Savanna Ecosystem',
    location: 'Kalahi Plains, East African Savanna',
    description:
      'Open grassland dotted with acacia trees and termite mounds, where expanding livestock grazing land is gradually fragmenting the plain and its watering hole.',
    availableYears: [1995, 2015, 2026, 2050],
    heroImage: 'savanna',
    emoji: '🦓',
    environmentalIndicators: [
      { label: 'Grassland Cover', value: 46, unit: '%' },
      { label: 'Watering Hole Level', value: 42, unit: '%' },
      { label: 'Biodiversity Index', value: 44, unit: '%' },
    ],
  },
  {
    id: 'desert',
    name: 'Painted Basin Desert',
    type: 'desert',
    typeLabel: 'Desert Ecosystem',
    location: 'Painted Basin, Southern Oregon High Desert',
    description:
      'A sparse but resilient desert basin where cacti and a dry wash hold on against a dropping water table.',
    availableYears: [1985, 2005, 2026, 2050],
    heroImage: 'desert',
    emoji: '🌵',
    environmentalIndicators: [
      { label: 'Vegetation Density', value: 17, unit: '%' },
      { label: 'Groundwater Level', value: 22, unit: '%' },
      { label: 'Biodiversity Index', value: 30, unit: '%' },
    ],
  },
  {
    id: 'coral-reef',
    name: 'Lantern Cay Reef',
    type: 'coral-reef',
    typeLabel: 'Coral Reef Ecosystem',
    location: 'Lantern Cay, Tropical Pacific',
    description:
      'A vibrant reef community facing warming water and bleaching, where coral clusters and fish schools tell the story of a changing ocean.',
    availableYears: [1990, 2010, 2026, 2050],
    heroImage: 'reef',
    emoji: '🐠',
    environmentalIndicators: [
      { label: 'Live Coral Cover', value: 48, unit: '%' },
      { label: 'Water Clarity', value: 78, unit: '%' },
      { label: 'Biodiversity Index', value: 50, unit: '%' },
    ],
  },
  {
    id: 'freshwater-lake',
    name: 'Freshwater Lake',
    type: 'lake',
    typeLabel: 'Lake Ecosystem',
    location: 'Cobalt Lake, Central Oregon',
    description:
      'A calm freshwater lake ringed by shoreline forest, where decades of downstream water withdrawal are slowly reshaping the shore.',
    availableYears: [1990, 2010, 2026, 2050],
    heroImage: 'lake',
    emoji: '🏞️',
    environmentalIndicators: [
      { label: 'Water Level', value: 62, unit: '%' },
      { label: 'Shoreline Vegetation', value: 60, unit: '%' },
      { label: 'Biodiversity Index', value: 52, unit: '%' },
    ],
  },
  {
    id: 'tropical-forest',
    name: 'Río Esmeralda Rainforest',
    type: 'tropical-forest',
    typeLabel: 'Tropical Rainforest',
    location: 'Río Esmeralda Reserve, Central America',
    description:
      'A dense, humid rainforest canopy fed by a year-round waterfall, where selective logging along the reserve edge is gradually thinning the outer canopy.',
    availableYears: [1995, 2015, 2026, 2050],
    heroImage: 'tropical-forest',
    emoji: '🌴',
    environmentalIndicators: [
      { label: 'Canopy Cover', value: 60, unit: '%' },
      { label: 'Waterfall Flow', value: 70, unit: '%' },
      { label: 'Biodiversity Index', value: 55, unit: '%' },
    ],
  },
];

export const getEcosystemById = (id: string): Ecosystem | undefined =>
  ecosystems.find((e) => e.id === id);

export const featuredEcosystem = ecosystems.find((e) => e.featured) ?? ecosystems[0];
