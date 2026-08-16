import type { VaultDefinition } from '../../types/vault';
import { evergreenValleyVault } from './evergreenValley';
import { coastalWetlandVault } from './coastalWetland';
import { alpineEcosystemVault } from './alpineEcosystem';
import { grasslandSavannaVault } from './grasslandSavanna';
import { desertVault } from './desert';
import { coralReefVault } from './coralReef';
import { freshwaterLakeVault } from './freshwaterLake';
import { tropicalForestVault } from './tropicalForest';

export const vaults: Record<string, VaultDefinition> = {
  'evergreen-valley': evergreenValleyVault,
  'coastal-wetland': coastalWetlandVault,
  'alpine-ecosystem': alpineEcosystemVault,
  'grassland-savanna': grasslandSavannaVault,
  desert: desertVault,
  'coral-reef': coralReefVault,
  'freshwater-lake': freshwaterLakeVault,
  'tropical-forest': tropicalForestVault,
};

export const getVaultByEcosystemId = (id: string): VaultDefinition | undefined => vaults[id];
