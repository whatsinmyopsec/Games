import { ZipFileEntry, EngineComparisonItem, CodeSnippet } from '../types';

export const TORCHBOUND_STATS = {
  version: '2.2.0',
  downloadZipSizeMB: 13.2,
  downloadZipSizeBytes: 13856712,
  gameHtmlSizeBytes: 1035520, // 1.01 MB
  gameHtmlGzipSizeBytes: 298400, // ~291 KB over Cloudflare brotli/gzip
  executableCompressedMB: 1.15,
  executableUncompressedMB: 2.74,
  videoCutscenesBytes: 12321383, // 11.75 MB compressed in the zip (89% of zip!)
  actualGameLogicAssetsBytes: 1076228, // ~1.03 MB
  audioFilesCount: 0,
  textureAtlasesCount: 0,
  dungeonGeometryFilesCount: 0,
};

export const ZIP_FILE_BREAKDOWN: ZipFileEntry[] = [
  {
    path: 'Torchbound/resources/assets/intro.mp4',
    name: 'intro.mp4',
    sizeBytes: 7512340,
    compressedBytes: 7320000,
    category: 'video',
    description: 'High-res desktop opening cinematic video. Accounts for over 54% of the entire download archive alone!',
  },
  {
    path: 'Torchbound/resources/assets/intro_mobile.mp4',
    name: 'intro_mobile.mp4',
    sizeBytes: 4809043,
    compressedBytes: 4680000,
    category: 'video',
    description: 'Mobile-formatted opening cinematic video. Combined with intro.mp4, cutscene videos make up 89% of the 13.2 MB zip.',
  },
  {
    path: 'Torchbound/Torchbound.exe',
    name: 'Torchbound.exe',
    sizeBytes: 2738688,
    compressedBytes: 1155235,
    category: 'executable',
    description: 'Neutralinojs native Windows launcher. It hooks into the OS Microsoft Edge WebView2 instead of embedding a bloated Chromium browser.',
  },
  {
    path: 'Torchbound/resources/game.html',
    name: 'game.html',
    sizeBytes: 1035553,
    compressedBytes: 312000,
    category: 'game-core',
    description: 'THE ENTIRE GAME! Contains rendering engine, procedural audio synth, RLE sprite palettes, all classes, dungeons, bosses, dialog, and WebRTC co-op networking.',
  },
  {
    path: 'Torchbound/resources/neutralino.js',
    name: 'neutralino.js',
    sizeBytes: 17647,
    compressedBytes: 6800,
    category: 'config',
    description: 'Lightweight client library for Neutralinojs bridging native OS calls (window framing, filesystem saves, fullscreen) via local IPC.',
  },
  {
    path: 'Torchbound/resources/icons/*',
    name: 'App Icons & Favicons',
    sizeBytes: 65671,
    compressedBytes: 48000,
    category: 'assets',
    description: 'PNG icons for Windows shortcuts, taskbar, and web app manifest tiles.',
  },
  {
    path: 'Torchbound/resources/tb_neu.js & config',
    name: 'tb_neu.js & neutralino.config.json',
    sizeBytes: 3275,
    compressedBytes: 1400,
    category: 'config',
    description: 'Glue script for desktop save storage in the local folder and update synchronizer.',
  },
];

export const ENGINE_COMPARISONS: EngineComparisonItem[] = [
  {
    name: 'Torchbound (Neutralinojs + WebView2)',
    runtimeType: 'Native C++ bridge + OS WebView2',
    typicalBaseSize: '1.2 MB – 2.7 MB',
    sizeMB: 2.7,
    bundledChromium: false,
    builtInAudioFormat: 'Procedural Web Audio API (0 MB)',
    torchboundEquivalentSize: '13.2 MB (or 1.4 MB without MP4 cutscene)',
    pros: 'Zero Chromium bloat, native OS windowing, tiny 2.7MB binary, instant launch',
    cons: 'Requires Windows 10/11 with WebView2 (already built-in to modern Windows)',
  },
  {
    name: 'Electron (e.g., Discord, Slack, VS Code)',
    runtimeType: 'Full Chromium Browser + Node.js runtime',
    typicalBaseSize: '150 MB – 220 MB',
    sizeMB: 180,
    bundledChromium: true,
    builtInAudioFormat: 'Sample-based audio (MP3/OGG)',
    torchboundEquivalentSize: '195 MB (~15x larger)',
    pros: 'Identical rendering on old/unsupported OS versions',
    cons: 'Massive binary size, duplicate browser in memory for every app, high RAM usage',
  },
  {
    name: 'Unity (Standard 2D Web/Desktop Build)',
    runtimeType: 'Mono / IL2CPP C++ Engine Runtime',
    typicalBaseSize: '70 MB – 150 MB',
    sizeMB: 110,
    bundledChromium: false,
    builtInAudioFormat: 'FMOD / Unity Audio sample banks',
    torchboundEquivalentSize: '135 MB (~10x larger)',
    pros: 'Rich visual editor, multiplatform export, physics engine',
    cons: 'Heavy engine overhead, large C++ assemblies, shader caches, slow cold boot',
  },
  {
    name: 'Unreal Engine 5 (2D/3D project)',
    runtimeType: 'Heavy C++ game engine runtime',
    typicalBaseSize: '250 MB – 2 GB (base empty project)',
    sizeMB: 450,
    bundledChromium: false,
    builtInAudioFormat: 'Metasound + uncompressed WAV/FLAC',
    torchboundEquivalentSize: '500+ MB (~40x larger)',
    pros: 'Photorealistic lighting, Nanite, Lumen',
    cons: 'Extreme disk and RAM footprint, completely unsuitable for micro-games',
  },
  {
    name: 'Godot Engine (Standard Export)',
    runtimeType: 'C++ lightweight game engine',
    typicalBaseSize: '35 MB – 70 MB',
    sizeMB: 48,
    bundledChromium: false,
    builtInAudioFormat: 'Sample-based audio (WAV/OGG)',
    torchboundEquivalentSize: '62 MB (~5x larger)',
    pros: 'Lightweight compared to Unity, free & open source',
    cons: 'Still ships complete scene graph, physics, and renderer binaries',
  },
  {
    name: 'Tauri (Rust + OS WebView)',
    runtimeType: 'Rust native wrapper + OS WebView',
    typicalBaseSize: '8 MB – 15 MB',
    sizeMB: 12,
    bundledChromium: false,
    builtInAudioFormat: 'Web Audio API',
    torchboundEquivalentSize: '24 MB',
    pros: 'Very low memory, modern Rust backend',
    cons: 'Slightly larger binary than Neutralino due to Rust runtime libraries',
  },
];

