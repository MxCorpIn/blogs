---
title: "How to Start Your Own Open Source Project From Scratch"
description: "A practical guide to starting an open source project: choosing a license, writing docs, structuring the repo, and avoiding the mistakes that kill a project early."
type: guide
category: contribution
tags: [open-source, github, project-setup, maintainer, beginners]
keywords: [start open source project, create open source project, open source project setup, github repository setup, open source maintainer guide]
publishedAt: 2026-08-08
updatedAt: 2026-08-08
author: OpenCode
avatar: /logo/opencode-logo-dark.png
featured: false
---

Most open source projects fail for boring reasons: no license, no documentation, and a maintainer who expects people to show up. You can avoid all three without spending much time.

## Pick a license first

The license is the single most important file in your repository. Without one, your code is "all rights reserved" by default, and nobody can legally use it, fork it, or contribute to it in a meaningful way. This sounds bureaucratic, but it is the difference between a project people can adopt and a project people can only look at.

For a new project you want adopted, a permissive license like MIT or Apache 2.0 is usually the right call. If you want derivatives to stay open, use GPL. See the licensing explainer for the details, but do not skip this step.

## Write the README before you announce anything

A good README answers three questions: what does this do, why does it exist, and how do I run it. For a developer audience, that last one is the one they actually check. A project with a five line README and no setup instructions reads as abandoned even if you pushed it yesterday.

Include a clear description, a short usage example, and installation steps. If a new contributor cannot get your project running in ten minutes, they will not contribute.

## Add the contribution scaffolding

Three files turn a repository into a project:

A CONTRIBUTING.md that explains how to set up the environment, run tests, and submit a pull request. If you do not want contributions yet, say so plainly in this file rather than leaving people to guess.

A LICENSE file, which you already handled.

Issue templates and a pull request template. These sound like admin work, but they save you time later by forcing people to give you the information you need.

## Decide on hosting

GitHub is the default because that is where the audience is. GitLab and Codeberg are fine alternatives if you prefer their policies, but you lose a little discoverability. Pick one and stop thinking about it. Moving later is a solved problem with `git remote` and mirrors.

## Put it on a roadmap, not in a heap

One common mistake is dumping a large codebase with no context and expecting people to orient themselves. If you are extracting a library or tool from a bigger project, write a short "why this exists" section in the README and add a basic architecture note. The people who contribute in the first month are the ones who could understand what they were looking at.

## Realistic expectations

Your project will probably have very few users at first, and that is normal. A small project with a responsive maintainer is more attractive to contributors than a large one with a silent owner. Answer questions within a day or two, merge reasonable PRs quickly, and cut a version tag early so people can see the project is being maintained.

If you started a project that only you use, that is still a useful outcome. Plenty of good software begins as a personal tool that someone else happens to find. The infrastructure you build now, the license, the docs, the templates, is what makes that possible when it happens.
