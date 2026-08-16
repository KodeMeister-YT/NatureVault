import type { Scenario } from '../../types/scenario';

export const continueAsIs: Scenario = {
  id: 'continue-as-is',
  name: 'Continue as Is',
  description:
    'Development, water demand, and habitat fragmentation continue at their current pace.',
  assumptions: [
    'No new conservation policy is introduced',
    'Urban expansion continues at recent rates',
    'Precipitation patterns keep shifting seasonally',
  ],
  environmentalChanges: [
    'Further habitat loss',
    'Reduced biodiversity',
    'Lower water availability',
    'Increased urban development',
  ],
  modifiers: {
    forestCoverage: -25,
    waterLevel: -15,
    biodiversity: -20,
    urbanDevelopment: 30,
  },
};

export const protectAndRestore: Scenario = {
  id: 'protect-and-restore',
  name: 'Protect & Restore',
  description:
    'Coordinated conservation, reforestation, and water-management efforts take hold across the valley.',
  assumptions: [
    'Local conservation programs are funded and sustained',
    'Reforestation and habitat corridors are established',
    'Development is concentrated away from sensitive habitat',
  ],
  environmentalChanges: [
    'Forest restoration',
    'Healthier waterways',
    'Increased vegetation',
    'Restored habitat and more wildlife',
  ],
  modifiers: {
    forestCoverage: 15,
    waterLevel: 8,
    biodiversity: 18,
    urbanDevelopment: 5,
  },
};

export const scenarios: Scenario[] = [continueAsIs, protectAndRestore];

export const getScenarioById = (id: string): Scenario | undefined =>
  scenarios.find((s) => s.id === id);
