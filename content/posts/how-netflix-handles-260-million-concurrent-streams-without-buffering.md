---
title: "How Netflix Handles 260 Million Concurrent Streams Without Buffering"
description: "Open Connect, pre-positioned caches, and adaptive bitrate: why Netflix solves most of the streaming problem before you press play—and how to apply it."
type: article
category: tools
tags: [system-design, netflix, cdn, caching, backend]
keywords: [netflix architecture, open connect, adaptive bitrate streaming, system design interview, cdn pre-positioning, concurrent streaming]
publishedAt: 2026-07-10
updatedAt: 2026-07-16
author: ossium
featured: false
draft: false
---

When Wi-Fi dips mid-episode, the picture softens for a few seconds, then sharpens again—no spinner, no stall. That moment sits at the end of a long chain, and almost none of that chain runs when you press play.

Netflix passed 260 million member households in early 2024 and has grown past 300 million since. On one night in November 2024, 65 million streams ran at once for a single boxing match. How Netflix handles that load is mostly decided **hours before** the request leaves your house. That is the whole story—and it changes how you should think about caching.

## Why the obvious design falls over

The first design most engineers sketch: store video in a few data centers, put a commercial CDN in front, fill caches as people watch.

Do the math and it fails.

Sixty-five million streams at ~5 Mbps averages over 300 terabits per second. No central cluster pushes that across the public internet. Transit cost alone would sink you; peering links choke first. Measurement firms have repeatedly found Netflix carrying a double-digit share of downstream internet traffic.

On-demand caching has a quieter failure: a premiere. When a season drops at midnight, a pull-through CDN holds none of it. Millions of requests in one minute are cache misses; all run back to origin at once. The naive design buffers hardest at peak demand.

Netflix inverted the problem—twice.

## Mechanism 1: the movie is already down the street

Netflix built its own CDN: **Open Connect**. It ships real servers—Open Connect Appliances—into ISP data centers and internet exchange points, free to qualifying ISPs. By Netflix's published counts, that footprint passed 17,000 servers across 158 countries by 2021.

ISPs take the boxes because every byte served inside their network is a byte they do not haul over transit. Both sides save money.

Each appliance holds the slice of the catalog its region is most likely to watch—and boxes are **filled ahead of time**. During quiet-hours fill windows, Netflix predicts tomorrow's regional demand and copies titles onto the right appliances. Friday's premiere sits on a server inside your ISP on Thursday night.

Two arrows leave your living room:

- A **skinny** one to AWS: login, browse, recommendations, DRM, and steering that picks your appliance. What comes back is a small manifest of URLs.  
- A **fat** one for video: usually a few miles at most, from the appliance on your ISP's network. Effectively all video traffic comes from Open Connect—not the cloud.  

Control plane where flexibility is cheap (AWS). Data plane where the bytes are (owned appliances). A premiere stampede lands on thousands of already-warm neighborhood caches—no single origin left to overwhelm.

## Mechanism 2: the player renegotiates quality as you watch

Pre-positioning fixes the internet path. It does nothing for your house: crowded Wi-Fi, microwave noise, a sibling in a ranked match.

Every title is encoded into a **ladder** of quality levels—from roughly 235 kbps up to around 15 Mbps for 4K. Per-title encoding means a flat cartoon needs fewer bits than grainy handheld action; each title gets its own ladder.

Video is cut into chunks a few seconds long. The player downloads a chunk, measures real throughput and buffer depth, then picks the bitrate for the next chunk. Research Netflix published with Stanford (SIGCOMM 2014) showed that watching the buffer—not only guessing throughput—cuts rebuffering sharply.

Playback starts cautious, climbs within seconds, and steps down before the buffer runs dry. You get a softer picture instead of a spinner. That Wi-Fi dip was the system working as designed.

A quieter third lever: rolling out **AV1** so each rung of the ladder costs fewer bits—the same picture survives a worse connection.

Stack the two mechanisms: Open Connect keeps the path short and uncrowded; the adaptive player soaks up variance in the last fifty feet. One removes variance at scale; the other absorbs the remainder at the edge of the home.

## The request is the last step, not the first

We are trained to treat a request as the start of work. Netflix's setup says the opposite. By the time you press play, the file was chosen last night, encoded months ago, and copied to a box down the street. Pressing play triggers almost nothing: a small API call, a manifest, then a short local transfer.

At this scale, **reacting to demand is already too late**.

## What this looks like at 1/1000th the scale

You do not need 17,000 servers to borrow the principle. Move work to *before* the request:

- Launching to 50,000 users? Warm CDN and caches at deploy time so the first users are not paying the cache-miss tax.  
- Read-heavy dashboard? Precompute aggregates on a schedule; serve the stored result.  
- Flaky mobile networks? Ship your own quality ladder—smaller payloads, skeleton states, downgraded images. Degrade; do not stall.  

The pattern: **predict, pre-position, then let the client adapt** to whatever mess remains.

Push content close to the edge before demand arrives. If you are only reacting to demand, you are already late.
