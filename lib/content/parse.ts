import type { PostCategory, PostFrontmatter, PostType } from "./types";
import { POST_CATEGORIES, POST_TYPES } from "./types";

function stripQuotes(value: string): string {
  const t = value.trim();
  if (
    (t.startsWith('"') && t.endsWith('"')) ||
    (t.startsWith("'") && t.endsWith("'"))
  ) {
    return t.slice(1, -1);
  }
  return t;
}

function parseArray(value: string): string[] {
  const t = value.trim();
  if (!t.startsWith("[") || !t.endsWith("]")) {
    return t
      ? t
          .split(",")
          .map((s) => stripQuotes(s.trim()))
          .filter(Boolean)
      : [];
  }
  return t
    .slice(1, -1)
    .split(",")
    .map((s) => stripQuotes(s.trim()))
    .filter(Boolean);
}

function parseScalar(value: string): string | boolean | string[] {
  const t = value.trim();
  if (t === "true") return true;
  if (t === "false") return false;
  if (t.startsWith("[")) return parseArray(t);
  return stripQuotes(t);
}

/**
 * Minimal YAML-like frontmatter parser (key: value lines).
 * Supports strings, booleans, and [array, values].
 */
export function parseFrontmatter(raw: string): {
  data: Record<string, unknown>;
  content: string;
} {
  const normalized = raw.replace(/^\uFEFF/, "");
  if (!normalized.startsWith("---")) {
    return { data: {}, content: normalized };
  }

  const end = normalized.indexOf("\n---", 3);
  if (end === -1) {
    return { data: {}, content: normalized };
  }

  const fmBlock = normalized.slice(3, end).trim();
  const content = normalized.slice(end + 4).replace(/^\r?\n/, "");
  const data: Record<string, unknown> = {};

  for (const line of fmBlock.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const colon = trimmed.indexOf(":");
    if (colon === -1) continue;
    const key = trimmed.slice(0, colon).trim();
    const value = trimmed.slice(colon + 1);
    data[key] = parseScalar(value);
  }

  return { data, content };
}

function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === "string" && value.trim()) {
    return value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

function isPostType(v: unknown): v is PostType {
  return typeof v === "string" && (POST_TYPES as readonly string[]).includes(v);
}

function isPostCategory(v: unknown): v is PostCategory {
  return (
    typeof v === "string" && (POST_CATEGORIES as readonly string[]).includes(v)
  );
}

/** Coerce parsed frontmatter into a typed `PostFrontmatter` with safe defaults. */
export function toFrontmatter(
  data: Record<string, unknown>,
  slug: string,
): PostFrontmatter {
  const title = String(data.title ?? slug);
  const description = String(data.description ?? "");
  const type: PostType = isPostType(data.type) ? data.type : "article";
  const category: PostCategory = isPostCategory(data.category)
    ? data.category
    : "beginners";

  return {
    title,
    description,
    type,
    category,
    tags: asStringArray(data.tags),
    keywords: asStringArray(data.keywords),
    publishedAt: String(
      data.publishedAt ?? new Date().toISOString().slice(0, 10),
    ),
    updatedAt: data.updatedAt ? String(data.updatedAt) : undefined,
    author: String(data.author ?? "ossium"),
    authorUrl: data.authorUrl ? String(data.authorUrl) : "https://ossium.in",
    avatar: data.avatar ? String(data.avatar) : undefined,
    featured: Boolean(data.featured),
    draft: Boolean(data.draft),
    image: data.image ? String(data.image) : undefined,
    answerSummary: data.answerSummary ? String(data.answerSummary) : undefined,
  };
}

/** Rough reading time from markdown body (~200 wpm). */
export function estimateReadingTime(markdown: string): number {
  const words = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[#>*_`[\]()!-]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}
