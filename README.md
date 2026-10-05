# To Retry or Not to Retry?

A polished, interactive human version of the **“To Retry or Not to Retry?”** Kaggle benchmark. Built with Vite, Svelte, and TypeScript, the static site presents 14 API retry scenarios, reveals the reasoning after each answer, and compares the final human score with averages from three AI benchmark runs.

Visitors can also browse every scenario and answer as a compact reference without taking the test. Everything runs locally in the browser; answers are never collected or sent anywhere.

## Requirements

- Node.js
- npm

## Run locally

```bash
npm install
npm run dev
```

Vite will print the local development URL in the terminal.

## Production build

```bash
npm run build
```

The generated `dist/` directory is a fully static site. You can preview it locally with:

```bash
npm run preview
```

## Deploy to GitHub Pages

1. Run `npm run build`.
2. Publish the contents of `dist/` with a GitHub Pages workflow or a deployment branch.
3. Configure Pages in the repository settings to use that workflow or branch.

The Vite `base` option is set to `./`, so the generated assets work from a repository subpath as well as from a custom domain. The same `dist/` output can also be deployed to Netlify, Cloudflare Pages, or another static host.

## Editing benchmark data

- Scenario content and expected decisions: `src/scenarios.ts`
- Model names and all three run scores: `src/models.ts`
- Score messages and comparison rules: `src/scoring.ts`
- Svelte screens and shared UI: `src/components/`
- Routing and in-memory quiz session: `src/App.svelte`

The quiz, scenario browser, results, and review screens render from these shared typed data structures.
