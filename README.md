# ossium-blog

The official blog of [ossium](https://ossium.in) — practical guides, how-tos, and Q&A on open source contribution, GSoC, good first issues, GitHub workflows, and tools for contributors.

[![CI](https://img.shields.io/github/actions/workflow/status/MxCorpIn/blogs/ci.yml?branch=main&label=CI)](https://github.com/MxCorpIn/blogs/actions/workflows/ci.yml)
[![Stars](https://img.shields.io/github/stars/MxCorpIn/blogs)](https://github.com/MxCorpIn/blogs)
[![Version](https://img.shields.io/github/package-json/v/MxCorpIn/blogs)](https://github.com/MxCorpIn/blogs/blob/main/package.json)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/MxCorpIn/blogs/blob/main/LICENSE)

## What is this?

A fast, static-friendly blog built with Next.js (App Router) and Tailwind CSS, powered by Markdown. Posts live in `content/posts/` as plain Markdown files with YAML frontmatter — no CMS, no database.

**Live demo:** <https://blog.ossium.in>

## Features

- **Markdown-first content** — every post is a `.md` file with YAML frontmatter; no CMS or database required
- **Static generation (SSG)** — all post pages pre-rendered at build time for fast loads and good SEO
- **Search + filters** — client-side search across title, description, tags, and keywords, with type (`article`/`guide`/`how-to`/`Q&A`) and category filters
- **Featured rail** — a sticky "Featured" column on the listing
- **Light/dark theme** — dark by default with a persisted, flash-free toggle
- **SEO out of the box** — per-post metadata, JSON-LD (`Blog`, `FAQ` for `question` posts), `sitemap.xml`, `robots.txt`, and an RSS 2.0 feed
- **Reading time** — estimated from the Markdown body (~200 wpm)
- **Related posts** — ranked by category, type, and shared tags
- **Security headers** — CSP, `X-Frame-Options`, and more (see `next.config.ts`)

## Tech stack

| Layer     | Choice                                                                                                              |
| --------- | ------------------------------------------------------------------------------------------------------------------- |
| Framework | [Next.js](https://nextjs.org) 15 (App Router)                                                                       |
| UI        | [React](https://react.dev) 19 + [Tailwind CSS](https://tailwindcss.com) v4                                          |
| Content   | Markdown + YAML frontmatter (`content/posts/`)                                                                      |
| Rendering | [react-markdown](https://github.com/remarkjs/react-markdown) + [remark-gfm](https://github.com/remarkjs/remark-gfm) |
| Fonts     | Inter (body) + General Sans (headings) + JetBrains Mono (code), loaded from CDN                                     |
| Language  | TypeScript (strict)                                                                                                 |
| Package   | pnpm                                                                                                                |

## Getting started

### Prerequisites

- **Node.js 20+** (`engines` in `package.json`)
- **pnpm 8+** (the repo pins `pnpm@11.15.1` via `packageManager` — enable with `corepack enable` if you use Corepack)

### 1. Clone

```bash
git clone https://github.com/MxCorpIn/blogs.git
cd ossium-blog
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Set up environment variables

Copy the example file and edit it:

```bash
cp .env.example .env
```

| Variable              | Description                                                                                                                                                                                                 |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_APP_URL` | Public base URL of the site. Used for canonical URLs, RSS links, sitemap, and OG image URLs. Set to `http://localhost:3000` locally and your deployed domain (e.g. `https://blog.ossium.in`) in production. |

See [.env.example](.env.example) for the complete list with inline comments.

### 4. Run the dev server

```bash
pnpm dev
```

Open <http://localhost:3000>.

### 5. Build for production

```bash
pnpm build && pnpm start
```

## Folder structure

```
ossium-blog/
├── app/                  # Next.js App Router — pages, layouts, SEO routes
│   ├── [slug]/page.tsx   # Individual post pages (SSG via generateStaticParams)
│   ├── BlogListing.tsx   # Client component: search, filters, featured rail
│   ├── feed.xml/route.ts # RSS 2.0 feed
│   ├── sitemap.ts        # Sitemap (listing + every post)
│   ├── robots.ts         # robots.txt
│   └── layout.tsx        # Root layout (theme, metadata, fonts)
├── components/           # React components
│   ├── blog/             # PostCard, MarkdownBody, ShareButton
│   ├── landing/          # Footer, DashedFrame
│   ├── theme/            # ThemeToggle
│   └── ui/               # Container
├── content/posts/        # Blog posts — Markdown + YAML frontmatter
├── lib/
│   ├── content/          # Frontmatter parser, post loading, related posts
│   ├── constants.ts      # APP_URL, APP_CONFIG, SOURCE_EDIT_BASE
│   └── utils.ts          # cn() classname helper
├── public/               # Static assets (logos, demo images)
├── .github/              # Issue/PR templates, CI workflow, FUNDING
├── next.config.ts        # Next.js config (security headers, image caching)
└── ...
```

## Writing posts

1. Create `content/posts/your-slug.md` (slug = filename without `.md`).
2. Add YAML frontmatter (see [content/posts/README.md](content/posts/README.md)).
3. Write the body in Markdown.
4. Visit `/{slug}` locally — the sitemap and RSS feed pick up published posts automatically.

```yaml
---
title: "Clear, keyword-aware title"
description: "1–2 sentences for SEO meta and cards (≈150–160 chars ideal)."
type: article | guide | howto | question
category: contribution | gsoc | github | career | tools | programs | beginners
tags: [tag-one, tag-two]
keywords: [seo keyword one, seo keyword two]
publishedAt: 2026-07-11
updatedAt: 2026-07-11
author: ossium
authorUrl: https://ossium.in
featured: false
draft: false
image: /demo/oss_landingpage.webp
answerSummary: "Only for type=question — short answer for FAQ rich results."
---
```

Set `draft: true` to hide a post from production until it's ready.

## Scripts

| Command             | Description                           |
| ------------------- | ------------------------------------- |
| `pnpm dev`          | Start the development server          |
| `pnpm build`        | Production build (SSG)                |
| `pnpm start`        | Start the production server           |
| `pnpm lint`         | Run ESLint                            |
| `pnpm format`       | Format all source files with Prettier |
| `pnpm format:check` | Verify formatting (CI)                |
| `pnpm typecheck`    | Run `tsc --noEmit`                    |
| `pnpm test`         | Run the test suite (Vitest)           |

## Contributing

Contributions are welcome — content corrections, new posts, and code improvements all count. Please read [CONTRIBUTING.md](CONTRIBUTING.md) first. It covers the branch naming, commit message format, and the PR checklist. All community interaction is governed by our [Code of Conduct](CODE_OF_CONDUCT.md).

## License

- **Code** (everything under `app/`, `components/`, `lib/`, and config files) is licensed under the **MIT License** — see [LICENSE](LICENSE).
- **Content** (everything under `content/posts/`) is **Copyright (c) 2026 Ossium. All rights reserved.** — do not republish blog posts without permission.

## Support

Questions or content corrections? Email [help@ossium.in](mailto:help@ossium.in) or open a [GitHub issue](https://github.com/MxCorpIn/blogs/issues).
