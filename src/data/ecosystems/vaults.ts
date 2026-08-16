import type { VaultDefinition } from '../../types/vault';
import { evergreenValleyVault } from './evergreenValley';
import { coastalWetlandVault } from './coastalWetland';
import { alpineEcosystemVault } from './alpineEcosystem';
import { urbanGreenSpaceVault } from './urbanGreenSpace';

export const vaults: Record<string, VaultDefinition> = {
  'evergreen-valley': evergreenValleyVault,
  'coastal-wetland': coastalWetlandVault,
  'alpine-ecosystem': alpineEcosystemVault,
  'urban-green-space': urbanGreenSpaceVault,
};

export const getVaultByEcosystemId = (id: string): VaultDefinition | undefined => vaults[id];
