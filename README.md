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

| Feature | Torchbound (2D RPG v2.5.1) | Dungen Doom (3D Retro FPS) | Conventional Game |
| :--- | :--- | :--- | :--- |
| **Download Zip** | **1.6 MB Zip** (was 13.2 MB) | N/A (Web App) | 500 MB – 5 GB |
| **Initial Transfer** | ~298 KB gzipped | ~357 KB gzipped | 100 MB – 2 GB |
| **3D / 2D Engine** | HTML5 Canvas 2D (`destination-out`) | Three.js WebGL + 2.5D Billboards | Unity / Unreal Engine |
| **Textures** | Base64 RLE pixel strings | Procedural `THREE.CanvasTexture` in memory | 50 MB+ PNG/DDS atlases |
| **Audio** | 100% Procedural Web Audio oscillators | On-demand 2KB Kenney micro-samples | 50 MB+ WAV/OGG files |
| **3D Models** | N/A (2D grid) | 0 bytes (camera-facing quad sprites) | 20 MB+ rigged FBX meshes |

---

## The v2.5.1 Release Update (13.2 MB → 1.6 MB)

In the latest release of Torchbound (**v2.5.1**), the developer decoupled the two pre-rendered MP4 video cutscenes and bundled the game into `resources.neu`. The Windows zip shrank from **13.2 MB down to 1.6 MB**—an **88% reduction** that directly validated our study's findings!

### Automated Game Updates
1. **Real-Time Client-Side Poller**: The site checks `https://torchbound-duk.pages.dev/version.json` dynamically with `cache: 'no-store'` so visitors always see live upstream releases.
2. **Automated GitHub Action**: `.github/workflows/check-updates.yml` runs daily at 00:00 UTC to verify and deploy upstream updates automatically to GitHub Pages.

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
