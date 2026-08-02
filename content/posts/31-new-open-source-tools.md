---
title: "31 New Open Source Tools (AI, Dev & Infra)"
description: "A curated rundown of 31 open-source projects spanning AI agents, local LLMs, databases, networking, scraping, design, and developer tooling."
type: article
category: tools
tags: [open-source, ai, developer-tools, infrastructure, databases]
keywords: [new open source tools, open source ai tools, firecrawl, airllm, turso, pyinfra, likeC4]
publishedAt: 2026-07-04
updatedAt: 2026-07-05
author: ossium
featured: false
---

Themes that show up again and again in this batch: AI systems with real memory, large models on modest hardware, browser-native agents, physics-aware models, and APIs that turn messy web scraping into one call. Below is a practical rundown of 31 projects worth a look.

## AI, agents & models

### [NVIDIA Cosmos](https://github.com/NVIDIA/cosmos)

Building blocks for physical AI-simulation-trained world models, robotics/video datasets, and tooling to fine-tune or evaluate them. Aimed at robotics, AV, and embodied systems that need physics, not just pixels.

### [odysseus](https://github.com/pewdiepie-archdaemon/odysseus)

Self-hosted AI workspace for chat, tools, and agents on infrastructure you control. Convenience tradeoff for ownership of data and config.

### [MemPalace](https://github.com/MemPalace/mempalace)

Persistent memory for AI apps-cross-session recall with an emphasis on benchmarks. Drop-in memory layer instead of inventing your own retrieval stack.

### [whichllm](https://github.com/Andyyyy64/whichllm)

Recommends which local model will actually run well on *your* hardware using recency-aware, real-world benchmarks-before you download huge weights that won’t fit.

### [jcode](https://github.com/1jehuang/jcode)

Harness for building coding agents: how they read a repo, act, and report. Scaffolding for agent designers more than a finished product.

### [AirLLM](https://github.com/lyogavin/airllm)

Run large open models (toward 70B-class) on consumer GPUs via aggressive memory management-trade speed for accessibility on ~4GB-class setups.

### [ds4](https://github.com/antirez/ds4)

Local inference engine for DeepSeek 4 (Flash/Pro) across Metal, CUDA, and ROCm-from antirez (Redis). Cross-vendor GPU path for those models.

### [Valmis](https://github.com/valmishq/valmis)

AI agent stack with security as a first-class concern for teams worried about tool access and prompt injection.

### [peerd](https://github.com/NotASithLord/peerd)

Browser-native agent harness (Chrome/Firefox extension)-the agent loop runs in the browser against the page you’re looking at.

### [agent-native](https://github.com/BuilderIO/agent-native)

Framework for apps designed around agents from day one (Builder.io)-patterns beyond bolting a chatbot onto a classic app.

### [flue](https://github.com/withastro/flue)

Sandbox agent framework from the Astro team-contain agent actions so mistakes have a limited blast radius.

### [Nubase](https://github.com/OtterMind/Nubase)

AI-native backend platform aimed at turning agent-written code into real apps; self-hostable alternative to closed app builders.

### [ktx](https://github.com/Kaelio/ktx)

Executable context layer for data/analytics agents so tools like coding CLIs work with structured, actionable context-not static dumps.

### [Strix](https://github.com/usestrix/strix)

AI-assisted penetration testing: find and help fix app vulnerabilities. Inspectable alternative to closed scanners.

## Infra, data & networking

### [iroh](https://github.com/n0-computer/iroh)

Peer-to-peer networking: dial by key with QUIC and NAT traversal so apps aren’t stuck fighting changing IPs and blocked ports.

### [pyinfra](https://pyinfra.com/)

Agentless infrastructure automation over SSH in plain Python-fleet changes without YAML-heavy CM or agents everywhere.

### [Turso](https://github.com/tursodatabase/turso)

In-process SQL database compatible with SQLite-style workflows-low latency for edge and embedded deployments.

### [Firecrawl](https://github.com/firecrawl/firecrawl)

Scraping, search, and page interaction as an API for LLM pipelines and monitoring-less DIY crawler infrastructure.

### [CuPy](https://github.com/cupy/cupy)

NumPy/SciPy-compatible GPU arrays for Python-accelerate numerical code with minimal rewrites.

### [HelixDB](https://github.com/HelixDB/helix-db)

Graph + vector in one OLTP database (Rust, object storage)-relationships and similarity search without two separate stores.

### [textbee](https://github.com/vernu/textbee)

Turn an Android phone into an SMS gateway for low-volume or budget SMS without a commercial API.

## Design, UI & frontend

### [Skybridge](https://github.com/alpic-ai/skybridge)

Full-stack TypeScript framework for MCP Apps and ChatGPT Apps-type-safe, React-friendly scaffolding.

### [cate](https://github.com/0-AI-UG/cate)

Infinite zoomable canvas IDE: editor, terminal, and browser as spatial panels instead of rigid tabs.

### [LikeC4](https://github.com/likec4/likec4)

Architecture diagrams generated from code (C4-oriented)-docs that stay closer to the real system.

### [openpencil](https://github.com/ZSeven-W/openpencil)

Open-source AI-native vector design tool, including concurrent agent teams on the canvas.

### [component-party.dev](https://github.com/matschik/component-party.dev)

Side-by-side comparison of web component frameworks-same concepts across syntaxes for evaluation and mental-model translation.

### [Orval](https://orval.dev/)

Type-safe TypeScript clients from OpenAPI for React Query, Angular, Vue Query, SWR, and more.

### [brownies](https://github.com/franciscop/brownies)

Small unified API for cookies, local/session storage, and related storage with subscribe events.

### [nub](https://github.com/nubjs/nub)

Consolidated fast Node.js toolchain to cut the sprawl of many small build/lint utilities.

### [mitos](https://github.com/oxidecomputer/mitos)

ASCII art for brand assets-CLI banners, README headers, developer-facing identity (Oxide Computer).

### [Loupe](https://github.com/mysk-research/loupe)

Privacy-focused iOS app that makes app observation/access more concrete for users (research-driven).

### [extend-hq/ui](https://github.com/extend-hq/ui)

Early UI project listing with sparse public description-worth checking the repo directly if you track Extend’s stack.

## Patterns worth noticing

| Pattern | Examples |
|---------|----------|
| Collapse two data models | HelixDB (graph + vector), Turso (SQLite-like in-process) |
| Generate from a source of truth | LikeC4, Orval, mitos |
| Where agents live | Browser (peerd), sandbox (flue), security-first (Valmis), app-native (agent-native) |

Bookmark a few that match a gap you already have-memory, local inference, scraping, or agent harnesses-before the next trending list scrolls past.
