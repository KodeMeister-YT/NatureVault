import type { EnvironmentalObject } from '../../types/vault';
import type { BiomeStyle } from '../../types/biome';
import type { ObjectClickHandler } from '../../types/threeEvents';
import { seededRange } from '../../utils/seededRandom';
import { resolveBiomeStyle } from './resolveBiomeStyle';
import { Tree } from './Tree';
import { Rock } from './Rock';
import { Mountain } from './Mountain';
import { Building } from './Building';
import { PathRibbon } from './PathRibbon';
import { MeadowPatch } from './MeadowPatch';
import { Bird } from './Bird';
import { Animal } from './Animal';
import { Fungi } from './Fungi';
import { Pollinator } from './Pollinator';
import { ReedCluster } from './ReedCluster';
import { Frog } from './Frog';
import { Cactus } from './Cactus';
import { DryRiverbed } from './DryRiverbed';
import { Coral } from './Coral';
import { FishSchool } from './FishSchool';
import { Fern } from './Fern';
import { MossPatch } from './MossPatch';
import { FallenLog } from './FallenLog';
import { Vine } from './Vine';
import { TropicalFlower } from './TropicalFlower';
import { TermiteMound } from './TermiteMound';
import { Crab } from './Crab';
import { Turtle } from './Turtle';
import { Anemone } from './Anemone';
import { Scorpion } from './Scorpion';
import { Burrow } from './Burrow';
import { Yucca } from './Yucca';
import type { RockShape } from './Rock';

interface EnvironmentalObjectRendererProps {
  object: EnvironmentalObject;
  style: BiomeStyle;
  vegetationDensity: number;
  biodiversityLevel: number;
  developmentLevel: number;
  selected: boolean;
  dimmed: boolean;
  highlighted: boolean;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
}

const WILDLIFE_KINDS = new Set(['bird', 'animal', 'frog', 'crab', 'turtle', 'scorpion']);

// Vegetation-linked scenery objects thin out with vegetationDensity the same way
// WILDLIFE_KINDS thins out with biodiversityLevel (see seededDropoutThreshold below).
const VEGETATION_DENSITY_KINDS: Set<string> = new Set(['cactus', 'coral', 'tropicalFlower', 'termiteMound', 'anemone']);

// Shared seeded "dropout threshold" for a given position — stable across renders so the
// same object always disappears/reappears at the same density/biodiversity level rather
// than flickering, while different objects (different positions) drop out at different
// points. Used by both WILDLIFE_KINDS (gated by biodiversityLevel) and
// VEGETATION_DENSITY_KINDS (gated by vegetationDensity).
export function seededDropoutThreshold(position: [number, number, number]): number {
  return seededRange(position[0] * 13 + position[2] * 7, 0.15, 0.55);
}

