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

## License

Proprietary. All rights reserved. See [LICENSE](LICENSE).
