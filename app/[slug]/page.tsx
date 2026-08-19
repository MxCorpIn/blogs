import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Coffee, Pencil, Tag } from "lucide-react";
import PostCard from "@/components/blog/PostCard";
import ShareButton from "@/components/blog/ShareButton";
import {
  getAllSlugs,
  getPostBySlug,
  getRelatedPosts,
  TYPE_LABELS,
  CATEGORY_LABELS,
} from "@/lib/content";
import { formatDate } from "@/lib/utils";
import { renderMarkdownToHtml } from "@/lib/content/markdown";
import { APP_URL, APP_CONFIG, SOURCE_EDIT_BASE } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { SECTION_CONTAINER_CLASS } from "@/components/ui/Container";

/** Normalize a frontmatter image path to an absolute src (or null if absent). */
function resolveImageSrc(image?: string): string | null {
  if (!image?.trim()) return null;
  const src = image.trim();
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  return src.startsWith("/") ? src : `/${src}`;
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

/** Statically generate a page for every published post slug. */
export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

/** Per-post metadata (SEO, OG, Twitter, canonical) or a fallback for missing posts. */
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) {
    return { title: "Post not found | ossium" };
  }

  const url = `${APP_URL}/${post.slug}`;
  const localImage = resolveImageSrc(post.image);
  const ogImage = localImage
    ? localImage.startsWith("http")
      ? localImage
      : `${APP_URL}${localImage}`
    : `${APP_URL}${APP_CONFIG.defaultOgImage}`;

  return {
    title: `${post.title} | ossium Blog`,
    description: post.description,
    keywords: post.keywords.length ? post.keywords : post.tags,
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      siteName: "ossium",
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      authors: [post.author],
      tags: post.tags,
      images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [ogImage],
    },
    alternates: {
      canonical: url,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

function safeJsonLd(obj: object): string {
  return JSON.stringify(obj).replace(/</g, "\\u003c");
}

/** Full article page - cover, prose body, tags, share, and related posts. */
export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const related = getRelatedPosts(slug, 3);
  const url = `${APP_URL}/${post.slug}`;
  const coverSrc = resolveImageSrc(post.image);
  const ogImage = coverSrc
    ? coverSrc.startsWith("http")
      ? coverSrc
      : `${APP_URL}${coverSrc}`
    : `${APP_URL}${APP_CONFIG.defaultOgImage}`;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    image: ogImage,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    author: {
      "@type": "Organization",
      name: post.author,
      url: post.authorUrl ?? APP_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "ossium",
      url: APP_URL,
      logo: {
        "@type": "ImageObject",
        url: `${APP_URL}/ossium_logo_trans.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    keywords: post.keywords.join(", "),
  };

  const faqJsonLd =
    post.type === "question" && post.answerSummary
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: post.title,
              acceptedAnswer: {
                "@type": "Answer",
                text: post.answerSummary,
              },
            },
          ],
        }
      : null;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: APP_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: post.title,
        item: url,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd) }}
        />
      )}

      <article
        className={cn(SECTION_CONTAINER_CLASS, "pt-8 sm:pt-10 pb-16 sm:pb-24")}
      >
        <Link
          href="/"
          className="group inline-flex items-center gap-1.5 text-[14px] font-medium tracking-[-0.005em] text-neutral-600 hover:text-neutral-900 transition-colors mb-8 dark:text-neutral-500 dark:hover:text-neutral-100"
        >
          <ArrowLeft size={16} />
          <span className="u-underline">All posts</span>
        </Link>

        <header className="mb-10">
          <div className="flex flex-wrap items-center gap-2 mb-5">
            <span className="text-[11px] font-semibold uppercase tracking-[0.04em] px-2 py-0.5 rounded bg-neutral-200 text-neutral-700 dark:bg-neutral-800/80 dark:text-neutral-400">
              {TYPE_LABELS[post.type]}
            </span>
            <Link
              href={`/?category=${post.category}`}
              className="group text-[11px] font-semibold uppercase tracking-[0.04em] px-2 py-0.5 rounded bg-neutral-200 text-neutral-700 hover:text-neutral-900 transition-colors dark:bg-neutral-800/80 dark:text-neutral-400 dark:hover:text-neutral-100"
            >
              <span className="u-underline">
                {CATEGORY_LABELS[post.category]}
              </span>
            </Link>
          </div>

          <h1 className="font-display text-neutral-900 dark:text-neutral-100 text-[2rem] sm:text-[2.375rem] md:text-[38px] font-semibold tracking-[-0.025em] leading-[1.2] mb-5">
            {post.title}
          </h1>

          <p className="text-neutral-600 dark:text-neutral-400 text-[16.5px] sm:text-[17px] leading-[1.75] tracking-[-0.003em] mb-7">
            {post.description}
          </p>

          <div className="flex items-center justify-between gap-4 border-y border-neutral-200 py-6 dark:border-neutral-800">
            <div className="flex items-center gap-3">
              {post.authorUrl ? (
                <Link
                  href={post.authorUrl}
                  className="h-11 w-11 shrink-0 overflow-hidden rounded-full ring-1 ring-neutral-200 transition-colors hover:ring-neutral-400 dark:ring-neutral-800 dark:hover:ring-neutral-600"
                >
                  <Image
                    src={post.avatar ?? "/ossium_logo.webp"}
                    alt={post.author}
                    width={44}
                    height={44}
                    className="h-full w-full object-cover"
                  />
                </Link>
              ) : (
                <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full ring-1 ring-neutral-200 dark:ring-neutral-800">
                  <Image
                    src={post.avatar ?? "/ossium_logo.webp"}
                    alt={post.author}
                    width={44}
                    height={44}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <div className="flex flex-col">
                {post.authorUrl ? (
                  <Link
                    href={post.authorUrl}
                    className="text-[14px] font-semibold text-neutral-900 transition-colors hover:text-neutral-700 hover:underline dark:text-neutral-200 dark:hover:text-neutral-100"
                  >
                    {post.author}
                  </Link>
                ) : (
                  <span className="text-[14px] font-semibold text-neutral-900 dark:text-neutral-200">
                    {post.author}
                  </span>
                )}
                <span className="flex items-center gap-2 text-[12.5px] text-neutral-500">
                  <time dateTime={post.publishedAt}>
                    {formatDate(post.publishedAt)}
                  </time>
                  <span aria-hidden="true">·</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock size={12} />
                    {post.readingTimeMinutes} min read
                  </span>
                </span>
              </div>
            </div>

            <ShareButton url={url} />
          </div>
        </header>

        {coverSrc && (
          <div className="mb-10 overflow-hidden rounded-2xl bg-neutral-100 dark:bg-[#121314]">
            {coverSrc.startsWith("http") ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={coverSrc}
                alt={post.title}
                className="w-full h-auto max-h-[420px] object-cover"
              />
            ) : (
              <Image
                src={coverSrc}
                alt={post.title}
                width={1200}
                height={630}
                priority
                className="w-full h-auto max-h-[420px] object-cover"
              />
            )}
          </div>
        )}

        <div
          className="blog-prose text-neutral-600 dark:text-neutral-300 text-[16px] sm:text-[17px] leading-[1.75] tracking-[-0.003em]"
          dangerouslySetInnerHTML={{
            __html: renderMarkdownToHtml(post.content),
          }}
        />

        {post.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-800">
            <div className="flex flex-wrap items-center gap-2">
              <Tag
                size={14}
                className="text-neutral-500 dark:text-neutral-600"
              />
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] font-medium tracking-[0.04em] px-2.5 py-1 rounded-full bg-neutral-200 text-neutral-700 dark:bg-neutral-900 dark:text-neutral-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-neutral-200 pt-6 dark:border-neutral-800">
          <a
            href="https://buymeacoffee.com/manixh"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 text-[14px] font-medium tracking-[-0.005em] text-neutral-600 hover:text-neutral-900 transition-colors dark:text-neutral-400 dark:hover:text-neutral-100"
          >
            <Coffee size={14} />
            <span className="u-underline">Buy me a coffee</span>
          </a>
          <div className="flex items-center gap-5">
            <Link
              href={`${SOURCE_EDIT_BASE}/content/posts/${post.slug}.md`}
              className="group inline-flex items-center gap-1.5 text-[14px] font-medium tracking-[-0.005em] text-neutral-600 hover:text-neutral-900 transition-colors dark:text-neutral-400 dark:hover:text-neutral-100"
            >
              <Pencil size={14} />
              <span className="u-underline">Edit this page</span>
            </Link>
            <ShareButton url={url} />
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className={cn(SECTION_CONTAINER_CLASS, "pb-20")}>
          <h2 className="text-[12px] font-semibold uppercase tracking-[0.08em] text-neutral-500 mb-4">
            Related posts
          </h2>
          <div className="divide-y divide-neutral-200 dark:divide-neutral-800/80">
            {related.map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
