---
title: "The Complete Guide to Claude Code: CLAUDE.md"
description: "How CLAUDE.md is loaded, written, and evolved—hierarchy, /init, @imports, reflection, best practices, and how it compares to AGENTS.md and peers."
type: guide
category: tools
tags: [claude-code, ai, developer-tools, coding-agents, agents-md]
keywords: [claude.md guide, claude code memory, how to write claude.md, agents.md vs claude.md, claude code /init]
publishedAt: 2026-03-17
updatedAt: 2026-07-16
author: ossium
featured: false
draft: false
---

Claude Code moved AI coding from chat completion into the terminal: reading repos, editing files, running commands, and driving tasks. The development loop is shifting from line-by-line typing toward **intent, constraints, and AI collaboration**.

`CLAUDE.md` is the entry point for how Claude Code understands a project. It supplies background and conventions that strongly affect accuracy and reliability. Time spent writing a good `CLAUDE.md` often beats stacking plugins.

Treat Claude Code like a new teammate: **`CLAUDE.md` is the onboarding handbook**. Without it, the agent re-asks how to build, test, and style the project. With it, work starts in the way your team expects.

> **Core value:** `CLAUDE.md` turns a general-purpose assistant into a tool tailored to *your* repo.

## How CLAUDE.md is loaded

It is not only a single file in the project root. Claude Code uses a **layered loading model**—different paths apply at different scopes.

### File hierarchy

Common layers:

| Scope | Typical path | Use |
|-------|----------------|-----|
| User (global) | `~/.claude/CLAUDE.md` | Personal defaults across projects |
| Project | `./CLAUDE.md` | Shared via VCS; default repo behavior |
| Local (untracked) | `CLAUDE.local.md` | Personal notes for this project only |
| Subdirectory | nested `CLAUDE.md` | Loaded when work enters that tree |
| Modular rules | `.claude/rules/` | Advanced split of rules (optional) |

Day to day, **project-level `./CLAUDE.md`** is the one that matters most for teams.

### Loading rules

- On start, Claude Code reads `CLAUDE.md` files relevant to the current working directory.  
- User-level `~/.claude/CLAUDE.md` acts as a higher-level preference layer.  
- Subdirectory `CLAUDE.md` files load when the agent actually works in those directories—not always all up front.  
- When multiple files apply, **nearest / narrower scope** usually wins.  
- Within a layer, **explicit, specific** rules beat vague generalities.  

### Conflict resolution

Example: user-level says 4-space indent; project root says 2-space. Inside that project, follow **2-space**. Know which file owns which scope before you debug "why was my rule ignored?"

## How to write CLAUDE.md

### Start quickly with `/init`

```bash
claude
# then:
/init
```

`/init` inspects stack, layout, and common commands and drafts a skeleton. That solves blank-page paralysis—not "this is done." Edit at least once: drafts are broad; some detections are true but not useful. Longer is not better—context is finite, and noise buries real constraints. Delete generic fluff already in docs; add knowledge only your team has (especially failure modes).

### First-pass priorities

Start with what is **easy to get wrong if missing**:

- Common commands: build, test, lint, local dev  
- Project pitfalls: directories not to edit, soft-delete tables, required middleware  
- Workflow: branch naming, pre-commit, PR baseline  
- Architecture: monorepo roles, layering boundaries  

If it does not help the agent understand the project faster or reduce repeated mistakes, do not rush it into the file.

### Split with `@imports` as it grows

```markdown
# Project Instructions

See @README.md for project overview.
See @package.json for available commands and scripts.
See @docs/testing.md for testing conventions.
See @docs/api-guidelines.md for API design rules.
```

Keep the main file high-signal; maintain detailed standards elsewhere.

## How CLAUDE.md evolves

It is living project memory—not a one-shot document.

### Write rules from real collaboration pain

- Keeps using `npm` instead of `pnpm`? Add a rule.  
- Drops tests in the wrong directory? Document placement.  
- Edits schema but skips regenerate? Document the dependency and build step.  

