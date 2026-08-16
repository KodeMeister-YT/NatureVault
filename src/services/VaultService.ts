import { getVaultByEcosystemId } from '../data/ecosystems/vaults';
import type { VaultDefinition, VaultYearState } from '../types/vault';

export const VaultService = {
  getVault(ecosystemId: string): VaultDefinition | undefined {
    return getVaultByEcosystemId(ecosystemId);
  },
  getYearState(vault: VaultDefinition, year: number): VaultYearState {
    return vault.years.find((y) => y.year === year) ?? vault.years[0];
  },
  getObjectsForYear(vault: VaultDefinition, year: number) {
    return vault.objects.filter((o) => o.presentInYears.includes(year));
  },
  getMinMaxYear(vault: VaultDefinition): [number, number] {
    const yrs = vault.years.map((y) => y.year);
    return [Math.min(...yrs), Math.max(...yrs)];
  },
};