export function EnvironmentalObjectRenderer({
  object,
  style,
  vegetationDensity,
  biodiversityLevel,
  developmentLevel,
  selected,
  dimmed,
  highlighted,
  onSelect,
  onHover,
}: EnvironmentalObjectRendererProps) {
  const commonHandlers: { onClick: ObjectClickHandler; onPointerOver: () => void; onPointerOut: () => void } = {
    onClick: (e) => {
      e.stopPropagation();
      onSelect(object.id);
    },
    onPointerOver: () => onHover(object.id),
    onPointerOut: () => onHover(null),
  };

  // Wildlife visibly thins out as biodiversity declines (and returns as it recovers).
  // Each wildlife object gets a stable, seeded "dropout threshold" so different
  // creatures disappear/reappear at different points rather than all at once —
  // this is what makes switching between Continue as Is and Protect & Restore
  // read as a real change in the world rather than a number changing off-screen.
  if (WILDLIFE_KINDS.has(object.kind)) {
    if (biodiversityLevel < seededDropoutThreshold(object.position)) return null;
  }

  // Vegetation-linked scenery (cacti, coral, tropical flowers, termite mounds, anemones)
  // thins out the same way, but gated by vegetationDensity instead of biodiversityLevel.
  if (VEGETATION_DENSITY_KINDS.has(object.kind)) {
    if (vegetationDensity < seededDropoutThreshold(object.position)) return null;
  }

  switch (object.kind) {
    case 'tree':
      return (
        <Tree
          position={object.position}
          seed={object.position[0] * 3 + object.position[2]}
          variant={object.variant === 'broadleaf' ? 'broadleaf' : 'conifer'}
          colorOverride={resolveBiomeStyle(style, object.kind, object.variant)?.colorPrimary}
          selected={selected}
          dimmed={dimmed}
          highlighted={highlighted}
          {...commonHandlers}
        />
      );
    case 'canopyTree':
      return (
        <Tree
          position={object.position}
          seed={object.position[0] * 3 + object.position[2]}
          variant={object.variant === 'conifer' ? 'conifer' : 'broadleaf'}
          colorOverride={resolveBiomeStyle(style, object.kind, object.variant)?.colorPrimary}
          selected={selected}
          dimmed={dimmed}
          highlighted={highlighted}
          {...commonHandlers}
        />
      );
    case 'vine':
      return (
        <Vine
          position={object.position}
          vegetationDensity={vegetationDensity}
          selected={selected}
          dimmed={dimmed}
          {...commonHandlers}
        />
      );
    case 'tropicalFlower':
      return <TropicalFlower position={object.position} selected={selected} dimmed={dimmed} {...commonHandlers} />;
    case 'termiteMound':
      return <TermiteMound position={object.position} selected={selected} dimmed={dimmed} {...commonHandlers} />;
    case 'plant':
      if (object.variant === 'yucca') {
        return <Yucca position={object.position} selected={selected} dimmed={dimmed} {...commonHandlers} />;
      }
      return (
        <>
          <MeadowPatch
            position={object.position}
            vegetationDensity={vegetationDensity}
            color={object.biodiversityCategory === 'pollinators' ? '#c9b23c' : '#8fae5c'}
            colorOverride={resolveBiomeStyle(style, object.kind, object.variant)?.colorPrimary}
            selected={selected}
            dimmed={dimmed}
            {...commonHandlers}
          />
          {object.biodiversityCategory === 'pollinators' && (
            <Pollinator
              center={object.position}
              colorOverride={resolveBiomeStyle(style, 'pollinator', object.variant)?.colorPrimary}
              selected={selected}
              dimmed={dimmed}
              {...commonHandlers}
            />
          )}
        </>
      );
    case 'pollinator':
      return (
        <Pollinator
          center={object.position}
          colorOverride={resolveBiomeStyle(style, object.kind, object.variant)?.colorPrimary}
          selected={selected}
          dimmed={dimmed}
          {...commonHandlers}
        />
      );
    case 'reed':
      return (
        <ReedCluster
          position={object.position}
          vegetationDensity={vegetationDensity}
          colorOverride={resolveBiomeStyle(style, object.kind, object.variant)?.colorPrimary}
          selected={selected}
          dimmed={dimmed}
          {...commonHandlers}
        />
      );
    case 'frog':
      return <Frog position={object.position} selected={selected} dimmed={dimmed} {...commonHandlers} />;
    case 'bird':
      return (
        <Bird
          center={object.position}
          height={object.position[1] || 3.5}
          selected={selected}
          dimmed={dimmed}
          {...commonHandlers}
        />
      );
    case 'animal':
      return <Animal position={object.position} selected={selected} dimmed={dimmed} {...commonHandlers} />;
    case 'fungi':
      return <Fungi position={object.position} selected={selected} dimmed={dimmed} {...commonHandlers} />;
    case 'rock':
      return (
        <Rock
          position={object.position}
          shape={
            object.variant === 'slab' || object.variant === 'layered' ? (object.variant as RockShape) : undefined
          }
          colorOverride={resolveBiomeStyle(style, object.kind, object.variant)?.colorPrimary}
          selected={selected}
          dimmed={dimmed}
          {...commonHandlers}
        />
      );
    case 'fern':
      return (
        <Fern
          position={object.position}
          vegetationDensity={vegetationDensity}
          selected={selected}
          dimmed={dimmed}
          {...commonHandlers}
        />
      );
    case 'moss':
      return (
        <MossPatch
          position={object.position}
          vegetationDensity={vegetationDensity}
          selected={selected}
          dimmed={dimmed}
          {...commonHandlers}
        />
      );
    case 'log':
      return (
        <FallenLog
          position={object.position}
          rotationY={seededRange(object.position[0] * 5 + object.position[2] * 3, 0, Math.PI * 2)}
          selected={selected}
          dimmed={dimmed}
          {...commonHandlers}
        />
      );
    case 'cactus':
      return <Cactus position={object.position} selected={selected} dimmed={dimmed} {...commonHandlers} />;
    case 'dryRiverbed':
      return <DryRiverbed position={object.position} selected={selected} dimmed={dimmed} {...commonHandlers} />;
    case 'coral':
      return <Coral position={object.position} selected={selected} dimmed={dimmed} {...commonHandlers} />;
    case 'anemone':
      return (
        <Anemone
          position={object.position}
          colorOverride={resolveBiomeStyle(style, object.kind, object.variant)?.colorPrimary}
          selected={selected}
          dimmed={dimmed}
          {...commonHandlers}
        />
      );
    case 'crab':
      return (
        <Crab
          position={object.position}
          colorOverride={resolveBiomeStyle(style, object.kind, object.variant)?.colorPrimary}
          selected={selected}
          dimmed={dimmed}
          {...commonHandlers}
        />
      );
    case 'turtle':
      return (
        <Turtle
          position={object.position}
          colorOverride={resolveBiomeStyle(style, object.kind, object.variant)?.colorPrimary}
          selected={selected}
          dimmed={dimmed}
          {...commonHandlers}
        />
      );
    case 'scorpion':
      return (
        <Scorpion
          position={object.position}
          colorOverride={resolveBiomeStyle(style, object.kind, object.variant)?.colorPrimary}
          selected={selected}
          dimmed={dimmed}
          {...commonHandlers}
        />
      );
    case 'burrow':
      return <Burrow position={object.position} selected={selected} dimmed={dimmed} {...commonHandlers} />;
    case 'fishSchool':
      return (
        <FishSchool
          center={object.position}
          selected={selected}
          dimmed={dimmed}
          {...commonHandlers}
        />
      );
    case 'mountain':
      return <Mountain position={object.position} />;
    case 'building':
      return (
        <Building
          position={object.position}
          scale={0.7 + developmentLevel * 0.6}
          selected={selected}
          dimmed={dimmed}
          {...commonHandlers}
        />
      );
    case 'road':
      return (
        <PathRibbon
          position={object.position}
          width={2.2}
          length={20}
          rotationY={0.3}
          color="#5a5650"
          selected={selected}
          {...commonHandlers}
        />
      );
    case 'path':
      return (
        <PathRibbon
          position={object.position}
          width={0.7}
          length={14}
          color="#a1906c"
          selected={selected}
          {...commonHandlers}
        />
      );
    default:
      return null;
  }
}
