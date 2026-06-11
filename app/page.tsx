import { Editor } from '@/components/Editor';

export default function HomePage() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
      <header className="mb-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 text-sm font-bold text-white">
              OG
            </span>
            <span className="text-sm font-semibold tracking-tight text-slate-200">
              OG Image Studio
            </span>
          </div>
          <h1 className="max-w-2xl text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Design Open Graph images in your browser.
          </h1>
          <p className="max-w-2xl text-pretty text-slate-400">
            Tweak the text, gradients and image background on the left and watch the 1200×630 card
            update live. When it looks right, export a pixel-perfect PNG — everything runs locally, no
            uploads, no account.
          </p>
        </div>

        <aside className="rounded-2xl border border-white/10 bg-ink-900/60 p-5 lg:justify-self-end lg:max-w-sm">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-violet-300">
            How it works
          </h2>
          <ol className="flex flex-col gap-2.5 text-sm text-slate-300">
            <li className="flex gap-3">
              <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-violet-500/15 text-[10px] font-bold text-violet-300">1</span>
              <span>Start from a <strong className="font-semibold text-white">preset</strong> — or build blank.</span>
            </li>
            <li className="flex gap-3">
              <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-violet-500/15 text-[10px] font-bold text-violet-300">2</span>
              <span>Tweak <strong className="font-semibold text-white">text, gradients, image</strong> — the 1200×630 preview updates live.</span>
            </li>
            <li className="flex gap-3">
              <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-violet-500/15 text-[10px] font-bold text-violet-300">3</span>
              <span><strong className="font-semibold text-white">Download PNG</strong> + copy the matching meta tags.</span>
            </li>
          </ol>
          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-white/5 pt-3 text-[11px] text-slate-500">
            <span>100% client-side</span>
            <span aria-hidden>·</span>
            <span>No account</span>
            <span aria-hidden>·</span>
            <a
              href="https://github.com/kea0811/og-image-studio"
              className="text-violet-300/80 hover:text-violet-200"
              target="_blank"
              rel="noreferrer"
            >
              GitHub →
            </a>
          </div>
        </aside>
      </header>

      <Editor />

      <footer className="mt-16 border-t border-white/10 pt-6 text-sm text-slate-500">
        <p>
          Built with Next.js, React and the Canvas API. Open source under the MIT license.
        </p>
      </footer>
    </main>
  );
}
