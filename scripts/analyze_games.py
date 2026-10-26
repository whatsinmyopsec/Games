#!/usr/bin/env python3
"""
Automated File Analyzer & Size Recalculator for Torchbound and Dungen Doom.
Runs on daily GitHub Actions schedule (00:00 UTC) or manually via `python3 scripts/analyze_games.py`.
"""
import urllib.request
import json
import zipfile
import io
import gzip
import re
from datetime import datetime, timezone

HEADERS = {"User-Agent": "Mozilla/5.0 (GameSizeAnalyzer/1.0)"}

def fetch_bytes(url: str) -> bytes:
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=30) as resp:
        return resp.read()

def analyze_torchbound():
    print("=== Analyzing Torchbound ===")
    v_data = json.loads(fetch_bytes("https://torchbound-duk.pages.dev/version.json").decode("utf-8"))
    version = v_data.get("version", "3.0.7")

    html_bytes = fetch_bytes("https://torchbound-duk.pages.dev/")
    html_raw = len(html_bytes)
    html_gzip = len(gzip.compress(html_bytes))
    html_mb = round(html_raw / (1024 * 1024), 2)
    html_gzip_kb = round(html_gzip / 1024)

    zip_bytes = fetch_bytes("https://torchbound-duk.pages.dev/download/Torchbound-Windows.zip")
    zip_total = len(zip_bytes)
    zip_mb = round(zip_total / (1000 * 1000), 1)

    exe_raw, exe_comp = 2738688, 1167613
    neu_raw, neu_comp = 2269404, 961044
    readme_raw, readme_comp = 491, 317

    with zipfile.ZipFile(io.BytesIO(zip_bytes)) as zf:
        for info in zf.infolist():
            if info.filename.endswith("Torchbound.exe"):
                exe_raw, exe_comp = info.file_size, info.compress_size
            elif info.filename.endswith("resources.neu"):
                neu_raw, neu_comp = info.file_size, info.compress_size
            elif info.filename.endswith("README.txt"):
                readme_raw, readme_comp = info.file_size, info.compress_size

    print(f"  Version: {version}")
    print(f"  Zip Total: {zip_total} bytes ({zip_mb} MB)")
    print(f"  index.html: {html_raw} bytes ({html_mb} MB) | Gzip: {html_gzip} bytes ({html_gzip_kb} KB)")
    print(f"  Torchbound.exe: raw={exe_raw}, comp={exe_comp}")
    print(f"  resources.neu: raw={neu_raw}, comp={neu_comp}")

    # Update src/data/torchboundData.ts
    with open("src/data/torchboundData.ts", "r", encoding="utf-8") as f:
        ts = f.read()

    now_utc = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    ts = re.sub(r"version: '[^']*'", f"version: '{version}'", ts, count=1)
    ts = re.sub(r"downloadZipSizeMB: [0-9.]+", f"downloadZipSizeMB: {zip_mb}", ts, count=1)
    ts = re.sub(r"downloadZipSizeBytes: [0-9]+", f"downloadZipSizeBytes: {zip_total}", ts, count=1)
    ts = re.sub(r"gameHtmlSizeBytes: [0-9]+", f"gameHtmlSizeBytes: {html_raw}", ts, count=1)
    ts = re.sub(r"gameHtmlSizeMB: [0-9.]+", f"gameHtmlSizeMB: {html_mb}", ts, count=1)
    ts = re.sub(r"gameHtmlGzipSizeBytes: [0-9]+", f"gameHtmlGzipSizeBytes: {html_gzip}", ts, count=1)
    ts = re.sub(r"gameHtmlGzipKB: [0-9]+", f"gameHtmlGzipKB: {html_gzip_kb}", ts, count=1)
    ts = re.sub(r"resourcesNeuBytes: [0-9]+", f"resourcesNeuBytes: {neu_raw}", ts, count=1)
    ts = re.sub(r"resourcesNeuCompressedBytes: [0-9]+", f"resourcesNeuCompressedBytes: {neu_comp}", ts, count=1)
    ts = re.sub(r"lastAnalyzedUTC: '[^']*'", f"lastAnalyzedUTC: '{now_utc}'", ts, count=1)

    with open("src/data/torchboundData.ts", "w", encoding="utf-8") as f:
        f.write(ts)

