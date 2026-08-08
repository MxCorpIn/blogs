---
title: "How Open Source Licensing Works: MIT, GPL, and Apache Explained"
description: "A practical explanation of open source licenses (MIT, Apache, GPL, AGPL, LGPL) with the common mistakes developers make and how to check what you can legally use."
type: guide
category: tools
tags: [open-source, licensing, mit, gpl, apache, beginners]
keywords: [open source licensing, mit license vs gpl, apache license, open source license explained, gpl license for beginners]
publishedAt: 2026-08-08
updatedAt: 2026-08-08
author: OpenCode
avatar: /logo/opencode-logo-dark.png
featured: false
---

A license is the difference between software you can run and software you are allowed to run. Open source only means the source code is readable. The license decides what you may legally do with it. Skip that file and you are building on borrowed ground without knowing the terms.

## Start with the default: no license

Most people assume any code on GitHub is free to use. It is not. Under copyright law, the author automatically holds all rights. If a repository has no license file, you have no permission to copy, modify, or redistribute anything, even for personal projects. I have seen full-time developers lift a utility function from a repo with no LICENSE, drop it into a client's production app, and only discover the problem months later when the author asks for a takedown. There is no polite fix for that conversation.

So the first rule: if it has no license, treat it as "read only, ask first."

## The two families

Every open source license is a variation on two ideas.

Permissive licenses, MIT, BSD, and Apache 2.0, let you use, modify, and redistribute the code, including in closed-source commercial software. Your obligations are light: keep the copyright notice, and don't pretend you wrote it. Apache 2.0 adds a patent grant, which matters if your company holds patents and you want to distribute the code.

Copyleft licenses, GPL, AGPL, and LGPL, use copyright to do the opposite. If you distribute a modified version, you must release your modified source under the same license. GPL v3 also requires you to give recipients the means to run their own builds, and it revokes your patent rights if you sue a GPL user.

| License | Family | Can I use commercially? | Do I share my source? |
|---|---|---|---|
| MIT | Permissive | Yes | No |
| Apache 2.0 | Permissive | Yes | No |
| LGPL | Weak copyleft | Yes | Only if you modify the library |
| GPL | Strong copyleft | Yes, but only if you share source on distribution | Yes |
| AGPL | Copyleft + network | Yes, but you share source even for a service | Yes |

That table misses nuance, so let me fill it in. LGPL lets you link a library into a closed app without open-sourcing your app; it only requires you to release changes to the library itself and allow users to swap in their own version. GPL reaches your whole derivative work. AGPL exists because GPL does not trigger when software runs on a server, it only triggers on distribution. Companies caught on and started running GPL code as a service without sharing anything. AGPL closes that gap: "use it over a network" counts as distribution.

## Where people go wrong

The most common failure is treating "free" as "no conditions." You can charge money for GPL software. You can build a business around it. But you cannot distribute a modified version to customers while keeping the source closed. The cost is the source, not the rupees.

Here is the example I keep running into. A small Indian agency signs a website contract for a Mumbai retailer. A junior dev pulls a GPL-licensed component and embeds it into the site's codebase. The site goes live, and since the code is delivered to the client's servers and in part to the browser, the copyleft obligation kicks in. The client now technically owes the source for the parts derived from that component, which no one mentioned in the invoice. At that stage the fix is a rewrite or a license negotiation, both expensive.

A second common mistake is mixing licenses without checking compatibility. Combine a GPL library with an MIT project and the combined work may need to ship as GPL. That kills the MIT project's permissive posture, and maintainers will reject your PR if you cannot clean that up. It is the reason so many projects specify "no GPL dependencies" in their contribution guides.

Third, rely on tooling instead of memory. NPM and PyPI show the declared license for each package, but metadata is sometimes wrong or missing. The reliable sources are the LICENSE file in the repo and the SPDX identifier on the package page. A minute spent checking beats a month of legal back-and-forth.

Fourth, attribution. Permissive licenses look effortless until you ship and realize you must keep the copyright notice in your distributed copies. One line in a bundled notices file usually satisfies it. Ignoring it is technically a breach even though nobody will chase you over a hobby project. The habit matters when your project grows.

## What to actually do

Before you copy any code: read the LICENSE file, note the SPDX identifier, and write down which license governs what you took. If the project has no license, ask the maintainer or pick a different project. If you contribute, ask yourself whether the project's license matches what you are comfortable releasing, since a merged contribution is typically licensed under the project's terms.

None of this is exotic. Reading a 200-line GPL preamble feels like homework, but the practical summary fits in a paragraph. If the code you use allows closed commercial use, you only need notice and attribution. If it is copyleft and you distribute, plan to share source. If it is AGPL and you run it as a service, plan to share source too.

Pick the license that matches how you actually intend to use the code, check it once at the start, and you avoid the one conversation every developer dreads having with a client.
