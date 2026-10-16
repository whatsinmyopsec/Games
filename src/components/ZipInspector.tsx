import React, { useState } from 'react';
import { ZIP_FILE_BREAKDOWN, TORCHBOUND_STATS } from '../data/torchboundData';
import { FileVideo, Binary, FileCode, Package, Layers, Info, CheckCircle2 } from 'lucide-react';

export const ZipInspector: React.FC = () => {
  const [excludeCutscenes, setExcludeCutscenes] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(ZIP_FILE_BREAKDOWN[0].name);

  const displayedFiles = excludeCutscenes 
    ? ZIP_FILE_BREAKDOWN.filter(f => f.category !== 'video') 
    : ZIP_FILE_BREAKDOWN;

  const totalBytes = displayedFiles.reduce((acc, f) => acc + f.sizeBytes, 0);
  const activeFileInfo = ZIP_FILE_BREAKDOWN.find(f => f.name === selectedFile) || displayedFiles[0];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'video': return 'bg-amber-500/80 hover:bg-amber-500 border-amber-400 text-amber-950';
      case 'executable': return 'bg-purple-500/80 hover:bg-purple-500 border-purple-400 text-purple-950';
      case 'game-core': return 'bg-emerald-500/80 hover:bg-emerald-500 border-emerald-400 text-emerald-950';
      case 'assets': return 'bg-blue-500/80 hover:bg-blue-500 border-blue-400 text-blue-950';
      case 'config': return 'bg-stone-500/80 hover:bg-stone-500 border-stone-400 text-stone-950';
      default: return 'bg-stone-700 text-stone-200';
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'video': return { label: 'Video Cutscene', color: 'bg-amber-950/70 text-amber-300 border-amber-600/40' };
      case 'executable': return { label: 'Native Launcher', color: 'bg-purple-950/70 text-purple-300 border-purple-600/40' };
      case 'game-core': return { label: 'Entire Game Core', color: 'bg-emerald-950/70 text-emerald-300 border-emerald-600/40' };
      case 'assets': return { label: 'Icons & Favicons', color: 'bg-blue-950/70 text-blue-300 border-blue-600/40' };
      case 'config': return { label: 'Config & Glue', color: 'bg-stone-800 text-stone-300 border-stone-700' };
      default: return { label: 'Other', color: 'bg-stone-800 text-stone-300 border-stone-700' };
    }
  };

  const getIcon = (category: string) => {
    switch (category) {
      case 'video': return <FileVideo className="h-4 w-4" />;
      case 'executable': return <Binary className="h-4 w-4" />;
      case 'game-core': return <FileCode className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  return (
    <section className="rounded-2xl border border-stone-800 bg-stone-900/50 p-6 backdrop-blur space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-amber-400" />
            <h2 className="text-xl font-bold text-stone-100 font-serif">
              Anatomy of the 13.2 MB Download
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            Byte-level inspection of <code className="text-stone-300">Torchbound-Windows.zip</code> from the official release page
          </p>
        </div>

        {/* Cutscene toggle switch */}
        <div className="flex items-center gap-3 bg-stone-950/80 p-1.5 rounded-xl border border-stone-800">
          <span className="text-xs font-medium text-stone-400 pl-2">View:</span>
          <button
            onClick={() => setExcludeCutscenes(false)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              !excludeCutscenes 
                ? 'bg-amber-500 text-stone-950 shadow font-semibold' 
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Full Download (13.8 MB)
          </button>
          <button
            onClick={() => setExcludeCutscenes(true)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              excludeCutscenes 
                ? 'bg-emerald-500 text-stone-950 shadow font-semibold' 
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Without Cutscenes (1.4 MB)
          </button>
        </div>
      </div>

      {/* Revelation Alert Box */}
      <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 text-xs sm:text-sm text-stone-300 space-y-2">
        <div className="flex items-center gap-2 font-semibold text-amber-300">
          <Info className="h-4 w-4 shrink-0 text-amber-400" />
          <span>The 89% Cutscene Secret</span>
        </div>
        <p className="leading-relaxed">
          When decompressing <code className="text-amber-200 font-mono">Torchbound-Windows.zip</code>, the total uncompressed size is <strong>16.2 MB</strong>. 
          However, <strong>12.3 MB (76%)</strong> consists of two video cutscene files (<code className="text-amber-200 font-mono">intro.mp4</code> and <code className="text-amber-200 font-mono">intro_mobile.mp4</code>). 
          The actual game engine, networking code, graphics renderer, and sound synthesizer exist in a <strong>single 1.01 MB HTML file</strong>!
        </p>
      </div>

      {/* Visual Proportional Storage Bar / Treemap */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs text-stone-400 font-mono">
          <span>Proportional Storage Footprint</span>
          <span>Total: {(totalBytes / (1024 * 1024)).toFixed(2)} MB Uncompressed</span>
        </div>

        <div className="flex h-10 w-full overflow-hidden rounded-xl border border-stone-800 bg-stone-950 p-1 gap-1">
          {displayedFiles.map(file => {
            const pct = Math.max(1.5, (file.sizeBytes / totalBytes) * 100);
            const isSelected = selectedFile === file.name;
            return (
              <button
                key={file.name}
                onClick={() => setSelectedFile(file.name)}
                style={{ width: `${pct}%` }}
                title={`${file.name}: ${(file.sizeBytes / 1024).toFixed(0)} KB (${pct.toFixed(1)}%)`}
                className={`h-full rounded-lg transition-all relative group flex items-center justify-center border text-[11px] font-bold overflow-hidden cursor-pointer ${getCategoryColor(file.category)} ${
                  isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-stone-950 z-10' : 'opacity-85 hover:opacity-100'
                }`}
              >
                <span className="truncate px-1 hidden sm:inline">{pct > 8 ? file.name : ''}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected File Details Card */}
      {activeFileInfo && (
        <div className="rounded-xl border border-stone-800 bg-stone-950/80 p-4 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800/80 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-stone-900 border border-stone-700 text-amber-400">
                {getIcon(activeFileInfo.category)}
              </div>
              <div>
                <h4 className="font-mono font-semibold text-stone-100 text-sm">{activeFileInfo.name}</h4>
                <p className="text-xs text-stone-400 font-mono">{activeFileInfo.path}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full border ${getCategoryBadge(activeFileInfo.category).color}`}>
                {getCategoryBadge(activeFileInfo.category).label}
              </span>
              <span className="text-xs font-mono font-bold text-amber-300 bg-amber-950/40 border border-amber-900/60 px-2.5 py-0.5 rounded-md">
                {(activeFileInfo.sizeBytes / 1024).toFixed(1)} KB ({(activeFileInfo.sizeBytes / (1024 * 1024)).toFixed(2)} MB)
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            {activeFileInfo.description}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono pt-1 text-stone-400">
            <div className="bg-stone-900/50 p-2 rounded border border-stone-800/80">
              <span className="text-stone-400 block text-[10px]">Uncompressed</span>
              <span className="text-stone-200 font-bold">{(activeFileInfo.sizeBytes / 1024).toFixed(0)} KB</span>
            </div>
            <div className="bg-stone-900/50 p-2 rounded border border-stone-800/80">
              <span className="text-stone-400 block text-[10px]">In Zip Archive</span>
              <span className="text-stone-200 font-bold">{(activeFileInfo.compressedBytes / 1024).toFixed(0)} KB</span>
            </div>
            <div className="bg-stone-900/50 p-2 rounded border border-stone-800/80">
              <span className="text-stone-400 block text-[10px]">Zip Share</span>
              <span className="text-amber-400 font-bold">
                {((activeFileInfo.compressedBytes / TORCHBOUND_STATS.downloadZipSizeBytes) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="bg-stone-900/50 p-2 rounded border border-stone-800/80">
              <span className="text-stone-400 block text-[10px]">Required to Play?</span>
              <span className={activeFileInfo.category === 'video' ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>
                {activeFileInfo.category === 'video' ? 'Optional (Cutscene)' : 'Yes (Essential)'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* File List Table */}
      <div className="overflow-x-auto rounded-xl border border-stone-800">
        <table className="w-full text-left text-xs">
          <thead className="bg-stone-950/90 text-stone-400 font-mono uppercase tracking-wider border-b border-stone-800">
            <tr>
              <th className="py-2.5 px-3">File / Component</th>
              <th className="py-2.5 px-3">Category</th>
              <th className="py-2.5 px-3 text-right">Raw Size</th>
              <th className="py-2.5 px-3 text-right">In Zip</th>
              <th className="py-2.5 px-3 text-right">% of Zip</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-800/50 bg-stone-900/30">
            {displayedFiles.map(file => {
              const isSelected = selectedFile === file.name;
              const pctOfZip = ((file.compressedBytes / TORCHBOUND_STATS.downloadZipSizeBytes) * 100).toFixed(1);
              return (
                <tr
                  key={file.name}
                  onClick={() => setSelectedFile(file.name)}
                  className={`cursor-pointer transition hover:bg-stone-800/50 ${
                    isSelected ? 'bg-amber-950/30' : ''
                  }`}
                >
                  <td className="py-2.5 px-3 font-mono font-medium text-stone-200 flex items-center gap-2">
                    {isSelected && <CheckCircle2 className="h-3.5 w-3.5 text-amber-400 shrink-0" />}
                    <span className="truncate">{file.name}</span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${getCategoryBadge(file.category).color}`}>
                      {getCategoryBadge(file.category).label}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-stone-300">
                    {(file.sizeBytes / 1024).toFixed(0)} KB
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-stone-300">
                    {(file.compressedBytes / 1024).toFixed(0)} KB
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-semibold text-amber-400">
                    {pctOfZip}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};
