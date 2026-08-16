"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { formatDate } from "@/lib/utils";
import {
  Briefcase,
  CircleHelp,
  Clock,
  Compass,
  FileText,
  Github,
  GraduationCap,
  HeartHandshake,
  ListChecks,
  Rocket,
  Sprout,
  Wrench,
  type LucideIcon,
} from "lucide-react";
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

const TYPE_ICONS: Record<PostType, LucideIcon> = {
  article: FileText,
  guide: Compass,
  howto: ListChecks,
  question: CircleHelp,
};

const CATEGORY_ICONS: Record<PostCategory, LucideIcon> = {
  contribution: HeartHandshake,
  gsoc: GraduationCap,
  github: Github,
  career: Briefcase,
  tools: Wrench,
  programs: Rocket,
  beginners: Sprout,
};

interface BlogListingProps {
  posts: PostMeta[];
  initialType?: PostType;
  initialCategory?: PostCategory;
  initialQuery?: string;
}

/**
 * Client-side blog listing - hero, search, type/category filters, and a
 * sticky featured rail. Filter state is derived from props (URL) + local state.
 */
export default function BlogListing({
  posts,
  initialType,
  initialCategory,
  initialQuery,
}: BlogListingProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery ?? "");
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
    router.replace("/");
  };

  return (
    <div className="relative w-full pb-16 sm:pb-24">
      <header className="w-full">
        <div className="px-4 pb-12 pt-14 text-center sm:pb-14 sm:pt-20">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-500 dark:text-white/60">
            Blog &amp; guides
          </p>
          <h1 className="mx-auto max-w-2xl font-display text-[2rem] font-semibold leading-[1.1] tracking-[-0.03em] text-neutral-900 sm:text-[2.5rem] lg:text-[3rem] dark:text-white">
            Focused articles that help developers grow their skills.
          </h1>
        </div>
      </header>

      <section className={cn(SECTION_CONTAINER_CLASS, "mb-6 sm:mb-8")}>
        <div className="flex flex-col items-center gap-4">
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
                icon={TYPE_ICONS[t]}
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
                icon={CATEGORY_ICONS[c]}
                onClick={() => {
                  setCategoryFilter(c);
                  setTypeFilter(undefined);
                }}
              >
                {CATEGORY_LABELS[c]}
              </FilterChip>
            ))}
          </div>
          {query.trim() ? (
            <p className="text-center text-sm text-neutral-400">
              {filtered.length} result{filtered.length !== 1 ? "s" : ""} for
              &ldquo;{query.trim()}&rdquo;
            </p>
          ) : null}
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
                      <li key={post.slug} className="py-6 first:pt-2 last:pb-0">
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
  );
}

function FilterChip({
  active,
  icon: Icon,
  children,
  onClick,
}: {
  active: boolean;
  icon?: LucideIcon;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12px] font-medium tracking-[0.01em] transition-colors duration-200 ${
        active
          ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
          : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
      }`}
    >
      {Icon ? <Icon size={13} className="shrink-0" /> : null}
      <span className="u-underline">{children}</span>
    </button>
  );
}
