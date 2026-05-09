# arguslabs.dev

The marketing site for ARGUS — Adaptive RDMA Guard & Utilization Sentinel.

Built with Vite, React, TypeScript, and Tailwind CSS.

## Development

Requires Node 20+.

```
npm install
npm run dev
```

Dev server runs at http://localhost:5173/.

## Build

```
npm run build
```

Output goes to `dist/`.

## Project layout

- `src/components/` — page sections (Navbar, Hero, Problem, Features, HowItWorks, Install, Footer) and the Wordmark logo
- `src/lib/links.ts` — centralized URLs (GitHub repo, contact email). Edit here when endpoints change.
- `src/index.css` — Tailwind layers, gradient utilities, ambient animation keyframes
- `tailwind.config.ts` — palette (Luminous Blue, Energy Orange, Pop Pink, Meadowland, Clay) and motion keyframes
- `public/favicon.svg` — favicon (signal-bar mark)

## Deployment

Hosted on GitHub Pages at https://arguslabs.dev.

Every push to `main` triggers `.github/workflows/deploy.yml`, which runs `npm ci && npm run build` and publishes `dist/` to GitHub Pages. The custom domain is set via `public/CNAME` (Vite copies it into the build output).

To change the domain: edit `public/CNAME` and update DNS at the registrar.

## License

Proprietary. All rights reserved. See [LICENSE](LICENSE).
