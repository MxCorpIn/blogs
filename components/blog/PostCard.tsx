import Image from "next/image";
import Link from "next/link";
import { Clock, ArrowUpRight } from "lucide-react";
import type { PostMeta } from "@/lib/content/types";
import { CATEGORY_LABELS, TYPE_LABELS } from "@/lib/content/types";

interface PostCardProps {
  post: PostMeta;
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

/** Locale-independent so SSR and client HTML match. */
function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}

/** Listing card linking to a post - type/category badges, title, meta, and thumbnail. */
export default function PostCard({ post }: PostCardProps) {
  const image = post.image;

  return (
    <Link
      href={`/${post.slug}`}
      className="group flex flex-col-reverse gap-4 py-9 first:pt-0 sm:flex-row sm:items-start sm:gap-6 sm:py-10"
    >
      <div className="min-w-0 flex-1">
        <div className="mb-2.5 flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-[0.04em] px-2 py-0.5 rounded bg-neutral-200 text-neutral-700 dark:bg-neutral-800/80 dark:text-neutral-400">
            {TYPE_LABELS[post.type]}
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.04em] px-2 py-0.5 rounded bg-neutral-200 text-neutral-700 dark:bg-neutral-800/80 dark:text-neutral-400">
            {CATEGORY_LABELS[post.category]}
          </span>
        </div>

        <h2 className="line-clamp-2 font-display text-[19px] font-semibold leading-[1.35] tracking-[-0.015em] text-neutral-900 transition-colors duration-100 ease-out group-hover:text-neutral-700 dark:text-neutral-100 dark:group-hover:text-neutral-200 sm:text-[21px]">
          {post.title}
        </h2>

        <p className="mt-1.5 line-clamp-2 text-[14.5px] leading-[1.55] tracking-[-0.002em] text-neutral-600 dark:text-neutral-400">
          {post.description}
        </p>

        <div className="mt-4 flex items-center justify-between gap-3 text-[12.5px] font-medium tracking-[0.01em] text-neutral-500">
          <div className="flex items-center gap-3">
            <time dateTime={post.publishedAt}>
              {formatDate(post.publishedAt)}
            </time>
            <span className="inline-flex items-center gap-1">
              <Clock size={12} />
              {post.readingTimeMinutes} min
            </span>
          </div>
          <span className="inline-flex items-center gap-1 text-[13px] font-semibold tracking-[0.01em] text-neutral-900 transition-colors duration-100 ease-out group-hover:text-neutral-600 dark:text-neutral-400 dark:group-hover:text-neutral-200">
            Read
            <ArrowUpRight
              size={14}
              className="transition-transform duration-100 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </span>
        </div>
      </div>

      {image ? (
        <div className="w-full sm:w-auto sm:shrink-0">
          <Image
            src={image}
            alt=""
            width={320}
            height={320}
            sizes="(max-width: 640px) 160px, 320px"
            className="h-36 w-36 rounded-lg object-cover sm:h-[140px] sm:w-[140px] lg:h-[160px] lg:w-[160px]"
          />
        </div>
      ) : null}
    </Link>
  );
}
