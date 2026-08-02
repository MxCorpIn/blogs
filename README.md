# Ossium Blog

The official blog of [Ossium](https://ossium.in) - practical guides, how-tos, and Q&A on open source contribution, GSoC, good first issues, GitHub workflows, and tools for contributors.

[![CI](https://img.shields.io/github/actions/workflow/status/MxCorpIn/blogs/ci.yml?branch=main&label=CI)](https://github.com/MxCorpIn/blogs/actions/workflows/ci.yml)
[![Stars](https://img.shields.io/github/stars/MxCorpIn/blogs)](https://github.com/MxCorpIn/blogs)
[![Version](https://img.shields.io/github/package-json/v/MxCorpIn/blogs)](https://github.com/MxCorpIn/blogs/blob/main/package.json)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/MxCorpIn/blogs/blob/main/LICENSE)

**Live demo:** [blog.ossium.in](https://blog.ossium.in)

## Overview

A fast, static-friendly blog built with Next.js (App Router) and Tailwind CSS, powered by Markdown. Posts live in `content/posts/` as plain Markdown files with YAML frontmatter- no CMS, no database.

## Features

- **Markdown-first content** - every post is a `.md` file with YAML frontmatter
- **Static generation (SSG)** - all post pages pre-rendered at build time for fast loads and strong SEO
- **Search + filters** - client-side search across title, description, tags, and keywords, with type (`article` / `guide` / `how-to` / `Q&A`) and category filters
- **Featured rail** - a sticky "Featured" column on the listing page
- **Light/dark theme** - dark by default, with a persisted, flash-free toggle
- **SEO out of the box** - per-post metadata, JSON-LD (`Blog`, `FAQ` for `question` posts), `sitemap.xml`, `robots.txt`, and an RSS 2.0 feed
- **Reading time** - estimated from the Markdown body (~200 wpm)
- **Related posts** - ranked by category, type, and shared tags

## Tech stack

| Layer     | Choice                                                                |
|--------- |---------------------------------------------------------------------- |
| Framework | [Next.js](https://nextjs.org) 15 (App Router)                        |
| UI        | [React](https://react.dev) 19 + [Tailwind CSS](https://tailwindcss.com) v4 |
| Content   | Markdown + YAML frontmatter (`content/posts/`)                       |
| Rendering | [react-markdown](https://github.com/remarkjs/react-markdown) + [remark-gfm](https://github.com/remarkjs/remark-gfm) |
| Fonts     | Inter (body), General Sans (headings), JetBrains Mono (code) - loaded from CDN |
| Language  | TypeScript (strict)                                                   |
| Package manager | pnpm                                                           |

## Getting started

### Prerequisites

- **Node.js 20+** (see `engines` in `package.json`)
- **pnpm 8+** - the repo pins `pnpm@11.15.1` via `packageManager`; enable it with `corepack enable` if you use Corepack

### 1. Clone the repo

```bash
git clone https://github.com/MxCorpIn/blogs.git
cd ossium-blog
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

| Variable              | Description                                                                                                                 |
|--------------------- |---------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_APP_URL` | Public base URL of the site. Used for canonical URLs, RSS links, sitemap, and OG image URLs. Use `http://localhost:3000` locally and your deployed domain (e.g. `https://blog.ossium.in`) in production. |

See [.env.example](.env.example) for the complete list with inline comments.

### 4. Start the dev server

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
├── app/                  # Next.js App Router - pages, layouts, SEO routes
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
├── content/posts/        # Blog posts - Markdown + YAML frontmatter
├── lib/
│   ├── content/          # Frontmatter parser, post loading, related posts
│   ├── constants.ts      # APP_URL, APP_CONFIG, SOURCE_EDIT_BASE
│   └── utils.ts          # cn() classname helper
├── public/                # Static assets (logos, demo images)
├── .github/               # Issue/PR templates, CI workflow, FUNDING
└── next.config.ts          # Next.js config (security headers, image caching)
```

## Writing posts

1. Create `content/posts/your-slug.md` (the slug is the filename without `.md`).
2. Add YAML frontmatter (see [content/posts/README.md](content/posts/README.md) for the full schema).
3. Write the body in Markdown.
4. Visit `/{slug}` locally - the sitemap and RSS feed pick up published posts automatically.

```yaml
---
title: "Clear, keyword-aware title"
description: "1–2 sentences for SEO meta and cards (~150–160 chars ideal)."
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
answerSummary: "Only for type=question - short answer for FAQ rich results."
---
```

Set `draft: true` to hide a post from production until it's ready.

## Contributing

Contributions are welcome - content corrections, new posts, and code improvements all count. Please read [CONTRIBUTING.md](CONTRIBUTING.md) first for branch naming, commit message format, and the PR checklist. All community interaction is governed by our [Code of Conduct](CODE_OF_CONDUCT.md).

Thanks to everyone who has contributed content, code, and support in issues, pull requests, and discussions:

<a href="https://github.com/mxcorpin/blogs/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=mxcorpin/blogs&max=400&columns=20" />
</a>

## License

- **Code** (everything under `app/`, `components/`, `lib/`, and config files) - [MIT License](LICENSE)
- **Content** (everything under `content/posts/`) - Copyright © 2026 Ossium. All rights reserved. Do not republish blog posts without permission.

## Support

Questions or content corrections? Email [help@ossium.in](mailto:help@ossium.in) or open a [GitHub issue](https://github.com/MxCorpIn/blogs/issues).