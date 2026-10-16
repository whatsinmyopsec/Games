import React, { useState } from 'react';
import { CODE_SNIPPETS } from '../data/torchboundData';
import { Code, Check, Copy, Sparkles, BookOpen } from 'lucide-react';

export const SourceCodeInspector: React.FC = () => {
  const [selectedSnippetId, setSelectedSnippetId] = useState<string>(CODE_SNIPPETS[0].id);
  const [copied, setCopied] = useState(false);

  const activeSnippet = CODE_SNIPPETS.find(s => s.id === selectedSnippetId) || CODE_SNIPPETS[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(activeSnippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="rounded-2xl border border-stone-800 bg-stone-900/50 p-6 backdrop-blur space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Code className="h-5 w-5 text-amber-400" />
            <h2 className="text-xl font-bold text-stone-100 font-serif">
              Deconstructed Source Code Patterns
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            Real code mechanisms extracted from Torchbound's production bundle
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 rounded-lg border border-stone-700 bg-stone-800 px-3 py-1.5 text-xs font-mono font-medium text-stone-200 hover:bg-stone-700 transition cursor-pointer self-start sm:self-auto"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 text-stone-400" />}
          <span>{copied ? 'Copied Snippet!' : 'Copy Code'}</span>
        </button>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Snippet selector tabs */}
        <div className="lg:col-span-4 space-y-2">
          {CODE_SNIPPETS.map(snippet => {
            const isSelected = snippet.id === selectedSnippetId;
            return (
              <button
                key={snippet.id}
                onClick={() => setSelectedSnippetId(snippet.id)}
                className={`w-full p-3 rounded-xl border text-left transition flex flex-col gap-1 cursor-pointer ${
                  isSelected 
                    ? 'bg-amber-950/40 border-amber-500/60 shadow-lg shadow-amber-950/40' 
                    : 'bg-stone-950/60 border-stone-800/80 hover:bg-stone-800/40 text-stone-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wide">
                    {snippet.category}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-900/50">
                    {snippet.savedMegabytes}
                  </span>
                </div>
                <h4 className={`text-xs font-bold font-mono mt-0.5 ${isSelected ? 'text-amber-200' : 'text-stone-300'}`}>
                  {snippet.title}
                </h4>
              </button>
            );
          })}
        </div>

        {/* Code View & Explanation */}
        <div className="lg:col-span-8 space-y-4">
          <div className="rounded-xl border border-stone-800 bg-stone-950 overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between bg-stone-900/80 px-4 py-2.5 border-b border-stone-800">
              <span className="text-xs font-mono text-stone-300 font-semibold flex items-center gap-2">
                <BookOpen className="h-3.5 w-3.5 text-amber-400" />
                <span>{activeSnippet.title}</span>
              </span>
              <span className="text-[11px] font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                {activeSnippet.savedMegabytes}
              </span>
            </div>

            <pre className="p-4 text-xs font-mono text-stone-200 overflow-x-auto leading-relaxed max-h-96">
              <code>{activeSnippet.code}</code>
            </pre>
          </div>

          {/* Explanation bullets */}
          <div className="rounded-xl border border-stone-800 bg-stone-950/70 p-4 space-y-2">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-amber-400 block">
              Why This Architecture Saves Massive Megabytes:
            </span>
            <ul className="space-y-1.5 text-xs text-stone-300">
              {activeSnippet.explanation.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-400 font-mono text-sm leading-none">•</span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
