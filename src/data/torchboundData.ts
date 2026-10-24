import { ZipFileEntry, EngineComparisonItem, CodeSnippet } from '../types';

export const TORCHBOUND_STATS = {
  version: '2.9.5',
  previousVersion: '2.5.1',
  historicalVersion: '2.2.0',
  downloadZipSizeMB: 1.7,
  previousZipSizeMB: 13.2,
  downloadZipSizeBytes: 1654006, // 1.65 MB (~1.7 MB)
  gameHtmlSizeBytes: 1035520, // 1.01 MB
  gameHtmlGzipSizeBytes: 298400, // ~291 KB over Cloudflare brotli/gzip
  executableCompressedMB: 1.15,
  executableUncompressedMB: 2.74,
  resourcesNeuBytes: 1230717, // 1.17 MB
  audioFilesCount: 0,
  textureAtlasesCount: 0,
  dungeonGeometryFilesCount: 0,
  optimizationDropPercentage: '87% size reduction (13.2 MB → 1.7 MB)',
};

export const TORCHBOUND_VERSION_HISTORY = [
  {
    version: '2.9.5',
    date: 'Latest Release',
    zipSizeMB: 1.7,
    summary: 'Self-updating desktop build with streamlined asset manifest and WebView2 desktop integration. Download package is 1.7 MB zip.',
    breakdown: [
      { name: 'Torchbound.exe', size: '2.74 MB (1.15 MB zipped)', desc: 'Neutralinojs runtime binary using OS Edge WebView2' },
      { name: 'resources.neu', size: '1.23 MB (480 KB zipped)', desc: 'Full game engine, HTML5 canvas, sound synth, WebRTC co-op' },
      { name: 'README.txt', size: '491 bytes', desc: 'Installation instructions' },
    ]
  },
  {
    version: '2.9.5',
    date: 'Previous Release',
    zipSizeMB: 1.6,
    summary: 'Streamed/decoupled opening video cutscenes and bundled assets into resources.neu.',
    breakdown: [
      { name: 'Torchbound.exe', size: '2.74 MB (1.15 MB zipped)', desc: 'Neutralinojs runtime binary' },
      { name: 'resources.neu', size: '1.23 MB', desc: 'Packed game assets' },
    ]
  },
  {
    version: '2.9.5',
    date: 'Historical Baseline',
    zipSizeMB: 13.2,
    summary: 'Bundled two pre-rendered video cutscenes (intro.mp4 + intro_mobile.mp4 = 12.3 MB). Proved our case study thesis that 89% of the archive was just video!',
    breakdown: [
      { name: 'intro.mp4 & intro_mobile.mp4', size: '12.32 MB (11.75 MB zipped)', desc: 'Two opening video cutscenes (89% of zip)' },
      { name: 'Torchbound.exe', size: '2.74 MB (1.15 MB zipped)', desc: 'Neutralinojs launcher' },
      { name: 'game.html', size: '1.04 MB (312 KB zipped)', desc: 'Complete 2D RPG logic, sprites, and sound' },
    ]
  }
];

export const CURRENT_ZIP_FILE_BREAKDOWN: ZipFileEntry[] = [
  {
    path: 'Torchbound/Torchbound.exe',
    name: 'Torchbound.exe',
    sizeBytes: 2738688,
    compressedBytes: 1155235,
    category: 'executable',
    description: 'Neutralinojs native Windows launcher. Instantiates the pre-installed Microsoft Edge WebView2 on Windows 10/11 instead of packaging a 180MB Chromium build.',
  },
  {
    path: 'Torchbound/resources.neu',
    name: 'resources.neu',
    sizeBytes: 1230717,
    compressedBytes: 501632,
    category: 'game-core',
    description: 'THE ENTIRE GAME! Contains game.html, procedural Web Audio synth, RLE sprite palettes, all classes, dungeons, bosses, dialog, and WebRTC co-op networking packed into Neutralino binary resource archive.',
  },
  {
    path: 'Torchbound/README.txt',
    name: 'README.txt',
    sizeBytes: 491,
    compressedBytes: 310,
    category: 'config',
    description: 'Quick-start installation guide, SmartScreen run instructions, and controls.',
  },
];

