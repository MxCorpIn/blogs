# ossium content posts

Markdown articles powering **https://ossium.in**.

## Add a new post

1. Create `content/posts/your-slug.md` (slug = filename without `.md`).
2. Add frontmatter (see below).
3. Write the body in Markdown.
4. Visit `/{slug}` locally. Sitemap picks up published posts automatically.

## Frontmatter

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
avatar: /logo/opencode-logo-dark.png
featured: false
draft: false
image: /demo/oss_landingpage.webp
answerSummary: "Only for type=question - short answer for FAQ rich results."
---
```

## Types

| Type | Use for |
|------|---------|
| `article` | Thought pieces, roundups, product-aware SEO |
| `guide` | Long educational content |
| `howto` | Step-by-step workflows |
| `question` | FAQ / “What is…” pages (adds FAQ JSON-LD when `answerSummary` is set) |

## Author avatars

- `avatar` is optional. If omitted, the post page shows the ossium logo as the author avatar.

## Tips for ranking

- One primary keyword intent per post  
- Link internally to related posts (`/other-post-slug`)  
- Prefer concrete steps, tables, and FAQs  
- Update `updatedAt` when you refresh content  
- Set `draft: true` to hide from production until ready  