export const CODE_SNIPPETS: CodeSnippet[] = [
  {
    id: 'webview2-neutralino',
    title: '1. Neutralinojs OS Bridge (Zero Embedded Chromium)',
    category: 'Architecture & Packaging',
    savedMegabytes: 'Saves ~175 MB',
    description: 'Instead of bundling Google Chrome like Electron, Torchbound uses Neutralinojs to hook directly into Windows Edge WebView2.',
    code: `// neutralino.config.json (inside Torchbound-Windows.zip)
{
  "applicationId": "com.torchbound.game",
  "version": "2.2.0",
  "defaultMode": "window",
  "documentRoot": "/resources/",
  "url": "/game.html",
  "enableServer": true,
  "window": {
    "title": "Torchbound",
    "width": 1280,
    "height": 720,
    "minWidth": 640,
    "minHeight": 360,
    "fullScreen": false,
    "icon": "/icons/icon-512.png"
  }
}
// Neutralino.exe is only 2.7 MB!
// It connects via local localhost WebSocket IPC to control OS windows.`,
    explanation: [
      'Electron apps bundle an entire Chromium browser and Node.js binary (~180 MB).',
      'Neutralinojs bundles ZERO browser binaries; it asks Windows to instantiate the WebView2 control that already exists on the user\'s PC.',
      'Result: The launcher executable is just 1.15 MB compressed in the zip!',
    ],
  },
  {
    id: 'procedural-audio',
    title: '2. Procedural Web Audio API (Zero Audio Files)',
    category: 'Sound Design',
    savedMegabytes: 'Saves ~30–80 MB',
    description: 'Not a single MP3 or WAV file is shipped. All sword slashes, footfalls, monster roars, and dungeon hums are synthesized mathematically in real-time.',
    code: `// Torchbound procedural audio synthesis snippet
const AC = new (window.AudioContext || window.webkitAudioContext)();

function playSlashSound() {
  const osc = AC.createOscillator();
  const gain = AC.createGain();
  const filter = AC.createBiquadFilter();

  osc.type = 'sawtooth';
  // Rapid pitch drop (white-hot swing)
  osc.frequency.setValueAtTime(650, AC.currentTime);
  osc.frequency.exponentialRampToValueAtTime(80, AC.currentTime + 0.12);

  // Volume envelope
  gain.gain.setValueAtTime(0.3, AC.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, AC.currentTime + 0.14);

  osc.connect(gain);
  gain.connect(AC.destination);
  osc.start();
  osc.stop(AC.currentTime + 0.15);
}`,
    explanation: [
      'Normal games bundle folders of .wav or .ogg samples for every attack, footstep, spell, and monster grunt.',
      'Torchbound synthesizes all sounds mathematically with oscillators, white noise generators, and bandpass filters.',
      'Cost in file size: 0.00 megabytes of audio assets!',
    ],
  },
  {
    id: 'rle-sprites',
    title: '3. Base64 Run-Length Encoded Pixel Art Spritesheets',
    category: 'Art & Graphics',
    savedMegabytes: 'Saves ~20–50 MB',
    description: 'Instead of huge PNG texture atlases, all sprites and font bitmaps are encoded in a single ultra-dense Base64 RLE string.',
    code: `// Header of Torchbound's game.html:
const SPRITE_DATA = 'ICAQEBAQIDAgICAhL/AQHT0wH/GRcXR0cXGfwc/BwXEgH+Gx/+FBsYG/77GwX+J/kg8QAAgAEACAAaAAANDAACAgICAgICAgIDAgKBAR3+ggUbGhv+HTKAC/4UFSwrPz0//kIoAACAAQAIABQAAAkIAQICAgICAgICCP8B/xkXGfwcFwjtCQcJ7fAW4AAAgAEACAAQAAAHBgECAgICAgIG/hwB/xsaGgbg4wkHCfAAAIABAAgAHgAADw4AAgICAgICAgICAgICAgOCAf4dgQcbGhsd/hobMg7GxdnX7vAFBAXBwtzaxQAA...';

// Sprite palettes are recolored dynamically via color math:
function shade(hex, f) {
  const [r, g, b] = hexRGB(hex);
  return f >= 0 
    ? rgbHex(r + (255 - r) * f, g + (255 - g) * f, b + (255 - b) * f) 
    : rgbHex(r * (1 + f), g * (1 + f), b * (1 + f));
}`,
    explanation: [
      'Sprites are decoded on startup into offscreen HTML5 Canvases.',
      'Dynamic tinting: Instead of creating 50 separate sprite PNGs for different enemy tiers or armor colors, one template sprite is recolored at runtime using arithmetic color mixing.',
      'Zero external texture files or texture compression artifacts.',
    ],
  },
  {
    id: 'procedural-lighting',
    title: '4. Dynamic Canvas Darkness Mask & Torchlight',
    category: 'Rendering & Atmosphere',
    savedMegabytes: 'Saves ~15–30 MB',
    description: 'No 3D lighting engines, shader packages, or baked lightmaps are used. The dark dungeon atmosphere is drawn using 2D canvas composite operations.',
    code: `// Dynamic darkness and torch radiance rendering
function renderLighting(ctx, playerX, playerY, torches) {
  // 1. Draw pitch-black darkness over viewport
  ctx.fillStyle = 'rgba(11, 10, 16, 0.94)';
  ctx.fillRect(0, 0, width, height);

  // 2. Cut holes in darkness using destination-out
  ctx.globalCompositeOperation = 'destination-out';
  
  // Torch flicker using math
  const flicker = Math.sin(Date.now() * 0.01) * 3 + Math.cos(Date.now() * 0.023) * 2;
  const radius = 120 + flicker;

  const grad = ctx.createRadialGradient(playerX, playerY, 15, playerX, playerY, radius);
  grad.addColorStop(0, 'rgba(0,0,0,1)');
  grad.addColorStop(0.6, 'rgba(0,0,0,0.85)');
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(playerX, playerY, radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.globalCompositeOperation = 'source-over'; // restore
}`,
    explanation: [
      'Canvas 2D "destination-out" blending carves light directly out of a dark overlay canvas.',
      'High-performance 60 FPS lighting without Three.js, WebGL shaders, or heavy post-processing libraries.',
    ],
  },
  {
    id: 'procedural-dungeons',
    title: '5. Mulberry32 PRNG & Hash-Based Dungeon Carver',
    category: 'World Generation',
    savedMegabytes: 'Saves ~40–100 MB',
    description: 'No level mesh files, tilemap JSONs, or pre-built maps. Infinite dungeon floors are generated from a 32-bit integer seed.',
    code: `// Torchbound's custom Mulberry32 / SplitMix deterministic PRNG
function RNG(seed) {
  let s = seed >>> 0 || 1;
  const r = () => {
    s |= 0;
    s = s + 0x6D2B79F5 | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = t + Math.imul(t ^ (t >>> 7), 61 | t) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  r.int = (a, b) => Math.floor(a + r() * (b - a + 1));
  r.pick = arr => arr[Math.floor(r() * arr.length)];
  return r;
}

// Coordinate hash for local decor and tile variants
function hash2(x, y, s) {
  let h = (x * 374761393 + y * 668265263 + (s || 0) * 982451653) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}`,
    explanation: [
      'Infinite dungeon floor plans, wall decorations, mob distributions, and loot chests are derived mathematically on the fly.',
      'Seed-based determinism means co-op multiplayer peers generate the exact same map locally without transferring megabytes of map data over the wire!',
    ],
  },
  {
    id: 'webrtc-coop',
    title: '6. Serverless Host-Authoritative WebRTC Co-op',
    category: 'Networking',
    savedMegabytes: 'Saves ~50 MB',
    description: 'No dedicated game server executables or heavy multiplayer network libraries. Players connect directly via peer-to-peer WebRTC DataChannels.',
    code: `// WebRTC peer-to-peer multiplayer with embedded PeerJS
const peer = new Peer({
  // Lightweight STUN/turn handshake
  config: { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] }
});

// The host browser runs the authoritative physics/AI simulation:
conn.on('data', (packet) => {
  // Input packets are tiny binary/compact JSON objects:
  // e.g. { t: 'in', dx: 1, dy: 0, a: 1 } (under 30 bytes!)
  applyPlayerInput(remotePlayerId, packet);
});`,
    explanation: [
      'Eliminates dedicated game server dependencies and heavy RPC frameworks.',
      'State synchronization is handled directly between browser peers via low-latency UDP-based RTCDataChannels.',
    ],
  },
];