def analyze_dungen_doom():
    print("=== Analyzing Dungen Doom ===")
    dd_html = fetch_bytes("https://kivylius.com/games/dungen-doom/").decode("utf-8", errors="ignore")
    js_match = re.search(r'src="\.?/?assets/(index-[^"]+\.js)"', dd_html)
    css_match = re.search(r'href="\.?/?assets/(index-[^"]+\.css)"', dd_html)

    if not js_match:
        print("  Could not locate Dungen Doom JS bundle")
        return

    js_name = js_match.group(1)
    js_bytes = fetch_bytes(f"https://kivylius.com/games/dungen-doom/assets/{js_name}")
    js_raw = len(js_bytes)
    js_gzip = len(gzip.compress(js_bytes))
    js_mb = round(js_raw / (1024 * 1024), 2)
    js_gzip_kb = round(js_gzip / 1024)

    css_name = css_match.group(1) if css_match else "index.css"
    css_bytes = fetch_bytes(f"https://kivylius.com/games/dungen-doom/assets/{css_name}") if css_match else b""
    css_raw = len(css_bytes)
    css_gzip = len(gzip.compress(css_bytes)) if css_bytes else 0
    total_kb = round((js_gzip + css_gzip) / 1024)

    tex_keys = len(set(re.findall(r"tex\.[a-zA-Z0-9_.]+", js_bytes.decode("utf-8", errors="ignore"))))

    print(f"  JS ({js_name}): {js_raw} bytes ({js_mb} MB) | Gzip: {js_gzip} bytes ({js_gzip_kb} KB)")
    print(f"  CSS ({css_name}): {css_raw} bytes | Gzip: {css_gzip} bytes")
    print(f"  Procedural Texture Keys: {tex_keys}")

    with open("src/data/dungenDoomData.ts", "r", encoding="utf-8") as f:
        ts = f.read()

    now_utc = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    ts = re.sub(r"bundleName: '[^']*'", f"bundleName: '{js_name}'", ts, count=1)
    ts = re.sub(r"cssName: '[^']*'", f"cssName: '{css_name}'", ts, count=1)
    ts = re.sub(r"bundleSizeBytes: [0-9]+", f"bundleSizeBytes: {js_raw}", ts, count=1)
    ts = re.sub(r"bundleSizeMB: [0-9.]+", f"bundleSizeMB: {js_mb}", ts, count=1)
    ts = re.sub(r"bundleGzipBytes: [0-9]+", f"bundleGzipBytes: {js_gzip}", ts, count=1)
    ts = re.sub(r"bundleGzipKB: [0-9]+", f"bundleGzipKB: {js_gzip_kb}", ts, count=1)
    ts = re.sub(r"cssSizeBytes: [0-9]+", f"cssSizeBytes: {css_raw}", ts, count=1)
    ts = re.sub(r"cssGzipBytes: [0-9]+", f"cssGzipBytes: {css_gzip}", ts, count=1)
    ts = re.sub(r"totalTransferKB: [0-9]+", f"totalTransferKB: {total_kb}", ts, count=1)
    ts = re.sub(r"proceduralTextureCount: [0-9]+", f"proceduralTextureCount: {tex_keys}", ts, count=1)
    ts = re.sub(r"lastAnalyzedUTC: '[^']*'", f"lastAnalyzedUTC: '{now_utc}'", ts, count=1)

    with open("src/data/dungenDoomData.ts", "w", encoding="utf-8") as f:
        f.write(ts)

if __name__ == "__main__":
    analyze_torchbound()
    analyze_dungen_doom()