Every manual correction is a signal. Two or three repeats across the team → promote it to shared memory.

### Use `/reflection` after sessions

`/reflection` is essentially a packaged prompt (see community gists) that asks Claude Code to propose stable lessons for `CLAUDE.md` after you confirm. Install as a user command:

```text
~/.claude/commands/reflection.md
```

Then run:

```bash
/reflection
```

That turns evolution from "remember to edit the file" into a repeatable wrap-up.

### Use Insights reports

`/insights` (Claude Code v2.1.x+) analyzes usage history and can suggest `CLAUDE.md` improvements. Reports often land under `~/.claude/usage-data`. Recurring reminders (test commands, "don't touch generated/", repeated task background) belong in the file, not only in chat.

### A practical evolution rhythm

1. `/init` for a usable draft  
2. Capture daily corrections into the file  
3. `/reflection` at session end  
4. Periodic Insights review for long-horizon patterns  
5. Prune outdated, redundant, low-value rules  

Rules refined from real work beat abstract "complete" handbooks.

## Best practices

Many "it's not loading" issues are actually **low relevance**: the file was seen but treated as noise.

### Keep it concise

Extra context costs tokens and attention. Prefer high-frequency commands, core constraints, hard-won lessons, and always-on architecture. Rare edge cases and vague slogans do not belong in the main file.

### Be specific and executable

"Pay attention to quality" and "follow conventions" do almost nothing. Prefer:

- Exact test/lint commands  
- Forbidden directories  
- Whether lint must pass before commit  
- Where the API layer lives  
- When tests are mandatory  

### Communicate intent, not only rules

"Don't edit `src/generated/`" is a rule. Better: those files are generated from OpenAPI; source of truth is the schema and generator. Intent helps the agent choose correctly on novel tasks.

### Progressive disclosure

Keep stable, cross-task facts in the root file. Split with `@imports` or nested `CLAUDE.md` so local rules load when needed—less irrelevant context every session.

### Never put secrets in CLAUDE.md

API keys, passwords, and tokens often land in version control. Credentials in `CLAUDE.md` are credentials for anyone with repo access.

## Files similar to CLAUDE.md

Most AI coding tools have an instruction file. What matters is mechanism, not just the name.

| Tool family | Typical file | Notes |
|-------------|--------------|--------|
| Claude Code | `CLAUDE.md` | Strong layered hierarchy and scoped loading |
| Gemini CLI | `GEMINI.md` (can map to `AGENTS.md`) | Multiple files; often simpler concatenation |
| Codex / OpenCode / Droid | `AGENTS.md` | Converging open format; advanced features often live *outside* the file |

Claude Code and Gemini CLI both inject persistent project memory; Claude's hierarchy is especially clear for monorepos. Codex/OpenCode/Droid treat `AGENTS.md` as a shared entry point while skills, subagents, and org config sit elsewhere.

**Trend:** filenames are converging (especially `AGENTS.md` as a cross-tool standard); **capability models are not unified yet**. Layered memory vs agent orchestration vs external plugins remain different designs. The durable idea is the same: **encode project experience as durable rules so agents stay consistent**.

## Summary

`CLAUDE.md` works best when you start usable and iterate—add, prune, tighten from real collaboration—not when you try to write an encyclopedia on day one. Whatever the ecosystem names the file next, the pattern remains: turn project knowledge into long-term instructions.

## References

- [How to Write a Good CLAUDE.md File](https://www.builder.io/blog/claude-md-guide)  
- [Writing a good CLAUDE.md](https://www.humanlayer.dev/blog/writing-a-good-claude-md)  
- [Understanding CLAUDE.md Loading in Large Monorepos](https://github.com/shanraisshan/claude-code-best-practice/blob/main/reports/claude-md-for-larger-mono-repos.md)  
- [Manage Claude's memory](https://code.claude.com/docs/en/memory)  
- [AGENTS.md](https://agents.md/)  

Related: [5 open-source repos that improve Claude Code](/5-open-source-repositories-that-will-make-claude-code-10x-better).
