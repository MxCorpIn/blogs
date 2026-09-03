import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const REPO_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const README_PATH = path.join(REPO_ROOT, "README.md");

function readReadme(): string {
  return readFileSync(README_PATH, "utf8");
}

describe("README", () => {
  it("leads with a one-liner value proposition and live links", () => {
    const readme = readReadme();
    expect(readme).toMatch(/^# .+$/m);
    expect(readme).toMatch(/first issue to first merge/i);
    expect(readme).toContain("https://blog.ossium.in");
    expect(readme).toContain("https://ossium.in");
  });

  it("covers every acceptance-criteria section", () => {
    const readme = readReadme();
    for (const heading of [
      "## Why ossium?",
      "## Features",
      "## Screenshots",
      "## Tech stack",
      "## Quickstart",
      "## Contributing",
      "## License",
      "## Support",
    ]) {
      expect(readme).toContain(heading);
    }
  });

  it("shows badges for CI, stars, version, and license", () => {
    const readme = readReadme();
    for (const badge of ["label=CI", "/stars/", "/package-json/v", "license"]) {
      expect(readme).toContain(badge);
    }
  });

  it("references screenshots that exist in the repo", () => {
    const readme = readReadme();
    const images = [...readme.matchAll(/public\/demo\/[\w.\-]+\.(?:webp|png)/g)]
      .map((m) => m[0])
      .filter((v, i, a) => a.indexOf(v) === i);
    expect(images.length).toBeGreaterThan(0);
    for (const image of images) {
      expect(
        existsSync(path.join(REPO_ROOT, image)),
        `missing screenshot asset: ${image}`,
      ).toBe(true);
    }
  });

  it("documents the real stack and content model", () => {
    const readme = readReadme();
    expect(readme).toMatch(/Next\.js.*16/);
    expect(readme).toMatch(/unified/i);
    expect(readme).toMatch(/remark/i);
    expect(readme).toMatch(/rehype/i);
    expect(readme).toContain("howto");
    expect(readme).toContain("question");
    expect(readme).not.toContain("Next.js](https://nextjs.org) 15");
  });

  it("keeps setup scannable: clone, install, env, dev, build", () => {
    const readme = readReadme();
    for (const step of [
      "https://github.com/MxCorpIn/blogs.git",
      "pnpm install",
      ".env.example",
      "NEXT_PUBLIC_APP_URL",
      "pnpm dev",
      "http://localhost:3000",
      "pnpm build",
    ]) {
      expect(readme).toContain(step);
    }
  });

  it("only links to docs that exist", () => {
    const readme = readReadme();
    const links = [...readme.matchAll(/\]\((\.[^)#]+?)(?:#[^)]*)?\)/g)].map(
      (m) => m[1],
    );
    expect(links.length).toBeGreaterThan(0);
    for (const link of links) {
      expect(
        existsSync(path.join(REPO_ROOT, link)),
        `broken relative link: ${link}`,
      ).toBe(true);
    }
  });
});
