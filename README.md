# Risk Reward Calculator

Modernized Next.js app for calculating trade position sizing with type-safe utilities and Tailwind-driven UI.

## Stack

- Next.js App Router with TypeScript
- React 18 + React DOM
- Tailwind CSS for styling
- Modular calculation helpers in `lib/riskReward.ts`

## Getting Started

Install dependencies and launch the local dev server:

```bash
npm install
npm run dev
```

Run a production build and preview it locally:

```bash
npm run build
npm start
```

Lint the project:

```bash
npm run lint
```

## Project Layout

- `app/` – App Router entrypoints and global styles
- `components/` – Reusable UI building blocks split by domain
- `lib/` – Pure calculation helpers with unit-friendly formatting utilities

## Features

- Live recalculation of quantity, risk, and profit metrics as inputs change
- System-aware dark mode with manual override
- Quick presets for balance, risk %, and R:R ratios
- Decorative background rendered via SVG for a trading-inspired feel
