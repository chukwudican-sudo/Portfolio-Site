# Site assets

Drop-in files. Nothing here is required for the site to build — each feature
degrades to a placeholder until its file exists.

The hero portrait has two possible sources. The first that exists wins.

## 1. Real geometry — preferred

| File | Notes |
|---|---|
| `head-cloud.bin` | The baked point cloud — geometry from the Meshy scan, colour projected from the source photo. Produced by `npm run bake:head`; do not edit by hand. |

Geometry comes from `assets-src/head.glb`, colour from `assets-src/head-photo.jpg`.
Those sources are gitignored (the GLB is ~34 MB) and are only needed to re-bake.
Re-run after replacing either:

```
npm run bake:head                 # defaults: 220k points
npm run bake:head -- --points 400000
```

The Meshy GLB carries geometry only — no UVs, texture or vertex colours — so the
likeness has to come from the photo. The bake projects the photo onto the mesh's
front view (they share a camera, since the mesh was generated from that photo),
auto-levels the subject's luminance, and maps it through the site's ramp. See
`scripts/bake-head.mjs` and `lib/headPointCloud.ts`.

## 2. Photo + depth map — fallback

| File | Notes |
|---|---|
| `head-photo.png` (or `.jpg`) | Portrait. A **cutout PNG** (background removed) is preferred. |
| `head-depth.png` | Optional. Grayscale depth, **pixel-aligned and same dimensions** as the photo. Background pure black (`#000` = discarded), brighter = closer. Generate with Depth Anything V2 / MiDaS, or export iPhone Portrait-mode depth. |

2.5D: real parallax, but depth is displaced from an image rather than measured,
so there's no true facial relief. Without a depth map one is synthesised from
the cutout's alpha plus luminance. See `lib/pointCloud.ts`.

## Other

| File | Used by |
|---|---|
| `Chukwudi_Ndubuisi_Resume.pdf` | The "Download résumé" button in Contact. |

With none of these present the ID card keeps its gradient panel and "drag to
rotate" label — it never falls back to a flat photo.

**Note:** which assets exist is resolved on the server (`lib/assets.ts`), so
after adding a file, restart the dev server for it to be picked up.
