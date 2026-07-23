# Daniel Tsang — Portfolio

Personal portfolio and blog for [Daniel Tsang](https://thmingg.github.io/), a web-focused software engineer.

Built with [Astro](https://astro.build/) on top of the [AstroPaper](https://github.com/satnaing/astro-paper) theme.

**Live site:** https://thmingg.github.io/

## Features

- Hybrid home page (Who Am I, Projects, Blog, Contact)
- Project collection with detail pages, thumbnails, and media support
- Blog with Pagefind search, tags, and RSS
- Tech badges with brand icons (Simple Icons)
- Light/dark themes (teal / carbon black)
- Scroll reveal and hero entrance motion
- Static site, SEO-friendly, TypeScript throughout

## Project structure

```bash
/
├── public/
├── src/
│   ├── components/       # UI (Header, ProjectCard, TechBadge, …)
│   ├── content/
│   │   ├── pages/        # About page markdown
│   │   ├── posts/        # Blog posts
│   │   └── projects/     # Project entries + images/
│   ├── data/tech.ts      # Tech icon / color map
│   ├── pages/            # Routes (/, /about, /projects, /posts, …)
│   ├── scripts/          # Theme + reveal motion
│   └── styles/           # theme, motion, typography
├── astro-paper.config.ts # Site identity, socials, features
└── astro.config.ts
```

## Getting started

Requires **Node.js ≥ 22.12**.

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:4321`).

### Useful scripts

| Command           | Description                                      |
| ----------------- | ------------------------------------------------ |
| `npm run dev`     | Start local development server                   |
| `npm run build`   | Typecheck, build, and generate Pagefind index    |
| `npm run preview` | Preview the production build locally             |
| `npm run format`  | Format with Prettier                             |
| `npm run lint`    | Run ESLint                                       |

## Content

### Blog posts

Add markdown/MDX under `src/content/posts/`.

### Projects

Add markdown under `src/content/projects/`. Example frontmatter:

```yaml
title: "Project name"
description: "Short summary"
company: "Company"
role: "Full Stack Developer"
period: "2024 – 2025"
stack:
  - TypeScript
  - React
featured: true
order: 1
heroImage: ./images/my-hero.svg
# videoUrl: https://www.youtube.com/watch?v=...
# gallery:
#   - ./images/shot-1.png
```

Replace placeholder SVGs in `src/content/projects/images/` with real screenshots when ready.

### Site config

Edit [`astro-paper.config.ts`](astro-paper.config.ts) for site URL, author, social links, and feature flags.

### Theme colors

Tokens live in [`src/styles/theme.css`](src/styles/theme.css) (light teal + dark carbon).

### Tech icons

Map labels → icons/colors in [`src/data/tech.ts`](src/data/tech.ts). Include new Simple Icons names in the `astro-icon` config in [`astro.config.ts`](astro.config.ts).

## Deploy

This repo deploys as a GitHub Pages user site from [`thmingg/thmingg.github.io`](https://github.com/thmingg/thmingg.github.io).

```bash
npm run build
```

Serve the `dist/` output (or let GitHub Pages build from `master` if a workflow is configured).

## Credit

Theme base: [AstroPaper](https://github.com/satnaing/astro-paper) by [Sat Naing](https://satnaing.dev/).
