import { ecosystems, getEcosystemById, featuredEcosystem } from '../data/ecosystems';
import type { Ecosystem } from '../types/ecosystem';

export const EcosystemService = {
  getAll(): Ecosystem[] {
    return ecosystems;
  },
  getById(id: string): Ecosystem | undefined {
    return getEcosystemById(id);
  },
  getFeatured(): Ecosystem {
    return featuredEcosystem;
  },
};
