export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-6 px-6 text-center">
      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-widest text-violet-300">
        Work in progress
      </span>
      <h1 className="bg-gradient-to-br from-white to-slate-400 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-6xl">
        OG Image Studio
      </h1>
      <p className="max-w-xl text-balance text-lg text-slate-400">
        A visual editor for Open Graph images — text, gradients, image
        backgrounds and one-click PNG export. The canvas is being wired up.
      </p>
    </main>
  );
}
