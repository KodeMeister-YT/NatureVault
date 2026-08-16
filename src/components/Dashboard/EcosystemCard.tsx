import { useNavigate } from 'react-router-dom';
import type { Ecosystem } from '../../types/ecosystem';

const gradientByType: Record<string, string> = {
  'temperate-forest': 'from-[#0f2318] via-[#1a3324] to-[#2c4a34]',
  wetland: 'from-[#0c2226] via-[#173a3d] to-[#2c5459]',
  alpine: 'from-[#111b26] via-[#1f3040] to-[#3a5064]',
  'urban-green-space': 'from-[#16221a] via-[#233427] to-[#3c5240]',
  desert: 'from-[#3a2c18] via-[#6b4f2e] to-[#c9a877]',
  'coral-reef': 'from-[#0a2a30] via-[#155a63] to-[#e0765f]',
};

export function EcosystemCard({ ecosystem }: { ecosystem: Ecosystem }) {
  const navigate = useNavigate();
  const gradient = gradientByType[ecosystem.type] ?? gradientByType['temperate-forest'];
  const [past, ...rest] = ecosystem.availableYears;
  const future = rest[rest.length - 1];
  const present = rest[0];

  return (
    <button
      type="button"
      onClick={() => navigate(`/vault/${ecosystem.id}`)}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-vault-charcoal-soft text-left transition-transform hover:-translate-y-1 focus-visible:-translate-y-1"
    >
      <div className={`relative h-40 w-full bg-gradient-to-br ${gradient}`}>
        <span className="absolute left-4 top-4 text-3xl" aria-hidden="true">
          {ecosystem.emoji}
        </span>
        <div className="absolute inset-0 bg-gradient-to-t from-vault-charcoal-soft via-transparent to-transparent" />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h3 className="font-display text-lg text-vault-offwhite">{ecosystem.name}</h3>
          <p className="text-sm text-vault-sage-light">{ecosystem.typeLabel}</p>
        </div>
        <p className="line-clamp-2 text-sm text-vault-offwhite/60">{ecosystem.description}</p>
        <div className="mt-auto flex items-center gap-2 pt-2 text-xs font-medium text-vault-offwhite/70">
          <span>{past}</span>
          <span aria-hidden="true" className="text-vault-sage-light/60">
            →
          </span>
          <span>{present}</span>
          <span aria-hidden="true" className="text-vault-sage-light/60">
            →
          </span>
          <span>{future}</span>
        </div>
      </div>
    </button>
  );
}
