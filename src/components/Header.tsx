import React, { useState } from 'react';
import { Flame, ExternalLink, Download, Sparkles, HardDrive, Cpu, Music, Github, X, Check, Copy, Terminal } from 'lucide-react';

export const Header: React.FC = () => {
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };
  return (
    <header className="relative border-b border-amber-900/40 bg-radial from-amber-950/30 via-stone-950 to-stone-950 pb-8 pt-8">
      {/* Ambient background torch glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-600/10 blur-3xl" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-950/50 px-3 py-1 text-xs font-mono text-amber-300">
              <Flame className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
              <span>CASE STUDY: TORCHBOUND ARCHITECTURE</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-stone-100 font-serif">
              Why Is This Game <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500">So Tiny?</span>
            </h1>

            <p className="max-w-2xl text-stone-300 text-sm sm:text-base leading-relaxed">
              When players visit <code className="text-amber-300 bg-stone-900 px-1.5 py-0.5 rounded border border-stone-800 text-xs">torchbound-duk.pages.dev/download/</code>, they see a complete co-op dungeon crawl RPG packaged as a 
              <strong className="text-amber-400 font-semibold"> 13.2 MB zip</strong>. Stripped of two video cutscenes, the playable game logic, bosses, audio, and graphics weigh <strong className="text-amber-400 font-semibold">just 1.01 MB</strong>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 self-start md:self-center">
            <button
              onClick={() => setShowDeployModal(true)}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-purple-500/40 bg-purple-950/40 px-4 py-2.5 text-sm font-medium text-purple-200 hover:bg-purple-900/40 hover:border-purple-400 transition cursor-pointer shadow-lg shadow-purple-950/30"
            >
              <Github className="h-4 w-4 text-purple-400" />
              <span>Deploy to GitHub Pages</span>
            </button>

            <a
              href="https://torchbound-duk.pages.dev/download/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-amber-500/40 bg-amber-600/20 px-4 py-2.5 text-sm font-medium text-amber-200 hover:bg-amber-600/30 hover:border-amber-400 transition shadow-lg shadow-amber-950/40"
            >
              <Download className="h-4 w-4 text-amber-400" />
              <span>Target Download</span>
              <ExternalLink className="h-3.5 w-3.5 opacity-70" />
            </a>

            <a
              href="https://torchbound-duk.pages.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-stone-800 bg-stone-900/80 px-4 py-2.5 text-sm font-medium text-stone-300 hover:bg-stone-800 transition"
            >
              <span>Play Web Game</span>
              <ExternalLink className="h-3.5 w-3.5 opacity-70" />
            </a>
          </div>
        </div>

        {/* Quick KPI ticker */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-3.5 backdrop-blur">
            <div className="flex items-center gap-2 text-stone-400 text-xs font-mono">
              <HardDrive className="h-4 w-4 text-amber-400" />
              <span>Full Windows Zip</span>
            </div>
            <div className="mt-1 text-2xl font-bold text-amber-200 font-mono">13.2 MB</div>
            <div className="text-[11px] text-stone-400 mt-0.5">89% is MP4 video cutscenes</div>
          </div>

          <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-3.5 backdrop-blur">
            <div className="flex items-center gap-2 text-stone-400 text-xs font-mono">
              <Cpu className="h-4 w-4 text-emerald-400" />
              <span>Game Core (game.html)</span>
            </div>
            <div className="mt-1 text-2xl font-bold text-emerald-300 font-mono">1.01 MB</div>
            <div className="text-[11px] text-stone-400 mt-0.5">~298 KB gzipped over CDN</div>
          </div>

          <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-3.5 backdrop-blur">
            <div className="flex items-center gap-2 text-stone-400 text-xs font-mono">
              <Music className="h-4 w-4 text-cyan-400" />
              <span>Shipped Audio Files</span>
            </div>
            <div className="mt-1 text-2xl font-bold text-cyan-300 font-mono">0 Bytes</div>
            <div className="text-[11px] text-stone-400 mt-0.5">100% procedural Web Audio</div>
          </div>

          <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-3.5 backdrop-blur">
            <div className="flex items-center gap-2 text-stone-400 text-xs font-mono">
              <Sparkles className="h-4 w-4 text-purple-400" />
              <span>Engine Overhead</span>
            </div>
            <div className="mt-1 text-2xl font-bold text-purple-300 font-mono">1.15 MB</div>
            <div className="text-[11px] text-stone-400 mt-0.5">Neutralinojs vs 180MB Electron</div>
          </div>
        </div>
      </div>

      {/* GitHub Pages Deployment Modal */}
      {showDeployModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl rounded-2xl border border-stone-800 bg-stone-950 p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-stone-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-purple-950/60 border border-purple-800/40 text-purple-400">
                  <Github className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-stone-100 font-serif">
                    Deploy to GitHub Pages
                  </h3>
                  <p className="text-xs text-stone-400 font-mono">
                    Pre-configured with GitHub Actions & relative Vite assets
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowDeployModal(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-900 transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-stone-300">
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3.5 space-y-1">
                <span className="font-semibold text-emerald-300 flex items-center gap-1.5 text-xs font-mono">
                  <Check className="h-4 w-4 text-emerald-400" />
                  <span>Already Configured in Codebase:</span>
                </span>
                <p className="text-xs text-stone-300">
                  <code className="text-emerald-300 font-mono">.github/workflows/deploy.yml</code> and <code className="text-emerald-300 font-mono">base: &apos;./&apos;</code> in <code className="text-stone-300 font-mono">vite.config.ts</code> are ready. When pushed, GitHub Actions will build and deploy automatically!
                </p>
              </div>

              <div className="space-y-2">
                <span className="font-semibold text-stone-200 block text-xs font-mono uppercase tracking-wide">
                  Step 1: Create a Repository on GitHub
                </span>
                <p className="text-xs text-stone-400">
                  Go to <a href="https://github.com/new" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline inline-flex items-center gap-1">github.com/new <ExternalLink className="h-3 w-3 inline" /></a> and create a public or private repository (e.g. <code className="text-stone-300 font-mono">torchbound-explainer</code>).
                </p>
              </div>

              <div className="space-y-2">
                <span className="font-semibold text-stone-200 block text-xs font-mono uppercase tracking-wide">
                  Step 2: Add Remote & Push from your Terminal
                </span>
                <div className="relative rounded-xl border border-stone-800 bg-stone-900/90 p-3 font-mono text-xs text-stone-200 space-y-1">
                  <button
                    onClick={() => copyToClipboard('git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git\ngit branch -M main\ngit push -u origin main', 'push')}
                    className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-[11px] text-stone-300 border border-stone-700 transition flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedCmd === 'push' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 text-stone-400" />}
                    <span>{copiedCmd === 'push' ? 'Copied!' : 'Copy'}</span>
                  </button>
                  <p className="text-stone-400"># Replace YOUR_USERNAME and YOUR_REPO:</p>
                  <p className="text-amber-300">git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git</p>
                  <p className="text-amber-300">git branch -M main</p>
                  <p className="text-amber-300">git push -u origin main</p>
                </div>
              </div>

              <div className="space-y-2">
                <span className="font-semibold text-stone-200 block text-xs font-mono uppercase tracking-wide">
                  Step 3: Enable GitHub Pages in Repo Settings
                </span>
                <p className="text-xs text-stone-400 leading-relaxed">
                  In your repository: <strong>Settings &rarr; Pages &rarr; Source &rarr; Select &quot;GitHub Actions&quot;</strong>.
                  Within 60 seconds, GitHub will publish your live website at:
                  <code className="text-emerald-400 bg-stone-900 px-1.5 py-0.5 rounded border border-stone-800 ml-1">
                    https://YOUR_USERNAME.github.io/YOUR_REPO/
                  </code>
                </p>
              </div>

              <div className="rounded-xl border border-stone-800 bg-stone-900/40 p-3 text-xs text-stone-400">
                <p>
                  💡 <strong>Want the AI to push directly?</strong> Reply with your repository URL (e.g., <code className="text-stone-300 font-mono">https://github.com/username/repo</code>). If authentication is needed, you can provide a GitHub personal access token with <code className="text-stone-300 font-mono">repo</code> scope.
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-stone-800">
              <button
                onClick={() => setShowDeployModal(false)}
                className="px-4 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-mono transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
