import type { AtmosphereProfile } from '../../../types/biome';
import { SkyAndClouds } from './SkyAndClouds';
import { UnderwaterAmbience } from './UnderwaterAmbience';

interface AtmosphereRendererProps {
  profile: AtmosphereProfile;
  developmentLevel?: number;
}

/**
 * Dispatches on `profile.skyTreatment` — a compile-time-exhaustive registry
 * (design.md Property 8) so a new SkyTreatment value can't ship without a
 * matching case here.
 */
const skyTreatmentRenderers: Record<
  AtmosphereProfile['skyTreatment'],
  (props: AtmosphereRendererProps) => React.JSX.Element
> = {
  'sky-and-clouds': ({ profile, developmentLevel }) => (
    <SkyAndClouds profile={profile} developmentLevel={developmentLevel} />
  ),
  'underwater-ambience': ({ developmentLevel }) => <UnderwaterAmbience developmentLevel={developmentLevel} />,
};

export function AtmosphereRenderer({ profile, developmentLevel = 0 }: AtmosphereRendererProps) {
  const Renderer = skyTreatmentRenderers[profile.skyTreatment];
  return <Renderer profile={profile} developmentLevel={developmentLevel} />;
}
