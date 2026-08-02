---
title: "I Used Git Wrong for Years"
description: "Senior Git habits: status, diff, add-p, bisect, stash, worktree, reflog, clean commits, and recovery-beyond git add . commit push."
type: guide
category: tools
tags: [git, developer-tools, productivity, github, beginners]
keywords: [git best practices, git reflog, git bisect, git stash, git worktree, how to use git properly]
publishedAt: 2026-05-08
updatedAt: 2026-05-08
author: ossium
featured: false
---

For years, a “full” Git workflow looked like this:

```bash
git add .
git commit-m "update"
git push
```

Then you watch someone recover deleted commits, clean months of history, and undo a bad merge without panic-while you’re still searching “undo last commit but keep changes.”

Most developers know Git just enough to survive. People who move fast treat Git as a **timeline of every project state**, not a cloud backup.

## Git isn’t just version control

Backup mental model: change → commit → push.  
Timeline mental model: commits form a graph you can inspect, walk, and recover from.

Once that clicks, “scary” commands become tools for navigation and repair.

## 1. `git status` is the most important command

Run it before commits, branch switches, and rebases:

```bash
git status
```

Most mistakes come from not knowing current state-staging `.env` files, debug logs, unfinished work, random screenshots. Two seconds; saves hours.

## 2. `git diff` before you commit

```bash
git diff           # unstaged
git diff--staged  # what will land in the commit
```

Catches API keys, broken imports, leftover `console.log`s before they hit the remote.

## 3. Stop using `git add .` blindly

`git add .` stages everything. Prefer:

```bash
git add-p
```

Stage hunks selectively-login fix without UI cleanup in the same commit. Cleaner history, easier later debugging.

## 4. `git bisect` for “which commit broke it?”

When something worked weeks ago and you have dozens of commits in between:

```bash
git bisect start
git bisect bad          # current is broken
git bisect good v2.3.1  # known good
```

Git binary-searches history. Mark each checkout good/bad until one commit remains. “Minor cleanup” commits are frequent culprits.

## 5. `git stash` for emergency context switches

Halfway through a feature when a bug needs a different branch:

```bash
git stash
# switch, fix, push
git stash pop
```

Work goes to a safe side shelf; return when the fire is out.

## 6. Readable history with `git log`

```bash
git log--oneline--graph--decorate
```

Branches, merges, and flow become visible. Alias if you use it daily:

```bash
alias gl='git log--oneline--graph--decorate'
```

## 7. Branches are cheap-use them

Avoid working only on `main`:

```bash
git switch-c fix-login-bug
```

Experiment freely without risking stable code. Branches are free; breaking `main` is not.

## 8. `git restore` to discard local mess

Wrong file edited:

```bash
git restore app.js
```

Back to last committed state for that path-instantly.

## 9. `git worktree` instead of stash-and-pray

For longer interruptions, check out another branch in a second directory:

```bash
git worktree add ../hotfix-branch hotfix/login-timeout
```

Feature work stays put; hotfix lives next door. No stash, no “what was I doing?”

## 10. `git reflog` is your safety net

Thought a rebase deleted commits? Git often still remembers:

```bash
git reflog
git checkout <commit-id>
```

Reflog keeps recent actions for a limited window (often ~90 days). Learn it before assuming anything is gone forever.

## 11. Commit messages for humans

Prefer:

```bash
git commit-m "Fix token refresh issue in auth middleware"
```

Over `fix` / `update`. Future you-and reviewers-need the *why*.

## 12. Interactive rebase for clean PRs

```bash
git rebase-i HEAD~5
```

Squash, reword, and reorder local commits before review. Noise like `fix` / `another fix` becomes one meaningful commit.

## 13. `git blame` for archaeology

```bash
git blame app.js
```

Who changed each line, when, which commit-useful for bugs and “why does this exist?”

## 14. Aliases remove friction

```bash
alias gs='git status'
alias ga='git add'
alias gc='git commit-m'
alias gp='git push'
alias gl='git log--oneline--graph--decorate'
```

Lower friction means you actually run the inspection commands that prevent disasters.

## The real shift

Good Git is less about memorizing flags and more about **staying calm when things break**:

- Inspect changes (`status`, `diff`, `log`)  
- Undo safely (`restore`, `stash`, rebase carefully)  
- Recover (`reflog`, bisect)  

Start with three: **`git diff`**, **`git stash`**, **`git reflog`**. Treat Git as a time machine, not a backup drive-confidence follows.
