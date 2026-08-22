"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Clock, Search } from "lucide-react";
import type { PostMeta } from "@/lib/content/types";
import { CATEGORY_LABELS, TYPE_LABELS } from "@/lib/content/types";
import { cn } from "@/lib/utils";

const RESULT_LIMIT = 8;

function matches(post: PostMeta, q: string): boolean {
  return (
    post.title.toLowerCase().includes(q) ||
    post.description.toLowerCase().includes(q) ||
    post.tags.some((t) => t.toLowerCase().includes(q)) ||
    post.keywords.some((k) => k.toLowerCase().includes(q)) ||
    TYPE_LABELS[post.type].toLowerCase().includes(q) ||
    CATEGORY_LABELS[post.category].toLowerCase().includes(q)
  );
}

/**
 * Navbar search - a small "Ctrl K" trigger that opens a blurred command-palette
 * search. Results are fetched once from `/api/search` and filtered client-side.
 */
export default function SearchOverlay() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [selected, setSelected] = useState(0);
  const [posts, setPosts] = useState<PostMeta[] | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadPosts = useCallback(async () => {
    if (posts) return;
    try {
      const res = await fetch("/api/search");
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data)) setPosts(data);
    } catch {
      // Offline / unavailable - overlay shows an empty list.
    }
  }, [posts]);

  const openOverlay = useCallback(() => {
    setValue("");
    setSelected(0);
    setOpen(true);
    void loadPosts();
  }, [loadPosts]);

  const closeOverlay = useCallback(() => setOpen(false), []);

  const go = useCallback(
    (slug: string) => {
      closeOverlay();
      router.push(`/${slug}`);
    },
    [router, closeOverlay],
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (open) closeOverlay();
        else openOverlay();
        return;
      }
      if (open && e.key === "Escape") {
        e.preventDefault();
        closeOverlay();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, openOverlay, closeOverlay]);

  useEffect(() => {
    if (!open) return;
    const raf = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(raf);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const q = value.trim().toLowerCase();
  const results = useMemo(() => {
    if (!posts) return [];
    if (!q) return posts.slice(0, RESULT_LIMIT);
    return posts.filter((p) => matches(p, q)).slice(0, RESULT_LIMIT);
  }, [posts, q]);

  const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelected((s) => Math.min(s + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected((s) => Math.max(s - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const target = results[selected];
      if (target) go(target.slug);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={openOverlay}
        aria-label="Search posts (Ctrl+K)"
        className="inline-flex h-9 shrink-0 items-center overflow-hidden rounded-full bg-white text-neutral-600 transition-colors duration-200 ease-out hover:bg-neutral-200 hover:text-neutral-900 dark:bg-white/5 dark:text-neutral-300 dark:hover:bg-white/10 dark:hover:text-white"
      >
        <span className="inline-flex items-center gap-1.5 pl-3 pr-2.5">
          <Search size={15} className="shrink-0" />
          <span className="hidden whitespace-nowrap text-[13px] font-normal text-neutral-500 dark:text-white/40 sm:inline">
            Search
          </span>
        </span>
        <kbd className="mr-1.5 hidden rounded-md bg-neutral-200 px-1.5 py-0.5 text-[10px] font-semibold text-neutral-500 dark:bg-white/10 dark:text-white/50 md:inline">
          Ctrl K
        </kbd>
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[14vh]"
          role="dialog"
          aria-modal="true"
          aria-label="Search posts"
        >
          <div
            className="absolute inset-0 bg-neutral-950/40 backdrop-blur-md"
            onClick={closeOverlay}
          />
          <div className="relative w-full max-w-xl overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-neutral-900/10 dark:bg-neutral-900 dark:ring-white/10">
            <div className="flex items-center gap-3 px-4">
              <Search size={16} className="shrink-0 text-neutral-400" />
              <input
                ref={inputRef}
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  setSelected(0);
                }}
                onKeyDown={onInputKeyDown}
                placeholder="Search posts, guides, topics..."
                aria-label="Search blog posts"
                className="h-12 w-full bg-transparent text-[15px] tracking-[-0.005em] text-neutral-900 outline-none placeholder:text-neutral-400 dark:text-white"
              />
              <kbd className="shrink-0 rounded-md bg-neutral-100 px-1.5 py-0.5 text-[10px] font-semibold text-neutral-400 dark:bg-white/10 dark:text-white/50">
                esc
              </kbd>
            </div>

            {!posts ? (
              <div
                className="scrollbar-none max-h-[45vh] overflow-y-auto py-2"
                aria-hidden="true"
              >
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex flex-col gap-2 px-6 py-3">
                    <div className="h-2.5 w-16 animate-pulse rounded-full bg-neutral-200 dark:bg-white/10" />
                    <div className="h-3.5 w-11/12 animate-pulse rounded bg-neutral-200 dark:bg-white/10" />
                    <div className="h-2.5 w-24 animate-pulse rounded bg-neutral-200 dark:bg-white/10" />
                  </div>
                ))}
              </div>
            ) : (
              <ul className="scrollbar-none max-h-[45vh] overflow-y-auto py-2">
                {results.map((p, i) => (
                  <li key={p.slug}>
                    <button
                      type="button"
                      onMouseEnter={() => setSelected(i)}
                      onClick={() => go(p.slug)}
                      className={cn(
                        "block w-full px-4 py-3 text-left transition-colors duration-100",
                        i === selected
                          ? "bg-neutral-100 dark:bg-white/10"
                          : "hover:bg-neutral-100 dark:hover:bg-white/5",
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-semibold uppercase tracking-[0.06em] text-neutral-400">
                          {TYPE_LABELS[p.type]}
                        </span>
                        <span className="text-[10px] font-semibold uppercase tracking-[0.06em] text-neutral-400">
                          {CATEGORY_LABELS[p.category]}
                        </span>
                      </div>
                      <p className="mt-1 truncate text-[14px] font-semibold tracking-[-0.01em] text-neutral-900 dark:text-neutral-100">
                        {p.title}
                      </p>
                      <p className="mt-0.5 flex items-center gap-1 text-[11px] text-neutral-400">
                        <Clock size={10} />
                        {p.readingTimeMinutes} min
                      </p>
                    </button>
                  </li>
                ))}
                {q && results.length === 0 ? (
                  <li className="px-4 py-6 text-center text-sm text-neutral-400">
                    No posts match &ldquo;{value.trim()}&rdquo;
                  </li>
                ) : null}
              </ul>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
