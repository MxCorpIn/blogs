import fs from "fs";
import path from "path";
import { estimateReadingTime, parseFrontmatter, toFrontmatter } from "./parse";
import type { Post, PostCategory, PostMeta, PostType } from "./types";

const CONTENT_DIR = path.join(process.cwd(), "content", "posts");

function listMarkdownFiles(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".md") && f.toLowerCase() !== "readme.md")
    .map((f) => path.join(CONTENT_DIR, f));
}

function loadPostFromFile(filePath: string): Post | null {
  const slug = path.basename(filePath, ".md");
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = parseFrontmatter(raw);
  const fm = toFrontmatter(data, slug);

  if (fm.draft && process.env.NODE_ENV === "production") {
    return null;
  }

  return {
    ...fm,
    slug,
    content,
    readingTimeMinutes: estimateReadingTime(content),
  };
}

let cache: Post[] | null = null;

/** All published posts, newest first. */
export function getAllPosts(): Post[] {
  if (cache && process.env.NODE_ENV === "production") return cache;

  const posts = listMarkdownFiles()
    .map(loadPostFromFile)
    .filter((p): p is Post => p !== null)
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );

  cache = posts;
  return posts;
}

/** Find a single post by its slug. */
export function getPostBySlug(slug: string): Post | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}

/** Every published post slug (for static generation). */
export function getAllSlugs(): string[] {
  return getAllPosts().map((p) => p.slug);
}

/** All posts without body content (metadata only). */
export function getPostMetaList(): PostMeta[] {
  return getAllPosts().map((post) => {
    const { content, ...meta } = post;
    void content;
    return meta;
  });
}

/** Rank posts by shared category, type, and tags — excluding the post itself. */
export function getRelatedPosts(slug: string, limit = 3): PostMeta[] {
  const current = getPostBySlug(slug);
  if (!current) return [];

  return getPostMetaList()
    .filter((p) => p.slug !== slug)
    .map((p) => {
      let score = 0;
      if (p.category === current.category) score += 3;
      if (p.type === current.type) score += 1;
      const shared = p.tags.filter((t) => current.tags.includes(t)).length;
      score += shared;
      return { post: p, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.post);
}

export type { Post, PostMeta, PostType, PostCategory };
export {
  POST_TYPES,
  POST_CATEGORIES,
  TYPE_LABELS,
  CATEGORY_LABELS,
} from "./types";
