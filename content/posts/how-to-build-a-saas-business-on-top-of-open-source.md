---
title: "How to Build a SaaS Business on Top of Open Source"
description: "A practical guide to open core and AGPL strategies, what to keep open versus closed, and the licensing and community mistakes that sink open source startups."
type: guide
category: tools
tags: [open source business, open core, agpl, saas, startup, india]
keywords: [build a saas business on open source, open core business model, agpl license for saas, open source startup india, monetize open source software]
publishedAt: 2026-08-08
updatedAt: 2026-08-08
author: OpenCode
avatar: /logo/opencode-logo-dark.png
featured: false
---

The pitch writes itself. Build a tool developers want, open the source, charge for hosting. GitLab, WordPress, Sentry, and Supabase all did versions of this, and Appsmith proved the pattern works from India. What nobody tells you is that the line between the free product and the paid product is a legal and community minefield. Most teams get it wrong twice before they get it right.

## Pick a strategy before you write a line of code

Two dominant models exist, and they are not interchangeable.

Open core keeps the base product under a permissive license (MIT or Apache) and sells enterprise features on top. GitLab is the canonical example: the free tier is genuinely useful, the paid tiers add SSO, compliance, and scale features. The risk is that a competitor hosts your open core and charges less, since nothing stops them.

The AGPL route keeps everything open but under a license that triggers on network use. Run a modified AGPL product as a service and you must share your changes. That quietly deters anyone from reselling your software as a closed SaaS. Sentry ran permissive for years, then moved to a source-available license after clouds started selling its own product against it. The catch is that AGPL scares enterprise legal teams, and some of your best customers will say no purely on policy. Whichever route you pick, read the mechanics of these licenses before you commit, the [licensing guide](/how-open-source-licensing-works) covers what actually triggers each one.

## What to keep open, what to keep closed

Keep the developer-facing core open: the thing your users touch, install, and extend. That is your marketing, your distribution, and your talent pipeline. Keep the parts that only matter in a team context closed: SSO, audit logs, compliance packs, advanced monitoring, vertical-specific features. The rule that works in practice: if a hobbyist finds it interesting, open it. If an enterprise pays for it, think twice.

Hosting and managed services are the most natural revenue, because people genuinely do not want to run databases and clusters themselves. Supabase built a real business on "open source Firebase, you host it if you want, or pay us to."

## Licensing pitfalls that actually bite

- Accepting a pull request without a contributor license agreement. The contributor owns their code, and their employer may too. One angry ex-contributor can force a rewrite. Have a CLA from day one.
- GPL code in a SaaS you want to sell. A permissive core with a single GPL dependency quietly infects your distribution story. Check every dependency's license before you announce anything.
- Changing the license after users trust you. MongoDB's move to SSPL and Elastic's relicensing worked legally and destroyed a chunk of goodwill. Whatever you choose at the start, assume you are stuck with it.
- Announcing AGPL as "open source." It is OSI-approved, but many companies treat it as a separate category, so be precise about what your customers get.

## The community pitfalls

Gatekeeping features that the community considers core. Users will fork your project and add the missing feature, and then you have a competitor running your own roadmap. And do not let the open source side starve. Projects that smell like a demo for a paid product stop receiving contributions, and the contribution pipeline is what makes the free distribution channel work.

## The Indian example

Appsmith is the proof. Founded by engineers out of Flipkart, it built an open source low-code platform, kept the core under Apache 2.0, and sold cloud hosting and enterprise features to mid-market companies before anyone in India took the model seriously. A small Bengaluru team can copy the shape: permissive core, hosted product, paid SSO and compliance. The hard part is not the license choice. It is having the patience to grow a community for two years before revenue arrives.

## The honest version

Most open source startups never make enough to pay salaries. The ones that do are the exceptions, and they survive because they decided consciously what to give away and what to sell. Open everything and hosting is your only moat. Close too much and you have a regular SaaS with an awkward GitHub page. Both can work. The teams that fail are the ones that never made the decision at all.
