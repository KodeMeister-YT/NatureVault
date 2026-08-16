import type { EnvironmentalObject } from '../../types/vault';
import type { ObjectClickHandler } from '../../types/threeEvents';
import { seededRange } from '../../utils/seededRandom';
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

interface EnvironmentalObjectRendererProps {
  object: EnvironmentalObject;
  vegetationDensity: number;
  biodiversityLevel: number;
  developmentLevel: number;
  selected: boolean;
  dimmed: boolean;
  highlighted: boolean;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
}

const WILDLIFE_KINDS = new Set(['bird', 'animal', 'frog']);

export function EnvironmentalObjectRenderer({
  object,
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
    const threshold = seededRange(object.position[0] * 13 + object.position[2] * 7, 0.15, 0.55);
    if (biodiversityLevel < threshold) return null;
  }

  switch (object.kind) {
    case 'tree':
      return (
        <Tree
          position={object.position}
          seed={object.position[0] * 3 + object.position[2]}
          variant={object.variant === 'broadleaf' ? 'broadleaf' : 'conifer'}
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
      return (
        <>
          <MeadowPatch
            position={object.position}
            vegetationDensity={vegetationDensity}
            color={object.biodiversityCategory === 'pollinators' ? '#c9b23c' : '#8fae5c'}
            selected={selected}
            dimmed={dimmed}
            {...commonHandlers}
          />
          {object.biodiversityCategory === 'pollinators' && (
            <Pollinator center={object.position} selected={selected} dimmed={dimmed} {...commonHandlers} />
          )}
        </>
      );
    case 'pollinator':
      return <Pollinator center={object.position} selected={selected} dimmed={dimmed} {...commonHandlers} />;
    case 'reed':
      return (
        <ReedCluster
          position={object.position}
          vegetationDensity={vegetationDensity}
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
      return <Rock position={object.position} selected={selected} dimmed={dimmed} {...commonHandlers} />;
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
