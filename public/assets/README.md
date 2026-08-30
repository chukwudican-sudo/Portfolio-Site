# Site assets

Drop-in files. Nothing here is required for the site to build — each feature
degrades to a placeholder until its file exists.

| File | Used by | Notes |
|---|---|---|
| `head-photo.png` (or `.jpg`) | Hero ID card | The portrait. A **cutout PNG** (background removed) is preferred — the depth map can then be synthesised from its alpha channel. |
| `head-depth.png` | Hero ID card | Optional but preferred. Grayscale depth map, **pixel-aligned and same dimensions** as the photo. Background pure black (`#000` = discarded), brighter = closer to camera. Generate with Depth Anything V2 / MiDaS, or export from an iPhone Portrait-mode shot. |
| `Chukwudi_Ndubuisi_Resume.pdf` | Contact section | The "Download résumé" button links here. |

Without `head-photo.*` the ID card keeps its gradient panel and "drag to rotate"
label. With the photo but no depth map, the depth is synthesised from the
cutout's alpha plus luminance — see `lib/pointCloud.ts`.