export const HISTORICAL_ZIP_FILE_BREAKDOWN: ZipFileEntry[] = [
  {
    path: 'Torchbound/resources/assets/intro.mp4',
    name: 'intro.mp4',
    sizeBytes: 7512340,
    compressedBytes: 7320000,
    category: 'video',
    description: 'High-res desktop opening cinematic video. Accounted for 54% of the entire download archive alone!',
  },
  {
    path: 'Torchbound/resources/assets/intro_mobile.mp4',
    name: 'intro_mobile.mp4',
    sizeBytes: 4809043,
    compressedBytes: 4680000,
    category: 'video',
    description: 'Mobile-formatted opening cinematic video. Combined with intro.mp4, cutscenes made up 89% of the 13.2 MB zip.',
  },
  {
    path: 'Torchbound/Torchbound.exe',
    name: 'Torchbound.exe',
    sizeBytes: 2738688,
    compressedBytes: 1155235,
    category: 'executable',
    description: 'Neutralinojs native Windows launcher hooking into Edge WebView2.',
  },
  {
    path: 'Torchbound/resources/game.html',
    name: 'game.html',
    sizeBytes: 1035553,
    compressedBytes: 312000,
    category: 'game-core',
    description: 'The complete 2D RPG game logic, procedural audio synth, and graphics.',
  },
];

export const ZIP_FILE_BREAKDOWN = CURRENT_ZIP_FILE_BREAKDOWN;

export const PILLARS_DATA = [
  {
    id: 'runtime',
    title: 'Neutralinojs vs Electron Architecture',
    savedMegabytes: 'Saves 150–200 MB',
    tag: 'RUNTIME & PACKAGING',
    headline: 'Native WebView2 Hooking instead of Bundling Chromium',
    description: 'Standard desktop HTML5 wrappers (like Electron) bundle an entire copy of Google Chrome and Node.js. Torchbound uses Neutralinojs, which compiles to a ~1.15 MB executable that commands Windows 10/11 to instantiate Microsoft Edge WebView2, which is already installed on the OS.',
    mechanics: [
      'Executes a lean C++ native wrapper (Torchbound.exe).',
      'Communicates via a local WebSocket/IPC with the WebView2 process.',
      'Saves player states, settings, and keybinds to local storage/files without node_modules.',
      'Enjoys full Chromium hardware acceleration and WebGL performance with zero browser payload overhead.'
    ],
    conventionalVs: 'Electron bundles ~180 MB of Chromium binaries, audio codecs, and Node.js runtime.'
  },
  {
    id: 'audio',
    title: 'Procedural Web Audio API Sound System',
    savedMegabytes: 'Saves 50–120 MB',
    tag: 'AUDIO ENGINE',
    headline: 'Zero Audio Files: Every Footstep & Sword Slash is Math',
    description: 'Instead of shipping hundreds of WAV, MP3, or OGG sound files for attacks, footsteps, magic spells, and ambient dungeon noise, Torchbound contains ZERO audio files. Sounds are synthesized in real-time using browser native Web Audio API oscillators and noise generators.',
    mechanics: [
      'Sword Slash: 120ms sawtooth wave sweeping from 750Hz down to 80Hz.',
      'Monster Roar: 65Hz carrier wave frequency-modulated by a 12Hz sine with distortion waveshaping.',
      'Torch Fire: Low-passed white noise bursts with exponential decay envelopes.',
      'Coin Pickup: Pure dual sine harmonics at 987Hz and 1318Hz with rapid 150ms decay.'
    ],
    conventionalVs: 'Typical indie RPGs package 50–100 MB of sampled sound effects and audio banks.'
  },
  {
    id: 'graphics',
    title: 'Base64 Run-Length Encoded (RLE) Spritesheets',
    savedMegabytes: 'Saves 30–80 MB',
    tag: 'ART PIPELINE',
    headline: 'Compressed Sprite Strings + Dynamic Color Mixing',
    description: 'Characters, monsters, walls, and items are stored as compact Base64 Run-Length Encoded bit patterns embedded directly in the JavaScript source. Instead of shipping 40 monster sprite variations, the engine uses dynamic palette-swapping math.',
    mechanics: [
      'Spritesheets are stored as packed hexadecimal / base64 character strings.',
      'Engine decodes strings into offscreen HTML5 2D Canvas contexts at boot.',
      'Dynamic color arithmetic (hexRGB and shade) generates dozens of monster skins (fire, ice, poison) without additional texture files.',
      'Result: Entire visual asset atlas is under 400 KB of text.'
    ],
    conventionalVs: 'Standard 2D engines package multiple 2048x2048 PNG texture atlases and sprite sheets.'
  },
  {
    id: 'dungeon',
    title: 'Infinite Procedural Dungeons (Mulberry32)',
    savedMegabytes: 'Saves 15–40 MB',
    tag: 'LEVEL DESIGN',
    headline: 'Deterministic Coordinate PRNG Carving Rooms in Memory',
    description: 'There are no pre-baked tilemap JSON files, TMX maps, or 3D collision meshes. Dungeons, loot chests, and mob encounters are generated in memory using a deterministic 15-line Mulberry32 pseudo-random number generator.',
    mechanics: [
      'Takes a single seed number (e.g. 1337) and carves labyrinth corridors algorithmically.',
      'Deterministic: Every multiplayer peer generates the exact same dungeon layout locally without downloading map files.',
      'Room connectivity, wall colliders, and enemy spawn locations exist only in temporary RAM arrays during play.'
    ],
    conventionalVs: 'Traditional games ship 20MB to 100MB of pre-baked level geometry and tilemap data.'
  },
  {
    id: 'lighting',
    title: 'Canvas2D Darkness Masking (destination-out)',
    savedMegabytes: 'Saves 10–25 MB',
    tag: 'GRAPHICS SHADERS',
    headline: 'Radial Gradients Punching Holes in Darkness',
    description: 'Torchbound creates its moody dungeon atmosphere without 3D normal maps or heavy shader compilation pipelines. It paints a solid darkness overlay on an HTML5 canvas and uses destination-out blend modes to punch out light cones.',
    mechanics: [
      'Draws dungeon darkness overlay with rgba(7, 5, 12, 0.94).',
      'Sets ctx.globalCompositeOperation = "destination-out".',
      'Draws radial gradient around player torch: Math.sin(tick * 0.1) * 3 introduces realistic fire flicker.',
      'Punches crisp light circles for wall sconces and magic spells with zero GPU shader overhead.'
    ],
    conventionalVs: 'Modern engines compile complex 2D shadow caster shaders, normal lightmaps, and blur passes.'
  }
];

