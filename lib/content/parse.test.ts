import { describe, expect, it } from "vitest";
import { estimateReadingTime, parseFrontmatter, toFrontmatter } from "./parse";

describe("parseFrontmatter", () => {
  it("parses a full YAML frontmatter block", () => {
    const raw = `---
title: "Hello"
description: "A post"
tags: [one, two]
publishedAt: 2026-07-11
featured: true
---
Body text.`;
    const { data, content } = parseFrontmatter(raw);

    expect(data).toMatchObject({
      title: "Hello",
      description: "A post",
      tags: ["one", "two"],
      publishedAt: "2026-07-11",
      featured: true,
    });
    expect(content).toBe("Body text.");
  });

  it("returns empty data and full content when there is no frontmatter", () => {
    const { data, content } = parseFrontmatter("Just body text.");
    expect(data).toEqual({});
    expect(content).toBe("Just body text.");
  });

  it("strips a leading BOM", () => {
    const { data } = parseFrontmatter("\uFEFF---\ntitle: X\n---\nbody");
    expect(data.title).toBe("X");
  });

  it("ignores comment lines and unparsable lines", () => {
    const { data } = parseFrontmatter("---\n# a comment\ntitle: X\n---\n");
    expect(data).toEqual({ title: "X" });
  });
});

describe("toFrontmatter", () => {
  it("applies safe defaults for missing type and category", () => {
    const fm = toFrontmatter({ title: "T" }, "t");
    expect(fm.type).toBe("article");
    expect(fm.category).toBe("beginners");
    expect(fm.publishedAt).toBeTruthy();
    expect(fm.author).toBe("ossium");
  });

  it("rejects invalid type and category values", () => {
    const fm = toFrontmatter(
      { title: "T", type: "nope", category: "nope" },
      "t",
    );
    expect(fm.type).toBe("article");
    expect(fm.category).toBe("beginners");
  });

  it("coerces array fields", () => {
    const fm = toFrontmatter(
      { title: "T", tags: ["a", "b"], keywords: "solo" },
      "t",
    );
    expect(fm.tags).toEqual(["a", "b"]);
    expect(fm.keywords).toEqual(["solo"]);
  });

  it("reads the avatar field and leaves it empty by default", () => {
    expect(
      toFrontmatter({ title: "T", avatar: "/logo/opencode-logo-dark.png" }, "t")
        .avatar,
    ).toBe("/logo/opencode-logo-dark.png");
    expect(toFrontmatter({ title: "T" }, "t").avatar).toBeUndefined();
  });
});

describe("estimateReadingTime", () => {
  it("never returns less than 1 minute", () => {
    expect(estimateReadingTime("")).toBe(1);
    expect(estimateReadingTime("one")).toBe(1);
  });

  it("rounds words up at ~200 wpm", () => {
    const words = Array.from({ length: 250 }, () => "word").join(" ");
    expect(estimateReadingTime(words)).toBe(2);
  });

  it("ignores code blocks", () => {
    const prose = "only a few words here";
    const withCode = `${prose}\n\n\`\`\`js\n${Array.from(
      { length: 500 },
      () => "code",
    ).join(" ")}\n\`\`\``;
    expect(estimateReadingTime(withCode)).toBe(estimateReadingTime(prose));
  });
});
