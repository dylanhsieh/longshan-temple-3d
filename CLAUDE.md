# Longshan Temple 3D Tour — project notes for Claude

A browser 3D walk-through of Taipei's Longshan Temple (艋舺龍山寺), built procedurally with Three.js r128. The visitor is a single cube. No combat, NPCs or character models. This repo was split out of the "China Civil War Games" work, and reuses small helpers from its Village Siege 3D game.

## Build and run
- `python3 build.py` → `index.html` (one self-contained file, Three.js inlined from `vendor/three.min.js`, works offline from `file://`).
- Syntax check: `node --check tests/bundle-check.js` (written by the build).
- Open `index.html` in a browser. No server needed.

## Source layout (`src/`)
- `head.html` — page shell: meta, CSS, overlays (title, HUD buttons, info card, mini-map, jump list, pause/help, touch controls).
- `borrowed.js` — tiny helpers lifted from the Village Siege codebase: `$`, `rnd`, `clamp`, `seeded`, `store`, `mk` (canvas factory), `R` (fillRect), `TXC`/`tex` (cached nearest-filter textures).
- `details.js` — v2 detail layer: bracket sets (斗栱), caisson ceilings (藻井), door leaves with door guardians, carved stone panels, deity statues, offerings. Exposes `buildDetails()` and `detailMeshes()`.
- `realism.js` — v3 realism layer: HQ procedural textures with generated normal maps (`HQ`, `hqTex`), PBR materials (`makeMats`), sky image-based lighting (`makeEnv`), baked vertex AO (`bakeAO`), renderer upgrade (`upgradeRenderer`), smooth waterfall (`fallTex`).
- `tour.js` — the main program: text and hotspots (`TX`, `SPOTS`), collision grid, geometry buckets (`GB`, `G`), palette `K`, builders (`box`, `prism`, `seg`, `roof`, `skirt`, `hexRoof`, `column`, `dragonColumn`, `wallX/wallZ`, …), `buildTemple()`, renderer setup (`initGL`), scene build, visitor movement, camera, UI, input, main loop.
- Build order matters: borrowed → details → realism → tour. `details.js`/`realism.js` only define functions and their own consts; `tour.js` calls them during startup.

## World conventions
- Units are metres. +x = east, +z = south (toward Guangzhou St.), y up. The temple faces south.
- Static geometry is merged into a few buckets (`G.plain`, `G.tile`, `G.stone`, `G.wall`, `G.wood`, `G.ridge`, `G.shiny`, `G.brick`, `G.city`, `G.glow`) → ~70 draw calls total. Keep it that way: add geometry to buckets, avoid one mesh per small part.
- `GB.tri/quad(..., hint)`: the face normal is flipped to point AWAY from `hint`. For a surface seen from inside (ceilings, drums), put the hint on the outside.
- Colours in `K` are converted to linear (`col()` calls `convertSRGBToLinear()`); renderer uses sRGB output + ACES tone mapping. Colour textures must set `encoding = THREE.sRGBEncoding`; normal maps must not.
- Collision: 0.25 m grid. `setFloor` (walkable height), `solid`/`solidC` (blocking), `cover` (roof/ceiling height used by the camera). Steps up to ~0.5 m are walkable.

## Layout as modelled (see `docs/RESEARCH.md` for sources)
Mountain gate (1960, 4 columns / 3 bays) → forecourt (waterfall + koi pond east, fountain pool west) → Front Hall (三川殿, 11 bays, 5 doors, bronze dragon columns, octagonal caisson) → courtyard with incense burner and offering tables → Main Hall (正殿, Guanyin, double-eave hip-and-gable roof, spiral caisson Ø5.82 m, arhats) → rear courtyard → Rear Hall (後殿, 11 bays; Mazu, Wenchang, Guan Yu). Side wings (護龍) with the bell tower (east) and drum tower (west), hexagonal with sedan-chair roofs.

## Testing (Playwright, headless Chromium)
- `NODE_PATH=$(npm root -g) node tests/<file>.js` (never run `playwright install`; launch args `--use-gl=swiftshader --enable-webgl --ignore-gpu-blocklist`). Software WebGL is slow: allow 5–10 min timeouts.
- `ls-err.js` startup errors · `ls-walk.js` keyboard walk-through, collisions, teleports, camera/night/language toggles · `ls-mobile.js` touch at 844×390 and 390×844 · `ls-detail.js` / `ls-real.js` fixed-camera screenshots into `shots/` (look at them).
- Test hooks: `window.__lt` — `st()` state, `set(x,z,yaw,pitch,dist)`, `view(px,py,pz,lx,ly,lz)` fixed camera shot.

## User preferences
- Traditional Chinese (zh-TW) is the default UI language; English is the toggle (saved in localStorage).
- Do not publish anywhere (Artifacts, Pages, etc.) unless the user explicitly says "publish". Commit locally; push to this repo when asked.
- Keep accuracy notes honest: the model is an approximate, non-official recreation from public sources; don't invent facts for info cards.

## Status
- v1 layout + tour UX; v2 architectural detail; v3 textures/lighting realism. All tests pass (no page errors) on desktop and phone sizes.
- Known gaps: gold statues read slightly olive (metal reflecting blue sky); statues/door guardians/carvings are symbolic; real-device phone performance with PBR not measured; walk test legs time out under software WebGL (positions still reached).
- Ideas: ambient sound (bells, chanting, waterfall); more detailed porcelain ridge figures; night lighting polish; a quality toggle for low-end phones; photo-based textures (would grow the file).
