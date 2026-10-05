# Background Color Finder

Find the best RGB colors in 12 dark/light categories with strong, consistent perceptual separation from an image. Images are processed on-device; remote image hosts must allow CORS.

## Image analysis

- Load images through the file picker, paste image data anywhere on the page, or type/paste an HTTP(S) or image data URL.
- Scan every native-resolution pixel. Fully transparent pixels are excluded; partial alpha is composited against a configurable background.
- Build an exact frequency histogram, preserve the darkest and lightest actual source colors (by OKLab lightness), then repeatedly select the source color farthest from its nearest existing representative. Selection is independent of pixel frequency and location; representatives are never averaged or replaced. Stop when both pixel-weighted RMS OKLab error is at most 0.02 and worst-case nearest-representative distance is at most 0.05, or when 64 colors are reached. The UI reports both achieved errors and individual target statuses.
- Every analyzed pixel remains assigned to a group: coverage is always 100%, even when the representation-error target cannot be met.
- A background worker evaluates all 16,777,216 RGB candidates in one pass against every final palette color and tracks one best candidate per category. Score by **minimum palette distance × max(0, equal-weight mean Euclidean OKLab distance − population standard deviation)**. Exact collisions with a palette color score zero. Exact ties prefer greater minimum distance, smaller deviation, then ascending RGB order.
- Categories are dark/light overall, dark/light exact grayscale, and dark/light red, green, blue, yellow. Dark means OKLab lightness <0.60 and light means >=0.60. Grayscale requires R=G=B. Named families additionally require OKLab lightness from 0.40 to 0.90 inclusive, OKLab chroma >=0.10, HSL saturation >=60%, and hue within 15 degrees of red 0°, green 120°, blue 240°, yellow 60°. Overall and grayscale retain their full ranges, including black and white; near-black, near-white, and weakly chromatic colors cannot enter named families. These are practical perceptual naming heuristics, not guarantees for every viewer; dark yellow tends toward ochre/olive. HSL is only an eligibility filter, not the scoring metric.
- After ranking, check all 12 winners against every visible source pixel using the same alpha compositing. Report the actual nearest-source OKLab distance and HEX color separately from palette minimum. Duplicate RGB winners share internal verification calculations but retain every category label and their fixed display order. Verification does not rerank and remains cancellable.
- Results show six dark/light pairs with HEX/RGB copy controls, detailed statistics, and selectable backdrops. A color can legitimately win multiple categories; it is not replaced with a worse candidate to force uniqueness. The initial preview uses the highest-scoring category winner.

OKLab distance is a perceptual-separation measure, **not a WCAG text-readability guarantee**. Rare dark or saturated colors anywhere in the image compete for palette selection based on perceptual distance, not pixel count. Frequencies determine RMS stopping and assigned-group percentages; candidate ranking gives each final palette color equal weight. A 64-color palette cannot guarantee retention of every distinct source color. The new score penalizes weak palette separation, but final source verification may still report a collision with an unrepresented source color; it reports that fact rather than silently filtering or reranking results. The worst-case target is a representation heuristic, not a candidate rejection threshold.

Safety limits are 50 MB, 16 million pixels, and 500,000 distinct effective RGB colors. Images exceeding these limits are rejected explicitly, never silently sampled or resized. Animated images use one browser-decoded frame. Cancel stops the worker immediately.

## Validation

Run the test, lint, and build scripts defined in [package.json](package.json). Tests include OKLab reference values, full-coverage adaptive grouping, alpha handling, scoring equivalence, image-loader validation/cancellation, and a complete 24-bit RGB search. The deployment workflow runs all three checks.

The saved [Imgur image histogram fixture](src/utils/fixtures/imgur-87I99Jg.json) records decoded RGBA frequencies from the user-provided image URL. Positions are omitted because these algorithms are spatially independent. Its regression exhaustively verifies 12 eligible category winners, including #FF0050 as the overall light winner, then independently checks the nearest-source distance and color for every result. Tests do not require remote image availability.

The project records legacy npm peer resolution in [.npmrc](.npmrc) because the starter's React lint plugin does not yet declare support for its ESLint 10 version. Dependency auditing currently reports seven high-severity transitive advisories in the existing shadcn CLI chain; the suggested automatic fix is a breaking CLI downgrade and has not been applied.

A [Vite](https://vite.dev) 8 + [React](https://react.dev) 19 (TypeScript) + [Tailwind CSS v4](https://tailwindcss.com) single-page app, configured for deployment to GitHub Pages.

## Stack

| Tool              | Version   | Notes                                                        |
| ----------------- | --------- | ------------------------------------------------------------ |
| Vite              | `8.3.1`   | Pinned exact                                               |
| React / react-dom | `^19`     | Latest major, resolves to newest 19.x at install time     |
| Tailwind CSS      | `^4.3`    | Via the first-party `@tailwindcss/vite` plugin (no config file) |

## Development

```bash
npm install --legacy-peer-deps
npm run dev      # http://localhost:5173/Background-Color-Finder/
```

> The app is served from the `/Background-Color-Finder/` base path by default (see `vite.config.ts`).

## Build & Preview

```bash
npm run build    # type-checks (tsc -b) then outputs a static site to dist/
npm run preview  # serve the production build locally
```

The base path is controlled by the `VITE_BASE` env var, defaulting to `/Background-Color-Finder/`:

```bash
VITE_BASE="/" npm run build   # or set VITE_BASE per your target path
```

## Deployment (GitHub Pages)

1. Create a GitHub repo named `Background-Color-Finder` and push this project.
2. In the repo **Settings → Pages**, choose **GitHub Actions** as the source.
3. Push to `main` — the [`deploy.yml`](.github/workflows/deploy.yml) workflow builds and publishes the site automatically.

The site is served at:

```
https://<username>.github.io/Background-Color-Finder/
```

The workflow uses `actions/deploy-pages` (the modern Pages deployment method) and is triggered on push to `main` or manually via **Actions → Run workflow**.
