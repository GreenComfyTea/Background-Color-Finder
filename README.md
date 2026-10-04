# Background Color Finder

A [Vite](https://vite.dev) 8 + [React](https://react.dev) 19 (TypeScript) + [Tailwind CSS v4](https://tailwindcss.com) single-page app, configured for deployment to GitHub Pages.

## Stack

| Tool              | Version   | Notes                                                        |
| ----------------- | --------- | ------------------------------------------------------------ |
| Vite              | `8.3.1`   | Pinned exact                                               |
| React / react-dom | `^19`     | Latest major, resolves to newest 19.x at install time     |
| Tailwind CSS      | `^4.3`    | Via the first-party `@tailwindcss/vite` plugin (no config file) |

## Development

```bash
npm install
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
