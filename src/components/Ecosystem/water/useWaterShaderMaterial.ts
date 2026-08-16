import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export type FlowAxis = 'radial' | 'vertical';

interface UseWaterShaderMaterialOptions {
  deepColor: string;
  shallowColor: string;
  selected?: boolean;
  dimmed?: boolean;
  /** 'vertical' scrolls shimmer along local Y instead of a radial center-out gradient (used by Waterfall). */
  flowAxis?: FlowAxis;
  /** Multiplies the shimmer scroll speed; lets Waterfall/CreekStream read faster than a still pond. */
  flowSpeed?: number;
}

// NOTE: THREE.ShapeGeometry does not normalize UVs to [0,1] — it uses the
// shape's own local coordinates directly. Shapes built by these water variants
// use an average radius/half-extent of 1, so local position.xy already ranges
// roughly -1..1, which is exactly what we want for a center-to-edge distance
// falloff. We pass local position through instead of uv.
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

const radialFragmentShader = `
  uniform vec3 uDeepColor;
  uniform vec3 uShallowColor;
  uniform float uOpacity;
  uniform float uTime;
  uniform float uFlowSpeed;
  varying vec2 vLocalPos;
  void main() {
    float dist = length(vLocalPos);
    float shimmer = 0.05 * sin(vLocalPos.x * 12.0 + uTime * uFlowSpeed * 1.4) * sin(vLocalPos.y * 12.0 - uTime * uFlowSpeed * 1.0);
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

// Directional one-way scroll along local Y — used by CreekStream (gentle) and
// Waterfall (fast) to read as flowing rather than a still pond.
const directionalFragmentShader = `
  uniform vec3 uDeepColor;
  uniform vec3 uShallowColor;
  uniform float uOpacity;
  uniform float uTime;
  uniform float uFlowSpeed;
  varying vec2 vLocalPos;
  void main() {
    float scroll = fract(vLocalPos.y * 3.0 - uTime * uFlowSpeed);
    float shimmer = 0.06 * sin(scroll * 18.0) * sin(vLocalPos.x * 10.0 + uTime * uFlowSpeed * 0.5);
    float edge = smoothstep(0.0, 1.0, abs(vLocalPos.x));
    vec3 base = mix(uDeepColor, uShallowColor, edge);
    vec3 color = base + shimmer;
    gl_FragColor = vec4(color, uOpacity);
  }
`;

/**
 * Shared water shader/material hook — extracted from the original single-purpose
 * Water.tsx so every water variant (PondMarsh, CreekStream, LakeShoreline,
 * Waterfall) uses one GLSL implementation instead of copy-pasted shader source.
 */
export function useWaterShaderMaterial({
  deepColor,
  shallowColor,
  selected,
  dimmed,
  flowAxis = 'radial',
  flowSpeed = 1,
}: UseWaterShaderMaterialOptions) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uDeepColor: { value: new THREE.Color(selected ? '#6fb0c4' : deepColor) },
      uShallowColor: { value: new THREE.Color(shallowColor) },
      uOpacity: { value: dimmed ? 0.25 : 0.88 },
      uFlowSpeed: { value: flowSpeed },
    }),
    [deepColor, shallowColor, selected, dimmed, flowSpeed],
  );

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  const fragmentShader = flowAxis === 'vertical' ? directionalFragmentShader : radialFragmentShader;

  return { materialRef, uniforms, vertexShader, fragmentShader };
}
