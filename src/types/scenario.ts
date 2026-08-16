export interface ScenarioModifiers {
  forestCoverage: number; // percentage delta, e.g. -25
  waterLevel: number;
  biodiversity: number;
  urbanDevelopment: number;
}

export interface Scenario {
  id: string;
  name: string;
  description: string;
  assumptions: string[];
  environmentalChanges: string[];
  modifiers: ScenarioModifiers;
}