export const ENGINE_COMPARISONS: EngineComparisonItem[] = [
  {
    name: 'Torchbound (Neutralinojs)',
    sizeMB: 1.6,
    runtimeType: 'C++ Native + Edge WebView2',
    bundledChromium: false,
    builtInAudioFormat: 'Procedural Web Audio (0 MB)',
    torchboundEquivalentSize: '1.6 MB (Windows Zip)',
    pros: 'Ultra-lean 1.6 MB download, instant launch, native window controls, uses OS pre-installed browser engine, zero Node.js overhead.',
    cons: 'Requires Windows 10/11 with Edge WebView2 installed (comes pre-installed by default).'
  },
  {
    name: 'Electron (Standard Desktop Web)',
    sizeMB: 185.0,
    runtimeType: 'Full Chromium + Node.js Binary',
    bundledChromium: true,
    builtInAudioFormat: 'Sampled MP3/OGG (40-80 MB)',
    torchboundEquivalentSize: '185 MB minimum',
    pros: 'Guaranteed consistent Chromium version across all platforms, extensive Node.js native API access.',
    cons: 'Massive binary bloat (+150MB overhead before game assets), high RAM consumption (250MB+ idle).'
  },
  {
    name: 'Unity 2D Standalone',
    sizeMB: 110.0,
    runtimeType: 'Mono / IL2CPP C# Engine',
    bundledChromium: false,
    builtInAudioFormat: 'FMOD / Unity Audio Bank (50 MB)',
    torchboundEquivalentSize: '110 MB minimum',
    pros: 'Rich visual editor, extensive asset store, multi-platform deployment.',
    cons: 'Heavy runtime overhead, C# runtime libraries, complex asset serialization.'
  },
  {
    name: 'Godot 4 Standalone',
    sizeMB: 48.0,
    runtimeType: 'C++ Lightweight Engine',
    bundledChromium: false,
    builtInAudioFormat: 'WAV / OGG samples (30 MB)',
    torchboundEquivalentSize: '48 MB minimum',
    pros: 'Much leaner than Unity, open source, dedicated 2D node pipeline.',
    cons: 'Still bundles 40MB+ engine binary compared to Neutralino’s 1.15MB.'
  },
  {
    name: 'Unreal Engine 5 (Paper2D)',
    sizeMB: 380.0,
    runtimeType: 'C++ Heavyweight Engine',
    bundledChromium: false,
    builtInAudioFormat: 'MetaSound Audio Banks (80 MB)',
    torchboundEquivalentSize: '380 MB minimum',
    pros: 'Industry-standard graphics, blueprints, nanite/lumen capabilities.',
    cons: 'Extremely heavy for 2D games; huge base binary footprint.'
  }
];

