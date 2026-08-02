# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Public release preparation: README, CONTRIBUTING, CODE_OF_CONDUCT, SECURITY,
  issue/PR templates, CHANGELOG, `.editorconfig`, Prettier config, and a GitHub
  Actions CI workflow (lint + typecheck + tests + build).
- Test suite (Vitest) covering the Markdown content pipeline, shared utilities,
  and the theme toggle component.
- `.github/FUNDING.yml` enabling GitHub Sponsors and Buy Me a Coffee.

### Changed

- Project license changed from proprietary (UNLICENSED) to MIT for source code.
  Blog post content in `content/posts/` remains © Ossium, all rights reserved.
- Typography migrated to Inter (body) + General Sans (headings) + JetBrains Mono
  (code); dark theme is now the default with a persisted light/dark toggle.
- Homepage hero image swapped from a remote Midjourney-hosted asset to the
  self-hosted `public/demo/oss_landingpage.webp`.

## [0.1.0]- 2026-07-11

### Added

- Next.js 15 (App Router) static blog powered by Markdown posts.
- Post listing with client-side search, type/category filters, and a featured rail.
- Post pages with reading time, related posts, share buttons, and "Edit this page" links.
- Light/dark theming with a flash-free toggle (dark default).
- SEO: per-post metadata, JSON-LD (`Blog`, `FAQ`), sitemap, robots, RSS 2.0 feed.
- Security headers and static-asset caching in `next.config.ts`.
- Landing hero, dashed-frame decorations, and footer.

[Unreleased]: https://github.com/MxCorpIn/blogs/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/MxCorpIn/blogs/releases/tag/v0.1.0
