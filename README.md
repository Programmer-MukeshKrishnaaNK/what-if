# WHAT IF? — An interactive science experience

**Change one rule of reality. See what happens next.**

WHAT IF? lets you explore hypothetical questions — *What if Earth suddenly stopped rotating? What if the Sun disappeared?* — one consequence at a time. Each question opens an interactive visualization and a scientific discovery, then lets you choose which consequence to follow next, through a branching chain of discoveries to a conclusion.

## Features

- **10 questions** spanning planets, space, biology, oceans, the atmosphere and human life
- **Consequence-based branching** — each question is a small graph of 5 discoveries with 2 endings; you choose which consequence to follow
- **Scientific explanations** with every claim labelled *Established*, *Inferred* or *Hypothetical*
- **Interactive visualizations** (Canvas 2D) you can play, pause and scrub
- **Calculated data** — computed values are marked and their formulas shown
- **Conclusions** that summarize each chain of consequences with key numbers
- **Responsive and accessible** — works on desktop and mobile, keyboard navigable, respects reduced motion
- **Optional ambient sound**, off by default
- Shareable URLs for every discovery (`#/what-if/<question>/<node>`)

## Tech stack

- TypeScript
- Vite
- Canvas 2D and plain DOM (no UI framework)
- Self-hosted fonts via Fontsource (Newsreader, Schibsted Grotesk, IBM Plex Mono)
- Web Audio API

## Getting started

Requires Node.js.

```bash
npm install
npm run dev      # http://localhost:5300
```

Build for production:

```bash
npm run build    # type-checks, then builds to dist/
npm run preview  # serves dist/ on http://localhost:5301
```

## Project structure

```
src/
  data/       Scenario content and branching graphs (one file per question)
  viz/        Visualizations (one module per type, lazy-loaded)
  ui/         Pages, the visualization stage, controls
  app/        Routing, path memory, audio, motion preferences
  styles/     CSS
public/audio/ Ambient sound loop
tools/        Script that renders the ambient loop
```

To add a question, add a content file in `src/data/scenarios/` and an entry in `src/data/scenarios/catalog.ts`.

## License

[MIT](LICENSE)
