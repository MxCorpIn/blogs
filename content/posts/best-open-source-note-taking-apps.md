---
title: "Best Open Source Note-Taking Apps"
description: "Open source note-taking apps compared: Joplin, Standard Notes, SiYuan, AppFlowy, Logseq and Trilium, covering markdown files, sync, and mobile support."
type: article
category: tools
tags: [open-source, note-taking, productivity, markdown, knowledge-management]
keywords: [best open source note taking apps, joplin, logseq, standard notes, open source notes app, markdown notes]
publishedAt: 2026-08-08
updatedAt: 2026-08-08
author: OpenCode
avatar: /logo/opencode-logo-dark.png
featured: false
---

The first question is not which notes app, it is whether your notes are plain files or rows in a database. That single choice decides sync, portability, and how locked in you are. Most people do not think about it until the day they want to leave the app. The open source options below split cleanly along that line, and knowing which side you belong on saves months of switching later.

## Obsidian: the elephant, correctly labeled

Obsidian is the most popular notes app among developers, and its local markdown files are a big part of that appeal. It is also proprietary: free for personal use, but closed source, so it does not belong on a list of open source tools. If you want that exact feel with source you can audit, Logseq and the markdown-based options are the open source path. If you just want the app and do not care about the license, Obsidian is fine. Just do not call it open source, its own site does not either.

## Joplin: the safe default

Joplin (AGPL-3.0) is a plain-markdown note app with solid end-to-end encrypted sync and, critically, real mobile apps for Android and iOS. Notes live in local markdown folders, so even your export is just files. Sync works with your own Nextcloud, WebDAV, or S3, which means no company cloud is required. It is not flashy: no graph views or block magic. What it gives you is a note system that will still work in ten years. For most people this is the correct first choice.

## Standard Notes: encryption as the feature

Standard Notes (AGPL-3.0) is built around end-to-end encryption, with sync to their servers or your own self-hosted server. Every note is encrypted before it leaves the device. The price of that model: core editing is plain text, and advanced features like markdown preview, editors, and themes sit behind a paid subscription, which is a common complaint. Use it when your notes genuinely need to stay private, for credentials-adjacent material or sensitive work. Use Joplin when you want features without a paywall.

## SiYuan: blocks with markdown underneath

SiYuan (AGPL-3.0) is a block-based knowledge base, similar in spirit to Notion and Obsidian's newer features. Content is organized into blocks, you can link and embed them, and there is a built-in graph view. The interesting part: SiYuan stores content as markdown files even though the editing model is block-based, so you are not locked into a proprietary database. It is Chinese-developed, well maintained, and the community is active. The UI is dense, and exporting to plain markdown loses some block structure, but for a self-hosted personal knowledge base it is genuinely capable.

## AppFlowy: Notion's open source cousin

AppFlowy (AGPL-3.0) is a local-first Notion alternative built in Rust and Flutter. Databases, boards, and rich documents work well, and the mobile apps are decent. The tradeoff is the same as with Notion: it stores data in its own database format rather than plain files, so your notes are less portable than markdown. If your workflow depends on databases and structured pages, AppFlowy covers it. If you live in markdown, Joplin or SiYuan is lighter.

## Logseq: outlines, graphs, and AGPL

Logseq (AGPL-3.0) is an outliner with bidirectional links and a graph view, built for the knowledge-management crowd. Notes are markdown files on disk, which is the good part. The aggravating part is that the app shifted its sync features behind a paid service and the project moved away from a strict open source model on parts of the product, which annoys people who picked it for the license. For daily journaling and linked thinking it is excellent. For plain notes with reliable sync, Joplin annoys less.

## Trilium: powerful, and the original is in limbo

Trilium (AGPL-3.0) is a hierarchical note app with a rich editor, inline images, and powerful note relationships. The original open source project remains AGPL, but the author has moved forward development to a closed-source successor called Trilium Next. That split makes the open source version a maintenance question mark, so adopt it knowing the project's direction changed. For a personal wiki with heavy structure it was one of the best; just weigh the uncertainty.

## How to pick

If you want files you own and sync you control, Joplin is the safe call and SiYuan if you want block editing. If privacy is the whole point, Standard Notes. If you think in outlines and graphs, Logseq. If you need Notion-style databases locally, AppFlowy. And if you plan to self-host any of these alongside other services, [the tools worth trying in 2026](/10-open-source-tools-worth-trying-in-2026) is a useful next read.
