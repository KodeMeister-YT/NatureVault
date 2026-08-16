import type { EnvironmentalObject } from '../../types/vault';
import type { ObjectClickHandler } from '../../types/threeEvents';
import { PondMarsh } from './water/PondMarsh';
import { CreekStream } from './water/CreekStream';
import { LakeShoreline } from './water/LakeShoreline';
import { Waterfall } from './water/Waterfall';

interface WaterFeatureRendererProps {
  objects: EnvironmentalObject[];
  waterLevel: number;
  selectedObjectId: string | null;
  dimmedIds?: Set<string>;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
}

const WATER_KINDS = new Set(['river', 'pond', 'creek', 'lake', 'waterfall']);

export function isWaterKindObject(object: EnvironmentalObject): boolean {
  return WATER_KINDS.has(object.kind);
}

/**
 * Dispatches each visible water-kind object to its matching variant component,
 * replacing the `river`/`pond` cases that used to live inline in
 * EnvironmentalObjectRenderer's switch. Reef's `underwater-ambient` water is
 * handled entirely by the atmosphere layer and never reaches this renderer.
 */
export function WaterFeatureRenderer({
  objects,
  waterLevel,
  selectedObjectId,
  dimmedIds,
  onSelect,
  onHover,
}: WaterFeatureRendererProps) {
  return (
    <>
      {objects.filter(isWaterKindObject).map((object) => {
        const selected = selectedObjectId === object.id;
        const dimmed = dimmedIds?.has(object.id) ?? false;
        const commonHandlers: { onClick: ObjectClickHandler; onPointerOver: () => void; onPointerOut: () => void } = {
          onClick: (e) => {
            e.stopPropagation();
            onSelect(object.id);
          },
          onPointerOver: () => onHover(object.id),
          onPointerOut: () => onHover(null),
        };

        switch (object.kind) {
          case 'river':
            return (
              <PondMarsh
                key={object.id}
                position={object.position}
                radius={object.featureRadius ?? 9}
                irregularity={0.4}
                waterLevel={waterLevel}
                color="#2b5866"
                shallowColor="#5f9aa0"
                selected={selected}
                dimmed={dimmed}
                {...commonHandlers}
              />
            );
          case 'pond':
            return (
              <PondMarsh
                key={object.id}
                position={object.position}
                radius={object.featureRadius ?? 4.5}
                irregularity={0.3}
                waterLevel={waterLevel}
                color="#336a72"
                shallowColor="#6fa8ac"
                selected={selected}
                dimmed={dimmed}
                {...commonHandlers}
              />
            );
          case 'creek':
            return (
              <CreekStream
                key={object.id}
                position={object.position}
                length={object.featureRadius ?? 9}
                waterLevel={waterLevel}
                selected={selected}
                dimmed={dimmed}
                {...commonHandlers}
              />
            );
          case 'lake':
            return (
              <LakeShoreline
                key={object.id}
                position={object.position}
                radius={object.featureRadius ?? 14}
                waterLevel={waterLevel}
                selected={selected}
                dimmed={dimmed}
                {...commonHandlers}
              />
            );
          case 'waterfall':
            return (
              <Waterfall
                key={object.id}
                position={object.position}
                height={object.featureRadius ?? 6}
                waterLevel={waterLevel}
                selected={selected}
                dimmed={dimmed}
                {...commonHandlers}
              />
            );
          default:
            return null;
        }
      })}
    </>
  );
}
