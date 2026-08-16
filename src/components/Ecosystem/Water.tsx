import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { ObjectClickHandler } from '../../types/threeEvents';
import { seededRange } from '../../utils/seededRandom';

interface WaterProps {
  position: [number, number, number];
  /** Average radius of the water body, in scene units. */
  radius: number;
  /** How irregular the shoreline is, 0 = perfect circle, 1 = very jagged. */
  irregularity?: number;
  waterLevel: number; // 0-1, drives visible size/opacity
  color?: string;
  shallowColor?: string;
  selected?: boolean;
  dimmed?: boolean;
  onClick?: ObjectClickHandler;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
}

// NOTE: THREE.ShapeGeometry does not normalize UVs to [0,1] — it uses the
// shape's own local coordinates directly. The shape here is built with an
// average radius of 1 (see buildIrregularShape), so local position.xy already
// ranges roughly -1..1, which is exactly what we want for a center-to-edge
// distance falloff. We pass local position through instead of uv.
const vertexShader = `
  uniform float uTime;
  varying vec2 vLocalPos;
  void main() {
    vLocalPos = position.xy;
    vec3 pos = position;
    pos.z += sin(pos.x * 1.6 + uTime * 1.1) * 0.05 + cos(pos.y * 2.1 + uTime * 0.75) * 0.04;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  uniform vec3 uDeepColor;
  uniform vec3 uShallowColor;
  uniform float uOpacity;
  uniform float uTime;
  varying vec2 vLocalPos;
  void main() {
    float dist = length(vLocalPos);
    float shimmer = 0.05 * sin(vLocalPos.x * 12.0 + uTime * 1.4) * sin(vLocalPos.y * 12.0 - uTime * 1.0);
    // Shallower (closer to shore, larger dist) reads lighter/sandier; deep center reads darker blue.
    // Note: no radial edge-fade here — ShapeGeometry only has vertices on the
    // shape's boundary contour (ear-clip triangulation, no interior grid), so a
    // dist-based fade would interpolate unpredictably across large boundary-to-
    // boundary triangles and can blank out most of the surface. The irregular
    // shoreline is already defined by the geometry's outline itself.
    vec3 base = mix(uDeepColor, uShallowColor, smoothstep(0.2, 0.95, dist));
    vec3 color = base + shimmer;
    gl_FragColor = vec4(color, uOpacity);
  }
`;

/** Builds an organic, irregular blob outline (used for pond/wetland shorelines) instead of a rectangle. */
function buildIrregularShape(radius: number, irregularity: number, seed: number): THREE.Shape {
  const shape = new THREE.Shape();
  const points = 16;
  const coords: [number, number][] = [];
  for (let i = 0; i < points; i++) {
    const angle = (i / points) * Math.PI * 2;
    const noise = seededRange(seed + i * 3.3, 1 - irregularity * 0.5, 1 + irregularity * 0.5);
    const r = radius * noise;
    coords.push([Math.cos(angle) * r, Math.sin(angle) * r]);
  }
  shape.moveTo(coords[0][0], coords[0][1]);
  for (let i = 1; i <= points; i++) {
    const [cx, cy] = coords[i % points];
    const [px, py] = coords[(i - 1 + points) % points];
    const mx = (px + cx) / 2;
    const my = (py + cy) / 2;
    shape.quadraticCurveTo(px, py, mx, my);
  }
  return shape;
}

export function Water({
  position,
  radius,
  irregularity = 0.35,
  waterLevel,
  color = '#2f6070',
  shallowColor = '#6fa8ac',
  selected,
  dimmed,
  onClick,
  onPointerOver,
  onPointerOut,
}: WaterProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const geometry = useMemo(() => {
    const shape = buildIrregularShape(1, irregularity, position[0] * 7 + position[2] * 3);
    const geo = new THREE.ShapeGeometry(shape, 24);
    return geo;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [irregularity, position]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uDeepColor: { value: new THREE.Color(selected ? '#6fb0c4' : color) },
      uShallowColor: { value: new THREE.Color(shallowColor) },
      uOpacity: { value: dimmed ? 0.25 : 0.88 },
    }),
    [color, shallowColor, selected, dimmed],
  );

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  const scale = radius * (0.85 + waterLevel * 0.3);

  return (
    <mesh
      position={[position[0], position[1] - 0.08, position[2]]}
      rotation={[-Math.PI / 2, 0, 0]}
      scale={[scale, scale, 1]}
      geometry={geometry}
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
