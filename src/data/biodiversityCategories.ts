import type { BiodiversityCategory } from '../types/observation';

export interface BiodiversityCategoryMeta {
  id: BiodiversityCategory;
  label: string;
  emoji: string;
  color: string;
}

export const biodiversityCategories: BiodiversityCategoryMeta[] = [
  { id: 'plants', label: 'Plants', emoji: '🌳', color: '#7c9070' },
  { id: 'birds', label: 'Birds', emoji: '🐦', color: '#d8b872' },
  { id: 'pollinators', label: 'Pollinators', emoji: '🐝', color: '#e0a83c' },
  { id: 'wildlife', label: 'Wildlife', emoji: '🦌', color: '#a8763f' },
  { id: 'water', label: 'Water', emoji: '💧', color: '#4a7c8c' },
  { id: 'fungi', label: 'Fungi', emoji: '🍄', color: '#b5568c' },
];
