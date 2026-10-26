# Micro-Games Deconstruction: How Are These Games So Tiny?

An interactive technical case study exploring how modern web indie games like **Torchbound** (2D RPG) and **Dungen Doom** (3D Retro FPS) deliver rich, complete gameplay experiences in **under 1 MB to 357 KB**.

Live Site: [https://whatsinmyopsec.github.io/Games/](https://whatsinmyopsec.github.io/Games/)

---

## The "How We Got Here" Post-Mortem & Hall of Slip-Ups

Software development is a journey of trial, error, and occasional clumsy oversights. In the spirit of radical transparency, here is a breakdown of the blunders made while assembling and deploying this project, and how they were fixed:

### 1. The Missing `package-lock.json` Debacle
* **The Slip-Up:** Configured GitHub Actions with `cache: 'npm'` and `npm ci` without committing a `package-lock.json` file (relying solely on `package.json`).
* **The Consequence:** The very first GitHub Actions build failed instantly with: `Dependencies lock file is not found`.
* **The Fix:** Generated `package-lock.json` using `npm i --package-lock-only --legacy-peer-deps` and updated CI to use `npm install --legacy-peer-deps`.

### 2. The Text-Overflow Layout Collision
* **The Slip-Up:** In the procedural audio synthesizer list, individual buttons included overly verbose strings like `0 bytes (12 lines of JS)` inside a fixed 5-column CSS grid without setting `min-w-0` on flex children.
* **The Consequence:** On standard laptop viewports, the text pushed past the container edge and collided directly with the real-time oscilloscope waveform monitor.
* **The Fix:** Simplified the badge label to a concise `0 Bytes` and enforced `min-w-0` and `overflow-hidden` across all column flex containers.

### 3. The Lingering Ghost `bun.lock` File
* **The Slip-Up:** Left a 73 KB `bun.lock` file sitting in the repository root despite the project and CI exclusively using `npm` and Node.js.
* **The Consequence:** Unnecessary repository bloat in a project specifically dedicated to extreme miniaturization!
* **The Fix:** Promptly purged `bun.lock`.

### 4. Leaving Deployment Scaffolding in the UI
* **The Slip-Up:** Embedded a large "Deploy to GitHub Pages" modal and button directly into the main application header for onboarding, but forgot to remove it once the project was already live.
* **The Consequence:** Cluttered the hero header with setup instructions that the user no longer needed.
* **The Fix:** Stripped out the modal and restored the clean header with direct download and play links.

---

## Core Technical Takeaways

Despite the stumbling blocks above, here is how the two featured games achieve extreme miniaturization:

| Feature | Torchbound (2D RPG v3.0.7) | Dungen Doom (3D Retro FPS) | Conventional Game |
| :--- | :--- | :--- | :--- |
| **Download Zip** | **2.1 MB Zip** (was 13.2 MB) | N/A (Web App) | 500 MB – 5 GB |
| **Initial Transfer** | **868 KB gzipped** (`2.08 MB` HTML) | **422 KB gzipped** (`1.44 MB` JS) | 100 MB – 2 GB |
| **3D / 2D Engine** | HTML5 Canvas 2D (`destination-out`) | Three.js WebGL + 2.5D Billboards | Unity / Unreal Engine |
| **Textures** | Procedural pixel art + palette math | 55 Procedural `THREE.CanvasTexture` keys | 50 MB+ PNG/DDS atlases |
| **Audio** | Web Audio synth + 558 KB Base64 MP3 SFX | On-demand 2KB Kenney micro-samples | 50 MB+ WAV/OGG files |
| **3D Models** | N/A (2D grid) | 0 bytes (camera-facing quad sprites) | 20 MB+ rigged FBX meshes |

---

## Release Evolution: 13.2 MB → 1.6 MB → 2.1 MB (v3.0.7)

* **v2.2.0 (`13.2 MB Zip`)**: Bundled two pre-rendered MP4 video cutscenes (`12.3 MB` total, 89% of the zip).
* **v2.5.1 (`1.6 MB Zip`)**: Replaced the MP4 videos with a real-time in-engine rendered cutscene and chiptune score, shrinking the download by **88%**.
* **v3.0.7 (`2.1 MB Zip` / `2,129,462 bytes`)**: Added `558 KB` of inlined base64 MP3 CC0 enemy voice recordings (`V293_SFX`) and arcade weapon swings (`V301_SFX`), 6 attack abilities, PvP arena duels, and readable dungeon flow across 12,574 lines of JS (`2.08 MB` raw / `868 KB` gzipped).

---

## How Everything On The Site Stays Up To Date

To ensure the case study, metrics, and playable games never go stale as developers release new patches, the platform employs a four-layer synchronization architecture:

### 1. Live Embedded Game Engines (Zero Stale Code)
Both playable viewports are framed directly from each game's official production origin:
- **Torchbound**: `https://torchbound-duk.pages.dev/`
- **Dungen Doom**: `https://kivylius.com/games/dungen-doom/`

Because these run in live viewports communicating directly with upstream edge networks:
- Upstream bug fixes, class rebalances, or gameplay updates appear immediately for all visitors upon page reload.
- No local game binary mirrors are required, eliminating stale asset desynchronization.

### 2. Client-Side Real-Time Version Polling (`cache: 'no-store'`)
The application header and playable embed run a dynamic React hook that queries Torchbound's official release manifest (`/version.json`) every 3 minutes with `cache: 'no-store'`.

### 3. Automated Daily File Analyzer & GitHub Action (`00:00 UTC` Reset)
To keep all byte calculations, zip breakdowns, and bundle metrics synced automatically:
- **Cron Schedule**: Resets and executes automatically every night at **`00:00 UTC`** (`0 0 * * *`).
- **Automated Analyzer (`scripts/analyze_games.py`)**:
  1. Downloads the live `version.json`, `index.html`, and `Torchbound-Windows.zip` from Torchbound, plus the latest `index-*.js` and `index-*.css` bundles from Dungen Doom.
  2. Inspects the zip archive headers, measures uncompressed and gzip sizes, counts procedural texture keys, and updates `src/data/torchboundData.ts` and `src/data/dungenDoomData.ts`.
  3. Commits any updated calculations, tags a new GitHub Release, compiles the production bundle (`npm run build`), and deploys to GitHub Pages.

### 4. Version Evolution & Historical Tracking
The data layer tracks both **current** (`v3.0.7`) and **historical** (`v2.2.0`) breakdowns so visitors can use the interactive **Zip Inspector** toggle to compare file weights and packaging strategies across releases.

---

## Local Development

```bash
# Install dependencies
npm install --legacy-peer-deps

# Run local development server
npm run dev

# Build for production
npm run build
```
