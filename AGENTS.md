# AGENTS.md

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

Instructions for AI coding agents working on this repository.

## Project Overview

**ossium-blog** — the official blog for [Ossium](https://ossium.in), a static-first Next.js site powered by Markdown posts. Live at [blog.ossium.in](https://blog.ossium.in).

| Layer           | Choice                                         |
| --------------- | ---------------------------------------------- |
| Framework       | Next.js 16 (App Router, static generation)     |
| UI              | React 19 + Tailwind CSS v4                     |
| Language        | TypeScript (strict)                            |
| Package Manager | pnpm 11.15.1                                   |
| Content         | Markdown + YAML frontmatter (`content/posts/`) |
| Testing         | Vitest + Testing Library                       |
| Linting         | ESLint 9 (flat config) + Prettier              |

## Essential Commands

Run from the project root. All must pass before committing.

```bash
pnpm install          # install dependencies
pnpm dev              # dev server at http://localhost:3000
pnpm build            # production build (SSG)
pnpm lint             # ESLint
pnpm typecheck        # tsc --noEmit
pnpm format           # format with Prettier
pnpm format:check     # check formatting (CI)
pnpm test             # run Vitest once
pnpm test:watch       # Vitest in watch mode
```

Full verification before pushing:

```bash
pnpm lint && pnpm typecheck && pnpm format:check && pnpm test && pnpm build
```

## Code Conventions

- **TypeScript strict mode** — no `any`, no `@ts-ignore`.
- **Path alias** — use `@/` for all imports (maps to project root).
- **No `console.log`** in committed code.
- **No comments** unless explicitly requested.
- **No commented-out code** or unresolved `TODO`s — file an issue instead.
- **Prettier** handles formatting — double quotes, semicolons, 80 cols, 2-space indent, trailing commas.
- **Match surrounding code style** — mimic existing patterns in the file you're editing.

## File Structure

```
app/                  # Next.js App Router pages, layouts, API routes, SEO files
  [slug]/page.tsx     # Individual blog post pages (SSG)
  BlogListing.tsx     # Client component: search, filters, featured rail
  layout.tsx          # Root layout (Navbar, Footer, theme, metadata)
  feed.xml/route.ts   # RSS 2.0 feed
  sitemap.ts          # Auto-generated sitemap
  robots.ts           # Auto-generated robots.txt
components/
  blog/               # PostCard, MarkdownBody, ShareButton
  landing/            # Navbar, Footer, DashedFrame
  theme/              # ThemeToggle (light/dark, persisted)
  ui/                 # Container, SearchOverlay
content/posts/        # Markdown blog posts with YAML frontmatter
lib/
  content/            # Content pipeline: load, parse, related posts, types
  markdown/           # Directives plugin: :::gallery + preprocessor (directives.ts)
  constants.ts        # APP_URL, APP_CONFIG, SOURCE_EDIT_BASE
  utils.ts            # cn() classname helper
public/               # Static assets (logos, demo images, llms.txt)
```

## Content Guidelines

### Post Location

All posts live in `content/posts/` as `.md` files. The filename slug becomes the URL path.

### Frontmatter Schema

```yaml
---
title: "Clear, keyword-aware title"
description: "1-2 sentences for SEO (~150-160 chars)."
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
image: /demo/image.webp
answerSummary: "Only for type=question — short answer for FAQ rich results."
---
```

### Post Types

| Type       | Use Case                          |
| ---------- | --------------------------------- |
| `article`  | General blog posts                |
| `guide`    | Step-by-step guides               |
| `howto`    | How-to tutorials                  |
| `question` | Q&A posts (generates FAQ JSON-LD) |

### Categories

`contribution`, `gsoc`, `github`, `career`, `tools`, `programs`, `beginners`

### Key Rules

- Set `draft: true` until the post is ready to publish.
- Internal links use relative paths (`/other-post-slug`).
- Content in `content/posts/` is **not MIT licensed** — it is © Ossium, all rights reserved.

### Images and Galleries

Single image — the alt text renders as the caption:

```md
![Description](/images/1.jpg)
```

Gallery (`columns` optional, defaults to 2; supported values: 2, 3, 4):

```md
:::gallery columns=3

![](/images/1.jpg)
![Caption](/images/2.jpg)

:::
```

- Images live in `public/`, referenced from the root (`/images/1.jpg`); remote URLs are supported.
- Galleries render as a responsive grid: 1 column on mobile, the requested count from 641px.
- Directive attributes may be written bare (`columns=3`) or braced (`{columns=3}`); `preprocessDirectives` in `lib/markdown/directives.ts` normalizes the bare form.
- Do not use raw HTML for layout — prefer directives (`:::gallery`), which are extensible for future `note`, `warning`, and `tabs` blocks.

## Testing

- Framework: **Vitest** with `@testing-library/react` and `jsdom`.
- Test files: `lib/**/*.test.ts` and `components/**/*.test.ts(x)`.
- Pure logic in `lib/` is the primary testing target.
- Run `pnpm test` to execute, `pnpm test:watch` for development.
- New code should include tests where practical.

## Git Workflow

### Branch Naming

| Kind    | Prefix     | Example                      |
| ------- | ---------- | ---------------------------- |
| Feature | `feat/`    | `feat/reading-progress-bar`  |
| Bug fix | `fix/`     | `fix/search-highlight-flash` |
| Content | `content/` | `content/gsoc-2027-timeline` |
| Chore   | `chore/`   | `chore/upgrade-deps`         |
| Docs    | `docs/`    | `docs/contributing-typo`     |

### Commit Messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<optional scope>): <subject>
```

Types: `feat`, `fix`, `content`, `docs`, `refactor`, `chore`, `test`, `ci`, `perf`, `style`.

- Subject ≤ 72 characters, imperative mood, lowercase (unless acronym).

## Verification Checklist

Before committing or pushing, confirm:

- [ ] `pnpm lint` passes with no errors
- [ ] `pnpm typecheck` passes with no errors
- [ ] `pnpm format:check` passes (or run `pnpm format` to fix)
- [ ] `pnpm test` passes
- [ ] `pnpm build` succeeds
- [ ] No `console.log` statements in new code
- [ ] No secrets, API keys, or credentials committed
- [ ] Path alias `@/` used for imports (not relative `../../`)

## Security

- This is a **static site** — no database, no server-side state, no user input handling.
- Security headers are set in `next.config.ts` (CSP, X-Frame-Options: DENY, etc.).
- Never commit `.env` files — only `.env.example` is tracked.
- Report vulnerabilities via the process in `SECURITY.md`.
