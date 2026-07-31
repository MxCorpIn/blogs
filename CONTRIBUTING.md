# Contributing to ossium-blog

Thanks for wanting to contribute! This is the open-source repository for the
[ossium](https://ossium.in) blog. Both **code** and **content** contributions are
welcome.

Please read the [Code of Conduct](CODE_OF_CONDUCT.md) before participating — all
interaction is governed by it.

## Table of contents

- [Ways to contribute](#ways-to-contribute)
- [Getting started](#getting-started)
- [Branch naming](#branch-naming)
- [Commit messages](#commit-messages)
- [Content contributions](#content-contributions)
- [Code style](#code-style)
- [Testing](#testing)
- [Opening a pull request](#opening-a-pull-request)
- [Reporting bugs](#reporting-bugs)
- [Requesting features](#requesting-features)

## Ways to contribute

- **Content** — fix a typo, correct stale information, or write a new post under `content/posts/`
- **Code** — improve the content pipeline, SEO, performance, accessibility, or developer experience
- **Triage** — reproduce reported bugs, answer questions, and review PRs
- **Docs** — improve this repository's documentation

## Getting started

1. [Fork](https://github.com/MxCorpIn/blogs/fork) the repository.
2. Clone your fork and add the upstream remote:

   ```bash
   git clone https://github.com/<your-username>/blogs.git
   cd ossium-blog
   git remote add upstream https://github.com/MxCorpIn/blogs.git
   ```

3. Install dependencies: `pnpm install`
4. Create a branch off `main` (see [branch naming](#branch-naming)).
5. Make your changes.
6. Run the checks below.
7. Push and open a pull request.

## Branch naming

Create feature branches from `main`. Use a short, kebab-case name prefixed by its
kind:

| Kind    | Prefix     | Example                      |
| ------- | ---------- | ---------------------------- |
| Feature | `feat/`    | `feat/reading-progress-bar`  |
| Bug fix | `fix/`     | `fix/search-highlight-flash` |
| Content | `content/` | `content/gsoc-2027-timeline` |
| Chore   | `chore/`   | `chore/upgrade-deps`         |
| Docs    | `docs/`    | `docs/contributing-typo`     |

## Commit messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<optional scope>): <subject>

<optional body>
```

Types: `feat`, `fix`, `content`, `docs`, `refactor`, `chore`, `test`, `ci`, `perf`, `style`.

Examples:

```
fix: correct reading-time estimate for code-heavy posts

content: add GSoC 2027 timeline post

feat(search): highlight matched terms in results

docs: clarify NEXT_PUBLIC_APP_URL usage
```

Keep the subject ≤ 72 characters, in the imperative mood, and lowercase unless it
starts with an acronym.

## Content contributions

Blog posts live in `content/posts/`. Each post is a Markdown file with YAML
frontmatter. See [content/posts/README.md](content/posts/README.md) for the
frontmatter schema and post types.

**Important:** the content in `content/posts/` is _not_ MIT licensed — it is
© Ossium, all rights reserved. Contributions to it are made under the same terms.
By contributing a post you grant Ossium the right to publish it on the blog.

### New post checklist

- [ ] Slug is descriptive and kebab-case
- [ ] Frontmatter is complete (`title`, `description`, `type`, `category`, `tags`, `keywords`, `publishedAt`)
- [ ] Set `draft: true` until the post is ready to publish
- [ ] Internal links use relative paths (`/other-post-slug`)
- [ ] `pnpm build` completes without errors

## Code style

- TypeScript, strict mode. Match the style of the surrounding code.
- Use the path alias `@/` for imports (see `tsconfig.json`).
- Formatting is handled by Prettier — run `pnpm format` before committing.
- No `console.log` in committed code; prefer the debugger or a proper logger.
- No commented-out code or unresolved `TODO`s — file an issue instead.

## Testing

We use [Vitest](https://vitest.dev). Run the suite with:

```bash
pnpm test          # once
pnpm test --watch  # watch mode
```

Before pushing, run the full check suite:

```bash
pnpm lint
pnpm typecheck
pnpm format:check
pnpm test
pnpm build
```

New code should come with tests where practical. Pure logic (the content pipeline
in `lib/`) is the primary target — see `lib/content/` tests for examples.

## Opening a pull request

1. Push your branch to your fork: `git push -u origin <branch>`
2. Open a PR against `main` using the [pull request template](.github/PULL_REQUEST_TEMPLATE.md).
3. Fill in the checklist. Link any related issue (e.g. `Fixes #42`).
4. A maintainer will review. Address review comments and push updates to the same branch.

CI runs on every PR: lint, typecheck, tests, format check, and a production build.
All of them must pass before the PR can merge.

## Reporting bugs

Open a [bug report issue](https://github.com/MxCorpIn/blogs/issues/new?template=bug_report.md) with:

- A clear, specific title
- Steps to reproduce
- Expected vs. actual behavior
- Environment (OS, browser, Node/pnpm versions)
- Screenshots or a minimal reproduction, if applicable

## Requesting features

Open a [feature request issue](https://github.com/MxCorpIn/blogs/issues/new?template=feature_request.md) with:

- The problem you're trying to solve (not just a proposed solution)
- How you'd expect it to work
- Any relevant context or examples