export const CODE_SNIPPETS: CodeSnippet[] = [
  {
    id: 'mulberry32',
    title: 'Deterministic Mulberry32 PRNG (Level Generator)',
    category: 'ProcGen',
    savedMegabytes: 'Saves 25 MB of Level JSONs',
    code: `// Deterministic 32-bit PRNG carves identical dungeons across multiplayer peers
function mulberry32(seed) {
  return function() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Generate coordinate hash for endless dungeon rooms
function hash2(x, y, seed) {
  const n = Math.sin(x * 12.9898 + y * 78.233 + seed) * 43758.5453;
  return n - Math.floor(n);
}`,
    explanation: [
      'Replaces multi-megabyte tilemap files with 15 lines of pure mathematical code.',
      'Peers in multiplayer co-op pass only an integer seed over WebRTC DataChannels.',
      'Both players generate the exact same room layouts, traps, and boss spawns locally.'
    ]
  },
  {
    id: 'audio-synth',
    title: 'Web Audio Procedural Sound Synthesis',
    category: 'Audio',
    savedMegabytes: 'Saves 80 MB of Audio Samples',
    code: `// Zero audio files shipped: Synthesize sword slash mathematically
function playSwordSlash(audioCtx) {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  const filter = audioCtx.createBiquadFilter();

  osc.type = 'sawtooth';
  // Rapid frequency down-sweep from 750Hz to 80Hz in 120ms
  osc.frequency.setValueAtTime(750, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.12);

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(3200, audioCtx.currentTime);
  filter.frequency.linearRampToValueAtTime(400, audioCtx.currentTime + 0.12);

  gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.12);

  osc.connect(filter).connect(gain).connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.12);
}`,
    explanation: [
      'Generates instantaneous sound effects directly from mathematical formulas.',
      'Zero HTTP requests and zero disk I/O latency for footsteps, attacks, and hits.',
      'Saves over 80 MB of uncompressed audio assets in the final distribution.'
    ]
  },
  {
    id: 'lighting-mask',
    title: 'Canvas 2D Darkness Punching (destination-out)',
    category: 'Lighting',
    savedMegabytes: 'Saves 15 MB Shader Pipelines',
    code: `// Render torchlight flicker with zero GPU shader packages
function renderLighting(ctx, width, height, player, tick) {
  // 1. Paint pitch black dungeon darkness over the screen
  ctx.fillStyle = 'rgba(7, 5, 12, 0.94)';
  ctx.fillRect(0, 0, width, height);

  // 2. Punch holes in darkness using destination-out blend mode
  ctx.globalCompositeOperation = 'destination-out';

  // 3. Flame flicker formula: sin wave modulation
  const flicker = Math.sin(tick * 0.1) * 3 + Math.cos(tick * 0.07) * 2;
  const radius = player.torchRadius + flicker;

  const grad = ctx.createRadialGradient(
    player.x, player.y, 10,
    player.x, player.y, radius
  );
  grad.addColorStop(0, 'rgba(0, 0, 0, 1)');
  grad.addColorStop(0.6, 'rgba(0, 0, 0, 0.85)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(player.x, player.y, radius, 0, Math.PI * 2);
  ctx.fill();

  // Reset composite operation for normal UI rendering
  ctx.globalCompositeOperation = 'source-over';
}`,
    explanation: [
      'Utilizes native 2D canvas blend modes to punch out light cones.',
      'Sine and cosine wave combinations emulate organic torch fire flickering.',
      'Eliminates need for heavy normal maps, shadow caster libraries, or custom WebGL shaders.'
    ]
  },
  {
    id: 'neutralino-config',
    title: 'Neutralinojs Desktop Configuration (neutralino.config.json)',
    category: 'Packaging',
    savedMegabytes: 'Saves 180 MB Electron Overhead',
    code: `{
  "applicationId": "com.torchbound.game",
  "version": "2.5.1",
  "defaultMode": "window",
  "port": 0,
  "url": "/resources/game.html",
  "enableServer": true,
  "enableNativeAPI": true,
  "modes": {
    "window": {
      "title": "Torchbound",
      "width": 1280,
      "height": 720,
      "minWidth": 800,
      "minHeight": 600,
      "fullScreen": false,
      "borderless": false,
      "maximize": false
    }
  }
}`,
    explanation: [
      'Zero Chromium bundling: neutralino.config.json tells the OS to run the native WebView2 instance.',
      'Saves player states directly to local directory without heavyweight database or node dependencies.',
      'Compiles to a lightweight ~1.15 MB executable zip instead of a 180MB+ installer.'
    ]
  }
];
