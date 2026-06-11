import { Editor } from '@/components/Editor';

export default function HomePage() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
      <header className="mb-10 flex flex-col gap-3">
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
