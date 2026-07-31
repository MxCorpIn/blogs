import type { Metadata } from "next";
import {
  getPostMetaList,
  type PostType,
  type PostCategory,
} from "@/lib/content";
import { APP_URL } from "@/lib/constants";
import BlogListing from "./BlogListing";

export const metadata: Metadata = {
  title: "Blog & Guides | ossium – Open Source Learning Hub",
  description:
    "Guides, how-tos, and Q&A on open source contribution, GSoC, good first issues, GitHub workflows, and tools for contributors. Learn and rank with practical OSS content.",
  keywords: [
    "open source blog",
    "contribute to open source",
    "gsoc guide",
    "good first issue",
    "github contribution guide",
    "open source for beginners",
    "ossium blog",
    "hacktoberfest guide",
  ],
  openGraph: {
    title: "Blog & Guides | ossium",
    description:
      "Practical guides and Q&A for open source contributors—GSoC, first PRs, issue discovery, and more.",
    url: APP_URL,
    siteName: "ossium",
    type: "website",
    images: [
      {
        url: `${APP_URL}/demo/oss_landingpage.webp`,
        width: 1200,
        height: 630,
        alt: "ossium Blog – Open Source Guides",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog & Guides | ossium",
    description:
      "Practical guides and Q&A for open source contributors—GSoC, first PRs, issue discovery, and more.",
    images: [`${APP_URL}/demo/oss_landingpage.webp`],
  },
  alternates: {
    canonical: APP_URL,
    types: {
      "application/rss+xml": `${APP_URL}/feed.xml`,
    },
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

interface BlogPageProps {
  searchParams: Promise<{ type?: string; category?: string }>;
}

/** Blog listing page — feeds all post metadata to the client-side listing. */
export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const typeFilter = params.type as PostType | undefined;
  const categoryFilter = params.category as PostCategory | undefined;

  const all = getPostMetaList();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "ossium Blog",
    description: "Guides, how-tos, and Q&A for open source contributors.",
    url: APP_URL,
    publisher: {
      "@type": "Organization",
      name: "ossium",
      url: APP_URL,
      logo: `${APP_URL}/ossium_logo_trans.png`,
    },
    blogPost: all.slice(0, 20).map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      description: p.description,
      url: `${APP_URL}/${p.slug}`,
      datePublished: p.publishedAt,
      dateModified: p.updatedAt ?? p.publishedAt,
      author: { "@type": "Organization", name: p.author },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogListing
        posts={all}
        initialType={typeFilter}
        initialCategory={categoryFilter}
      />
    </>
  );
}
