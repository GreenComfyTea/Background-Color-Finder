# Background Color Finder

Find the five RGB colors with the strongest, most consistent perceptual separation from an image. Images are processed on-device; remote image hosts must allow CORS.

## Image analysis

- Load images through the file picker, paste image data anywhere on the page, or type/paste an HTTP(S) or image data URL.
- Scan every native-resolution pixel. Fully transparent pixels are excluded; partial alpha is composited against a configurable background.
- Build an exact frequency histogram, then adaptively split it into 1–64 representative colors. Stop when pixel-weighted RMS OKLab representation error is at most 0.02, or when 64 groups are reached. The UI reports achieved error and whether the target was met.
- Every analyzed pixel remains assigned to a group: coverage is always 100%, even when the representation-error target cannot be met.
- A background worker evaluates all 16,777,216 RGB candidates against every final palette color. Rank by equal-weight mean Euclidean OKLab distance minus population standard deviation. Exact ties prefer greater minimum distance, smaller deviation, then ascending RGB order.
- Results include HEX/RGB copy controls, detailed statistics, and a selectable image backdrop. Exact top-five colors can look similar; no diversity filter is applied.

OKLab distance is a perceptual-separation measure, **not a WCAG text-readability guarantee**. Palette formation uses pixel frequencies; candidate ranking gives each final palette color equal weight.

Safety limits are 50 MB, 16 million pixels, and 500,000 distinct effective RGB colors. Images exceeding these limits are rejected explicitly, never silently sampled or resized. Animated images use one browser-decoded frame. Cancel stops the worker immediately.

## Validation

Run the test, lint, and build scripts defined in [package.json](package.json). Tests include OKLab reference values, full-coverage adaptive grouping, alpha handling, scoring equivalence, image-loader validation/cancellation, and a complete 24-bit RGB search. The deployment workflow runs all three checks.

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
