/// <reference types="node" />
import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Validates: Requirements 6.5, 10.2
 *
 * The Urban Green Space biome was renamed to Grassland/Savanna (task 34) and
 * its old data file deleted. This walks every `.ts`/`.tsx` file under `src/`
 * (skipping `.test.ts` files and anything under `node_modules`) and asserts
 * none contain the literal string `urban-green-space`, so a future regression
 * (a stray import, a leftover key, a copy-pasted reference) is caught
 * automatically rather than relying on a one-time manual grep.
 */
const currentDir = dirname(fileURLToPath(import.meta.url));
const SRC_ROOT = join(currentDir, '..', '..');

function walk(dir: string, files: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules') continue;
    const fullPath = join(dir, entry);
    const stats = statSync(fullPath);
    if (stats.isDirectory()) {
      walk(fullPath, files);
    } else if (/\.tsx?$/.test(entry) && !entry.endsWith('.test.ts') && !entry.endsWith('.test.tsx')) {
      files.push(fullPath);
    }
  }
  return files;
}

describe('urban-green-space removal', () => {
  it('no source file under src/ contains the literal string "urban-green-space"', () => {
    const files = walk(SRC_ROOT);
    const offenders: string[] = [];

    for (const file of files) {
      const content = readFileSync(file, 'utf-8');
      if (content.includes('urban-green-space')) {
        offenders.push(file);
      }
    }

    expect(offenders, `found lingering "urban-green-space" references in: ${offenders.join(', ')}`).toHaveLength(0);
  });
});
