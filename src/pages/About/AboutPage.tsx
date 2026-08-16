import { AppLayout } from '../../components/Navigation/AppLayout';

export function AboutPage() {
  return (
    <AppLayout>
      <section className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="font-display text-3xl text-vault-offwhite sm:text-4xl">
          An interactive time machine for ecosystems.
        </h1>
        <p className="mt-6 text-vault-offwhite/75">
          Environmental information is often presented as statistics that feel distant and abstract — a
          percentage lost, a chart trending downward. NatureVault starts from a different idea: people care more
          about places they can understand and experience.
        </p>
        <p className="mt-4 text-vault-offwhite/75">
          Instead of reading that a forest lost cover, you can step into a 3D reconstruction of that forest,
          look around, and see the difference for yourself — across its past, present, and possible futures.
        </p>
        <p className="mt-4 text-vault-offwhite/75">
          NatureVault combines 3D spatial reconstruction, interactive timelines, environmental storytelling, and
          illustrative scenario visualization. The goal isn't to replace nature with technology — it's to use
          technology to make people care enough to go experience the real thing.
        </p>
        <blockquote className="mt-8 border-l-2 border-vault-gold/60 pl-4 font-display text-xl text-vault-offwhite/90">
          We don't want people to just read about what we're losing. We want them to step inside it.
        </blockquote>
      </section>
    </AppLayout>
  );
}
