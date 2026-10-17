import React, { useState } from 'react';
import { 
  CURRENT_ZIP_FILE_BREAKDOWN, 
  HISTORICAL_ZIP_FILE_BREAKDOWN, 
  TORCHBOUND_STATS,
  TORCHBOUND_VERSION_HISTORY 
} from '../data/torchboundData';
import { FileVideo, Binary, FileCode, Package, Layers, Info, CheckCircle2, Sparkles, RefreshCw } from 'lucide-react';

export const ZipInspector: React.FC = () => {
  const [selectedVersion, setSelectedVersion] = useState<'current' | 'historical'>('current');
  const [selectedFile, setSelectedFile] = useState<string | null>(CURRENT_ZIP_FILE_BREAKDOWN[0].name);

  const displayedFiles = selectedVersion === 'current' 
    ? CURRENT_ZIP_FILE_BREAKDOWN 
    : HISTORICAL_ZIP_FILE_BREAKDOWN;

  const totalBytes = displayedFiles.reduce((acc, f) => acc + f.sizeBytes, 0);
  const activeFileInfo = displayedFiles.find(f => f.name === selectedFile) || displayedFiles[0];

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
      case 'config': return { label: 'Config & Readme', color: 'bg-stone-800 text-stone-300 border-stone-700' };
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
              Anatomy of Torchbound.zip (v{TORCHBOUND_STATS.version})
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            Byte-level inspection of <code className="text-stone-300">Torchbound-Windows.zip</code> from the official release page
          </p>
        </div>

        {/* Release Version Switcher */}
        <div className="flex items-center gap-2 bg-stone-950/80 p-1.5 rounded-xl border border-stone-800">
          <span className="text-xs font-mono text-stone-400 pl-2">Archive:</span>
          <button
            onClick={() => {
              setSelectedVersion('current');
              setSelectedFile(CURRENT_ZIP_FILE_BREAKDOWN[0].name);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition cursor-pointer ${
              selectedVersion === 'current' 
                ? 'bg-emerald-500 text-stone-950 shadow font-bold' 
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Latest v2.5.1 (1.6 MB Zip)
          </button>
          <button
            onClick={() => {
              setSelectedVersion('historical');
              setSelectedFile(HISTORICAL_ZIP_FILE_BREAKDOWN[0].name);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition cursor-pointer ${
              selectedVersion === 'historical' 
                ? 'bg-amber-500 text-stone-950 shadow font-bold' 
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Historical v2.2.0 (13.2 MB Zip)
          </button>
        </div>
      </div>

      {/* Revelation Alert Box */}
      {selectedVersion === 'current' ? (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 text-xs sm:text-sm text-stone-300 space-y-2">
          <div className="flex items-center gap-2 font-semibold text-emerald-300">
            <Sparkles className="h-4 w-4 shrink-0 text-emerald-400" />
            <span>Latest v2.5.1 Update: 88% Archive Reduction!</span>
          </div>
          <p className="leading-relaxed">
            In the latest release (v2.5.1), Torchbound decoupled the opening MP4 video cutscenes and bundled all game code into <code className="text-emerald-200 font-mono">resources.neu</code>. 
            The Windows desktop download plummeted from <strong>13.2 MB down to just 1.6 MB</strong>, completely validating the findings of this case study!
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 text-xs sm:text-sm text-stone-300 space-y-2">
          <div className="flex items-center gap-2 font-semibold text-amber-300">
            <Info className="h-4 w-4 shrink-0 text-amber-400" />
            <span>Historical v2.2.0: The 89% Cutscene Secret</span>
          </div>
          <p className="leading-relaxed">
            In version 2.2.0, the total zip was 13.2 MB, but <strong>12.3 MB (89%)</strong> consisted of two MP4 cutscenes (<code className="text-amber-200 font-mono">intro.mp4</code> and <code className="text-amber-200 font-mono">intro_mobile.mp4</code>). Stripped of cutscenes, the playable game was only ~1.4 MB!
          </p>
        </div>
      )}

      {/* Visual Proportional Storage Bar / Treemap */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs text-stone-400 font-mono">
          <span>Proportional Storage Footprint ({selectedVersion === 'current' ? 'v2.5.1' : 'v2.2.0'})</span>
          <span>Total: {(totalBytes / (1024 * 1024)).toFixed(2)} MB Uncompressed</span>
        </div>

        <div className="flex h-10 w-full overflow-hidden rounded-xl border border-stone-800 bg-stone-950 p-1 gap-1">
          {displayedFiles.map(file => {
            const pct = Math.max(3, (file.sizeBytes / totalBytes) * 100);
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
              <span className={`text-[11px] font-mono px-2.5 py-1 rounded-md border font-semibold ${getCategoryBadge(activeFileInfo.category).color}`}>
                {getCategoryBadge(activeFileInfo.category).label}
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            {activeFileInfo.description}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs font-mono">
            <div className="bg-stone-900/60 p-2.5 rounded-lg border border-stone-800">
              <span className="text-stone-400 text-[10px] block">Uncompressed Size</span>
              <span className="text-stone-200 font-bold mt-0.5 block">
                {(activeFileInfo.sizeBytes / 1024).toFixed(0)} KB
              </span>
            </div>
            <div className="bg-stone-900/60 p-2.5 rounded-lg border border-stone-800">
              <span className="text-stone-400 text-[10px] block">Compressed In Zip</span>
              <span className="text-emerald-400 font-bold mt-0.5 block">
                {(activeFileInfo.compressedBytes / 1024).toFixed(0)} KB
              </span>
            </div>
            <div className="bg-stone-900/60 p-2.5 rounded-lg border border-stone-800">
              <span className="text-stone-400 text-[10px] block">Share of Archive</span>
              <span className="text-amber-400 font-bold mt-0.5 block">
                {((activeFileInfo.sizeBytes / totalBytes) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="bg-stone-900/60 p-2.5 rounded-lg border border-stone-800">
              <span className="text-stone-400 text-[10px] block">Compression Ratio</span>
              <span className="text-cyan-400 font-bold mt-0.5 block">
                {((1 - activeFileInfo.compressedBytes / activeFileInfo.sizeBytes) * 100).toFixed(0)}% saved
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
