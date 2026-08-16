export const POST_TYPES = ["article", "guide", "howto", "question"] as const;

export type PostType = (typeof POST_TYPES)[number];

export const POST_CATEGORIES = [
  "contribution",
  "gsoc",
  "github",
  "career",
  "tools",
  "programs",
  "beginners",
] as const;

export type PostCategory = (typeof POST_CATEGORIES)[number];

export function isPostType(v: unknown): v is PostType {
  return typeof v === "string" && (POST_TYPES as readonly string[]).includes(v);
}

export function isPostCategory(v: unknown): v is PostCategory {
  return (
    typeof v === "string" && (POST_CATEGORIES as readonly string[]).includes(v)
  );
}

export interface PostFrontmatter {
  title: string;
  description: string;
  type: PostType;
  category: PostCategory;
  tags: string[];
  keywords: string[];
  publishedAt: string;
  updatedAt?: string;
  author: string;
  authorUrl?: string;
  /** Author avatar image path (defaults to the ossium logo when absent) */
  avatar?: string;
  featured?: boolean;
  draft?: boolean;
  /** Optional cover image path or absolute URL */
  image?: string;
  /** For type=question: short answer for FAQ schema */
  answerSummary?: string;
}

export interface Post extends PostFrontmatter {
  slug: string;
  content: string;
  readingTimeMinutes: number;
}

export type PostMeta = Omit<Post, "content">;

export const TYPE_LABELS: Record<PostType, string> = {
  article: "Article",
  guide: "Guide",
  howto: "How-to",
  question: "Q&A",
};

export const CATEGORY_LABELS: Record<PostCategory, string> = {
  contribution: "Contribution",
  gsoc: "GSoC",
  github: "GitHub",
  career: "Career",
  tools: "Tools",
  programs: "Programs",
  beginners: "Beginners",
};
