---
title: "Best Open Source Analytics Tools"
description: "Web analytics, product analytics, and BI are different jobs. Matomo, Plausible, Umami, GoAccess, PostHog, Metabase and Apache Superset compared for self-hosting, with a focus on privacy."
type: article
category: tools
tags: [best open source analytics, open source analytics, self hosted analytics, matomo, plausible, posthog, metabase]
keywords: [best open source analytics tools, self hosted web analytics, matomo vs plausible, open source product analytics, self hosted bi tools]
publishedAt: 2026-08-08
updatedAt: 2026-08-08
author: OpenCode
avatar: /logo/opencode-logo-dark.png
featured: false
---

The most common analytics mistake is installing the wrong category of tool. Web analytics answers "what pages did people view and where did they come from." Product analytics answers "which users did what, in what order, and how many came back." BI answers "what do the numbers in my database mean." Different questions, different tools, and no single open source project does all three well.

## Web analytics

Matomo is the closest thing to a self-hosted Google Analytics and it is GPLv3. You install it on PHP and MySQL, drop a JavaScript tag on your site, and get the full picture: referrers, goals, e-commerce tracking, even session recording and heatmaps through paid plugins. It is thorough and it is heavy. The database grows, the archiving cron needs to run, and a large site needs a real server. If you want Google Analytics parity on your own hardware, this is the tool.

Plausible is the lightweight alternative, AGPLv3, with a single sub-kilobyte script and a dashboard that fits on one screen. It is cookieless by design, which makes it nearly painless under GDPR and gives you one honest number per page instead of a thousand. It is deliberately not a replacement for GA4's reporting depth, and the self-hosted version lags the paid cloud in convenience. For a marketing site or a personal blog, that tradeoff is usually correct.

Umami sits in between, MIT licensed, Postgres-backed, fast, with a clean dashboard and a little more depth than Plausible without Matomo's weight. It is my default pick for a small team that wants something better than a counter without running a reporting platform.

GoAccess is the odd one out and my favourite for a single server. It is MIT licensed and does not touch your pages at all: it parses nginx or Apache access logs and renders a terminal or HTML report in seconds. Zero JavaScript, zero cookies, zero database. Install it, point it at your log file, and you have real visitor numbers immediately. It is the fastest "install and go" analytics on this list, with the limit that it only knows what your logs record.

## Product analytics

Product analytics is a different animal because it needs identity: events tied to a user, funnels, retention, and sessions that survive a page reload.

PostHog is the serious open source option here, MIT licensed at the core with enterprise components under a separate license. It does event capture, autocapture, funnels, session replay, feature flags, and experiments, all self-hostable. It is genuinely impressive and genuinely hungry: high event volume means real storage and compute, so budget for that before you adopt it. If your SaaS is past the point where "did anyone sign up today" is the whole dashboard, PostHog is the tool.

Matomo also covers the basics of product analytics with its goals and e-commerce tracking, and it is worth saying explicitly that product analytics is not the same as "add the analytics script." It means you have decided which events matter, and you are paying attention to retention and funnel data, not page views.

## BI

Business intelligence queries your data wherever it lives and turns it into dashboards people can actually read.

Metabase is the friendliest BI tool you can self-host, AGPLv3, connecting to Postgres, MySQL, ClickHouse, and a long list of others. Non-technical users can click through questions, and anyone can write SQL. For a small company that wants "our revenue by month, by channel, by region" without hiring a data team, Metabase is usually the answer.

Apache Superset is the heavier option, Apache 2.0, with a SQL lab, rich chart types, and a real modelling layer. It can do more than Metabase and demands more: a proper deployment, more configuration, and more willingness to learn. If your reporting needs outgrow Metabase, Superset is the natural open source upgrade path.

## The privacy angle

The reason to self-host any of these is that your visitor data never leaves your server. That matters under GDPR, under India's DPDP Act as it phases in, and for the simple practical reason that your analytics feed your own product decisions. Log-based tools like GoAccess avoid consent banners entirely, cookieless tools like Plausible nearly so, and a self-hosted Matomo or PostHog keeps raw behaviour data inside your own Postgres. None of it is magic. Pick the category first, then the tool, then host it properly, because an analytics server that goes down quietly is worse than no analytics.
