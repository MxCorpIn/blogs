---
title: "Best Open Source Self-Hosted Apps for Home Labs"
description: "A practical open source home lab starter set: TrueNAS, Portainer, Jellyfin, Immich, Vaultwarden, Homepage, Pi-hole, AdGuard Home and Gitea, with honest hardware and maintenance expectations."
type: article
category: tools
tags: [open-source, self-hosting, home-lab, docker, homelab]
keywords: [best open source self hosted apps, home lab apps, self hosted homelab, jellyfin, immich, vaultwarden, pi hole]
publishedAt: 2026-08-08
updatedAt: 2026-08-08
author: OpenCode
avatar: /logo/opencode-logo-dark.png
featured: false
---

A home lab is just a computer you own running software you control, usually in a corner of the house or on a cheap cloud VPS. The point is not the hardware, it is replacing monthly subscriptions for photos, streaming, passwords, and file storage with services you run yourself. The honest framing: you save money and gain control, and you pay for both with your evenings, because self-hosted software is never maintenance-free.

## Where to start: the hardware question

Do not buy anything yet. A home lab begins with whatever you already have: an old laptop with 8GB of RAM, a used mini PC, or a Raspberry Pi 4 or 5 for lightweight tasks. If you want a dedicated box, a used business mini PC with an SSD is the sweet spot in India, cheap to buy and to run. The one thing you need to accept is that you will eventually lose a drive, so backups are part of the setup, not an afterthought.

## The base layer: Docker and Portainer

Docker is how most self-hosted apps ship these days, one command and the app runs. Portainer gives it a web UI where you can manage containers, stacks, and volumes without memorizing every flag. Together they turn a bare Linux install into something a non-Docker-expert can run. This is the correct first step for most people. Skip the fancy orchestration for now; a single box with Docker Compose files is easier to back up and debug than a mini Kubernetes cluster you will regret.

## TrueNAS: when you grow into real storage

TrueNAS is a storage OS built on ZFS, with filesystems, snapshots, and replication that protect data properly. It is what you run when your media and backups matter. The cost is real: it wants a machine with enough RAM (8GB minimum, more is better), a bit of discipline around drive configuration, and patience while you learn ZFS concepts. Start with Docker on a normal OS. Move to TrueNAS when the data volume justifies a dedicated box.

## Jellyfin: your own Netflix

Jellyfin (GPL-2.0) streams your media library to TVs, phones, and browsers with no subscription and no account phone-home. Point it at a folder of movies and shows, and clients handle the rest. It also supports hardware transcoding on most GPUs, which matters on Indian internet speeds where a laptop might need to transcode to a weaker stream. The maintenance task nobody mentions is metadata and library cleanup; every few months you will fix titles and posters.

## Immich and PhotoPrism: the Google Photos problem

Your photo library is the most expensive thing in your life by subscription count. Immich (AGPL-3.0) is the closest open source equivalent to Google Photos: automatic backup from your phone, face recognition, search, and a decent mobile app. It updates fast and occasionally breaks something in the process, so keep it on the latest release. PhotoPrism (AGPL-3.0) is the older, more stable alternative with good search and timeline views, though development is slower. Pick Immich for active development and mobile-first use, PhotoPrism if you want fewer surprises.

## Vaultwarden: the password manager that protects itself

Vaultwarden (GPL-3.0) is a lightweight, community-maintained server for Bitwarden clients. Your passwords, TOTP codes, and secrets live on your hardware instead of a company cloud, and the official Bitwarden apps work against it directly. Note that it is a reimplementation, not an official Bitwarden product, so keep your vault backups separate from the server itself. This is the highest-value app in the whole home lab: it earns its keep every single day.

## Homepage and Homarr: dashboards to keep order

Once you run ten services, you need a map. Homepage and Homarr are self-hosted dashboards that show your apps, their status, and quick links in a browser tab. Homepage is config-driven and developer-friendly; Homarr is drag-and-drop and closer to an app launcher. Both are small, and both solve the real problem of remembering which port your stuff lives on. Add one early, because the list grows faster than you expect.

## Pi-hole and AdGuard Home: network-wide ad blocking

A DNS-level ad blocker stops ads on every device in your house before they reach the browser, no extensions needed. Pi-hole and AdGuard Home both do this and are light enough for a Raspberry Pi Zero W. AdGuard Home has an easier setup with its own dashboard and built-in filters; Pi-hole has the bigger plugin and blocklist ecosystem. Both are the kind of quiet improvement that makes a home lab feel worth it within a week.

## Gitea and Forgejo: your own git server

Gitea (MIT) and its fork Forgejo (MIT) run a GitHub-style server in a single small binary. Use them for private repos without monthly limits, or as the home for your dotfiles, scripts, and notes. Forgejo even includes built-in Actions-compatible CI, so you can run builds on your own hardware. For a solo user this is one of the easiest wins on the list.

## The maintenance reality

Here is what nobody tells you before you start: updates will occasionally break a service, your SSD will fill up with logs and backups, and you will spend a Sunday evening debugging why Immich stopped connecting. The habits that keep a home lab alive are boring: read changelogs before updating, keep Compose files in git, and do regular backups to a second disk. If that sounds acceptable, start with Portainer, Pi-hole, and Vaultwarden, then add services as you build confidence. For the tool-specific choices here, the [licensing guide](/how-open-source-licensing-works) explains which obligations come with the AGPL apps you are running.
