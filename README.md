# Leaf & Root

A responsive botanical shop built with TypeScript, HTML and CSS.

## Open immediately

Open index.html in your browser. Compiled JavaScript and all six original SVG plant illustrations are included. Plant artwork works offline; Google Fonts is optional and falls back to local fonts.

## Develop

Requires Node.js and npm, plus Python 3 for the optional local server.

```bash
npm install
npm run check
npm run build
npm run dev
```

Visit http://localhost:5173. After editing src/main.ts, run npm run build again and refresh.

## Features

- Search by plant or botanical name
- Category filtering and price sorting
- Plant care details in accessible native dialogs
- Persistent cart, quantity controls and removal
- Responsive mobile layout and reduced-motion support
- Order preview (demo only)

This is a frontend demo. No real payments, orders, stock management or delivery services are connected. Catalog prices and brand are fictional. To launch a commercial store, add a backend and payment provider.

## Structure

index.html — page structure
src/main.ts — TypeScript application
assets/main.js — compiled JavaScript
assets/style.css — responsive styles
assets/*.svg — original plant illustrations
tsconfig.json — strict TypeScript compilation

Artwork is included for use and modification with this project.
