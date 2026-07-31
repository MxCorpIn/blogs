"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Clock, Coffee, Github, Rss } from "lucide-react";
import PostCard from "@/components/blog/PostCard";
import {
  TYPE_LABELS,
  CATEGORY_LABELS,
  type PostMeta,
  type PostType,
  type PostCategory,
} from "@/lib/content/types";
import { cn } from "@/lib/utils";
import { SECTION_CONTAINER_CLASS } from "@/components/ui/Container";

const FEATURED_LIMIT = 4;

interface BlogListingProps {
  posts: PostMeta[];
  initialType?: PostType;
  initialCategory?: PostCategory;
}

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}

/**
 * Client-side blog listing — hero, search, type/category filters, and a
 * sticky featured rail. Filter state is derived from props (URL) + local state.
 */
export default function BlogListing({
  posts,
  initialType,
  initialCategory,
}: BlogListingProps) {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<PostType | undefined>(
    initialType,
  );
  const [categoryFilter, setCategoryFilter] = useState<
    PostCategory | undefined
  >(initialCategory);

  const types = useMemo(
    () => Array.from(new Set(posts.map((p) => p.type))),
    [posts],
  );
  const categories = useMemo(
    () => Array.from(new Set(posts.map((p) => p.category))),
    [posts],
  );

  const featuredPosts = useMemo(
    () => posts.filter((p) => p.featured).slice(0, FEATURED_LIMIT),
    [posts],
  );

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return posts.filter((p) => {
      if (typeFilter && p.type !== typeFilter) return false;
      if (categoryFilter && p.category !== categoryFilter) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        p.keywords.some((k) => k.toLowerCase().includes(q)) ||
        TYPE_LABELS[p.type].toLowerCase().includes(q) ||
        CATEGORY_LABELS[p.category].toLowerCase().includes(q)
      );
    });
  }, [posts, query, typeFilter, categoryFilter]);

  const featuredSlugs = useMemo(
    () => new Set(featuredPosts.map((p) => p.slug)),
    [featuredPosts],
  );

  const mainPosts = useMemo(() => {
    const isBrowsing = !typeFilter && !categoryFilter && !query.trim();
    if (!isBrowsing) return filtered;
    return filtered.filter((p) => !featuredSlugs.has(p.slug));
  }, [filtered, featuredSlugs, typeFilter, categoryFilter, query]);

  const showFeaturedRail =
    featuredPosts.length > 0 && !typeFilter && !categoryFilter && !query.trim();

  const clearFilters = () => {
    setQuery("");
    setTypeFilter(undefined);
    setCategoryFilter(undefined);
  };

  return (
    <div className="relative w-full pb-16 sm:pb-24">
      <header className="relative w-full min-h-[32rem] sm:min-h-[40rem] lg:min-h-[48rem]">
        <div className="relative flex min-h-[32rem] flex-col items-center justify-center px-4 pb-28 text-center sm:min-h-[40rem] sm:px-6 sm:pb-36 lg:min-h-[48rem] lg:pb-44">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-500 sm:mb-5 sm:text-[13px] dark:text-white/70">
            Blog &amp; guides
          </p>
          <h1 className="mb-4 max-w-3xl font-display text-[2.25rem] font-semibold leading-[1.1] tracking-[-0.03em] text-neutral-900 sm:mb-5 sm:text-[2.75rem] md:text-[3.25rem] lg:text-[3.5rem] dark:text-white">
            Write-ups for people who actually ship open source.
          </h1>
          <p className="mb-6 max-w-lg text-[16px] leading-[1.6] tracking-[-0.005em] text-neutral-600 sm:text-[17px] dark:text-white/75">
            GSoC prep, first PRs, issue hunting, tools that matter. No fluff —
            just the stuff that gets you unstuck.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[13px] text-neutral-600 dark:text-white/65">
            <Link
              href="/feed.xml"
              className="inline-flex items-center gap-1.5 transition-colors duration-300 ease-out hover:text-neutral-900 dark:hover:text-white"
            >
              <Rss size={14} />
              RSS
            </Link>
            <span className="text-neutral-300" aria-hidden="true">
              /
            </span>
            <a
              href="https://buymeacoffee.com/manixh"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 transition-colors duration-300 ease-out hover:text-neutral-900 dark:hover:text-white"
            >
              <Coffee size={14} />
              Buy me a coffee
            </a>
            <span className="text-neutral-300" aria-hidden="true">
              /
            </span>
            <a
              href="https://github.com/MxCorpIn/blogs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 transition-colors duration-300 ease-out hover:text-neutral-900 dark:hover:text-white"
            >
              <Github size={14} />
              Star on GitHub
            </a>
          </div>
        </div>
      </header>

      <div className="relative -mt-36 bg-[var(--background)] sm:-mt-48 md:-mt-56 lg:-mt-64">
        <section className={cn(SECTION_CONTAINER_CLASS, "mb-6 sm:mb-8")}>
          <div className="mb-6 flex flex-col items-center sm:mb-8">
            <div className="relative w-full max-w-xl">
              <svg
                className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500 dark:text-white/50"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.75}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                />
              </svg>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search posts, guides, topics..."
                aria-label="Search blog posts"
                className="w-full rounded-full border border-neutral-300 bg-white py-2.5 pl-11 pr-4 text-[14px] tracking-[-0.005em] text-neutral-900 shadow-[0_4px_20px_rgba(0,0,0,0.08)] backdrop-blur-md placeholder:text-neutral-400 transition duration-300 ease-out focus:border-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-400/40 dark:border-white/15 dark:bg-white/10 dark:text-white dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] dark:placeholder:text-white/40 dark:focus:border-white/30 dark:focus:bg-white/15 dark:focus:ring-white/25 sm:py-3"
              />
            </div>
            {query.trim() ? (
              <p className="mt-3 text-center text-sm text-neutral-400">
                {filtered.length} result{filtered.length !== 1 ? "s" : ""} for
                &ldquo;{query.trim()}&rdquo;
              </p>
            ) : null}
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            <FilterChip
              active={!typeFilter && !categoryFilter}
              onClick={clearFilters}
            >
              All
            </FilterChip>
            {types.map((t) => (
              <FilterChip
                key={t}
                active={typeFilter === t && !categoryFilter}
                onClick={() => {
                  setTypeFilter(t);
                  setCategoryFilter(undefined);
                }}
              >
                {TYPE_LABELS[t]}
              </FilterChip>
            ))}
            {categories.map((c) => (
              <FilterChip
                key={c}
                active={categoryFilter === c && !typeFilter}
                onClick={() => {
                  setCategoryFilter(c);
                  setTypeFilter(undefined);
                }}
              >
                {CATEGORY_LABELS[c]}
              </FilterChip>
            ))}
          </div>
        </section>

        <section className={cn(SECTION_CONTAINER_CLASS, "relative")}>
          {filtered.length === 0 ? (
            <p className="py-16 text-center text-neutral-500">
              No posts match this {query.trim() ? "search" : "filter"}.{" "}
              <button
                type="button"
                onClick={clearFilters}
                className="text-neutral-700 hover:underline dark:text-neutral-300"
              >
                Clear filters
              </button>
            </p>
          ) : (
            <div
              className={
                showFeaturedRail
                  ? "grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,3fr)] lg:gap-12"
                  : "grid gap-10 lg:gap-12"
              }
            >
              <div className="order-2 min-w-0 lg:order-1">
                <div className="mb-2 flex items-baseline justify-between gap-3">
                  <h2 className="text-[12px] font-semibold uppercase tracking-[0.08em] text-neutral-500">
                    {showFeaturedRail ? "Latest" : "Posts"}
                  </h2>
                </div>
                <div className="divide-y divide-neutral-200 dark:divide-neutral-800/80">
                  {mainPosts.map((post) => (
                    <PostCard key={post.slug} post={post} />
                  ))}
                </div>
              </div>

              {showFeaturedRail ? (
                <aside className="order-1 min-w-0 lg:order-2">
                  <div className="lg:sticky lg:top-8 lg:max-h-[calc(100vh-4rem)] lg:overflow-y-auto lg:pr-0.5">
                    <h2 className="mb-2 text-[12px] font-semibold uppercase tracking-[0.08em] text-neutral-500">
                      Featured
                    </h2>
                    <ul className="divide-y divide-neutral-200 dark:divide-neutral-800/80">
                      {featuredPosts.map((post) => (
                        <li
                          key={post.slug}
                          className="py-6 first:pt-2 last:pb-0"
                        >
                          <Link href={`/${post.slug}`} className="group block">
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-semibold uppercase tracking-[0.04em] text-neutral-500">
                                {TYPE_LABELS[post.type]}
                              </span>
                              <span className="text-neutral-700">·</span>
                              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-neutral-600">
                                <Clock size={10} />
                                {post.readingTimeMinutes}m
                              </span>
                            </div>
                            <p className="mt-1 line-clamp-2 font-display text-[15px] font-semibold leading-[1.35] tracking-[-0.015em] text-neutral-900 transition-colors duration-100 ease-out group-hover:text-neutral-700 dark:text-neutral-200 dark:group-hover:text-neutral-100">
                              {post.title}
                            </p>
                            <p className="mt-1 line-clamp-2 text-[13px] leading-[1.55] tracking-[-0.002em] text-neutral-500">
                              {post.description}
                            </p>
                            <time
                              dateTime={post.publishedAt}
                              className="mt-2 block text-[11px] font-medium text-neutral-600"
                            >
                              {formatDate(post.publishedAt)}
                            </time>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </aside>
              ) : null}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function FilterChip({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-[11px] font-semibold tracking-[0.04em] transition-colors duration-200 ${
        active
          ? "border-neutral-900/20 bg-neutral-900/10 text-neutral-900 dark:border-white/25 dark:bg-white/15 dark:text-white"
          : "border-neutral-900/10 bg-transparent text-neutral-500 hover:border-neutral-900/20 hover:text-neutral-900 dark:border-white/10 dark:bg-white/5 dark:text-neutral-400 dark:hover:border-white/20 dark:hover:text-neutral-200"
      }`}
    >
      {children}
    </button>
  );
}
