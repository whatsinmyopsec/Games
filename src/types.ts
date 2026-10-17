export interface ZipFileEntry {
  path: string;
  name: string;
  sizeBytes: number;
  compressedBytes: number;
  category: 'video' | 'executable' | 'game-core' | 'assets' | 'config';
  description: string;
}

export interface EngineComparisonItem {
  name: string;
  runtimeType: string;
  typicalBaseSize?: string;
  sizeMB: number;
  bundledChromium: boolean;
  builtInAudioFormat: string;
  torchboundEquivalentSize: string;
  pros: string;
  cons: string;
}

export interface CodeSnippet {
  id: string;
  title: string;
  category: string;
  savedMegabytes: string;
  description?: string;
  code: string;
  explanation: string[];
}
