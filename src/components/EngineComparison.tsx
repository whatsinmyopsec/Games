import React, { useState } from 'react';
import { ENGINE_COMPARISONS } from '../data/torchboundData';
import { Scale, Check, X, Info, HardDrive, Cpu, Zap } from 'lucide-react';

export const EngineComparison: React.FC = () => {
  const [selectedEngine, setSelectedEngine] = useState<string>(ENGINE_COMPARISONS[0].name);

  const active = ENGINE_COMPARISONS.find(e => e.name === selectedEngine) || ENGINE_COMPARISONS[0];

  return (
    <section className="rounded-2xl border border-stone-800 bg-stone-900/50 p-6 backdrop-blur space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-amber-400" />
            <h2 className="text-xl font-bold text-stone-100 font-serif">
              Desktop Packaging & Engine Benchmark
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            Why Neutralinojs beats Electron and traditional game engines in package size
          </p>
        </div>
      </div>

      {/* Visual Size Benchmark Bar Chart */}
      <div className="rounded-xl border border-stone-800 bg-stone-950/80 p-5 space-y-4">
        <h3 className="text-xs font-mono uppercase tracking-wider text-stone-400 font-semibold flex items-center justify-between">
          <span>Minimum Shipping Size for an Equivalent 2D RPG (MB)</span>
          <span className="text-emerald-400 font-bold">Lower is Better</span>
        </h3>

        <div className="space-y-3">
          {ENGINE_COMPARISONS.map(eng => {
            const isTorchbound = eng.name.includes('Neutralinojs');
            const isSelected = selectedEngine === eng.name;
            const maxMB = 450;
            const pct = Math.max(3, (eng.sizeMB / maxMB) * 100);

            return (
              <div 
                key={eng.name}
                onClick={() => setSelectedEngine(eng.name)}
                className={`group cursor-pointer rounded-lg p-2.5 transition border ${
                  isSelected 
                    ? 'bg-stone-900/90 border-amber-500/60' 
                    : 'bg-stone-900/30 border-transparent hover:border-stone-800'
                }`}
              >
                <div className="flex justify-between items-center text-xs font-mono mb-1.5">
                  <span className={`font-semibold ${isTorchbound ? 'text-amber-400 flex items-center gap-1.5' : 'text-stone-300'}`}>
                    {isTorchbound && <Zap className="h-3.5 w-3.5" />}
                    {eng.name}
                  </span>
                  <span className={`font-bold ${isTorchbound ? 'text-emerald-400' : 'text-stone-400'}`}>
                    {eng.sizeMB} MB base
                  </span>
                </div>

                <div className="h-4 w-full bg-stone-950 rounded-full overflow-hidden p-0.5 border border-stone-800/80">
                  <div
                    style={{ width: `${pct}%` }}
                    className={`h-full rounded-full transition-all duration-500 ${
                      isTorchbound 
                        ? 'bg-gradient-to-r from-emerald-500 to-amber-400' 
                        : eng.sizeMB > 150 
                        ? 'bg-rose-600/80' 
                        : 'bg-stone-600'
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Engine Deep Comparison Card */}
      <div className="rounded-xl border border-stone-800 bg-stone-950/80 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-3">
          <div>
            <span className="text-[11px] font-mono text-amber-400 font-semibold uppercase tracking-wider">
              Selected Architecture
            </span>
            <h4 className="text-lg font-bold text-stone-100 font-mono mt-0.5">
              {active.name}
            </h4>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-stone-900 border border-stone-800 text-stone-300">
              {active.runtimeType}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
          <div className="bg-stone-900/50 p-3 rounded-lg border border-stone-800">
            <span className="text-stone-400 block text-[10px]">Bundles Full Chromium?</span>
            <div className={`flex items-center gap-1.5 font-bold mt-1 ${active.bundledChromium ? 'text-rose-400' : 'text-emerald-400'}`}>
              {active.bundledChromium ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
              <span>{active.bundledChromium ? 'Yes (+150MB overhead)' : 'No (uses OS WebView2)'}</span>
            </div>
          </div>

          <div className="bg-stone-900/50 p-3 rounded-lg border border-stone-800">
            <span className="text-stone-400 block text-[10px]">Audio Storage Format</span>
            <div className="text-stone-200 font-bold mt-1">
              {active.builtInAudioFormat}
            </div>
          </div>

          <div className="bg-stone-900/50 p-3 rounded-lg border border-stone-800">
            <span className="text-stone-400 block text-[10px]">Torchbound Equivalent Size</span>
            <div className="text-amber-400 font-bold mt-1">
              {active.torchboundEquivalentSize}
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-3 text-xs">
          <div className="bg-emerald-950/20 border border-emerald-900/40 p-3 rounded-lg">
            <span className="text-emerald-400 font-semibold block text-[11px] mb-1">Key Advantages:</span>
            <p className="text-stone-300 leading-relaxed">{active.pros}</p>
          </div>
          <div className="bg-stone-900/40 border border-stone-800 p-3 rounded-lg">
            <span className="text-stone-400 font-semibold block text-[11px] mb-1">Trade-offs & Constraints:</span>
            <p className="text-stone-300 leading-relaxed">{active.cons}</p>
          </div>
        </div>
      </div>
    </section>
  );
};
