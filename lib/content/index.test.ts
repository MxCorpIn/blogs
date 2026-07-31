import { describe, expect, it } from "vitest";
import {
  getAllPosts,
  getAllSlugs,
  getPostBySlug,
  getPostMetaList,
  getRelatedPosts,
} from "./index";

describe("post content pipeline", () => {
  const posts = getAllPosts();

  it("loads every markdown post in content/posts/", () => {
    expect(posts.length).toBeGreaterThan(0);
  });

  it("has unique slugs and unique published URLs", () => {
    const slugs = posts.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("sorts posts newest first", () => {
    const dates = posts.map((p) => new Date(p.publishedAt).getTime());
    const sorted = [...dates].sort((a, b) => b - a);
    expect(dates).toEqual(sorted);
  });

  it("every post has the required frontmatter fields", () => {
    for (const post of posts) {
      expect(post.title.trim().length, post.slug).toBeGreaterThan(0);
      expect(post.description.trim().length, post.slug).toBeGreaterThan(0);
      expect(post.type, post.slug).toBeTruthy();
      expect(post.category, post.slug).toBeTruthy();
      expect(Array.isArray(post.tags), post.slug).toBe(true);
      expect(Array.isArray(post.keywords), post.slug).toBe(true);
      expect(post.publishedAt, post.slug).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(post.author.trim().length, post.slug).toBeGreaterThan(0);
    }
  });

  it("parses valid dates for every post", () => {
    for (const post of posts) {
      expect(
        Number.isNaN(new Date(post.publishedAt).getTime()),
        `${post.slug} has an invalid publishedAt`,
      ).toBe(false);
    }
  });

  it("getAllSlugs matches getAllPosts", () => {
    expect(getAllSlugs()).toEqual(posts.map((p) => p.slug));
  });

  it("getPostBySlug finds existing posts and returns undefined otherwise", () => {
    const first = posts[0];
    expect(getPostBySlug(first.slug)).toBeDefined();
    expect(getPostBySlug("does-not-exist-xyz")).toBeUndefined();
  });

  it("getPostMetaList strips body content", () => {
    const meta = getPostMetaList();
    expect(meta).toHaveLength(posts.length);
    for (const m of meta) {
      expect("content" in m).toBe(false);
    }
  });

  it("getRelatedPosts excludes the source post and respects the limit", () => {
    const first = posts[0];
    const related = getRelatedPosts(first.slug, 3);
    expect(related.length).toBeLessThanOrEqual(3);
    expect(related.some((p) => p.slug === first.slug)).toBe(false);
  });
});
