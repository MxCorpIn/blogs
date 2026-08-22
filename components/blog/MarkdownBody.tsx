"use client";

import Image from "next/image";
import Link from "next/link";
import { cloneElement, isValidElement } from "react";
import ReactMarkdown from "react-markdown";
import remarkDirective from "remark-directive";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import {
  GALLERY_CLASS,
  parseGalleryColumns,
  preprocessDirectives,
  remarkDirectives,
} from "@/lib/markdown/directives";

interface MarkdownBodyProps {
  content: string;
}

function isInternalHref(href?: string): boolean {
  if (!href) return false;
  return href.startsWith("/") && !href.startsWith("//");
}

/** Renders Markdown post content with the blog's prose styling. */
export default function MarkdownBody({ content }: MarkdownBodyProps) {
  return (
    <div className="blog-prose text-neutral-600 dark:text-neutral-300 text-[16px] sm:text-[17px] leading-[1.75] tracking-[-0.003em]">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkDirective, remarkDirectives]}
        rehypePlugins={[[rehypeHighlight, { ignoreMissing: true }]]}
        components={{
          div: ({ node, children }) => {
            const className = node?.properties.className;
            const isGallery =
              typeof className === "string" &&
              className.split(/\s+/).includes(GALLERY_CLASS);
            if (!isGallery) {
              return (
                <div
                  className={
                    typeof className === "string" ? className : undefined
                  }
                >
                  {children}
                </div>
              );
            }
            const rawColumns = node?.properties["data-columns"];
            const columns = parseGalleryColumns(
              typeof rawColumns === "string" ? rawColumns : undefined,
            );
            return (
              <div className={GALLERY_CLASS} data-columns={columns}>
                {children}
              </div>
            );
          },
          h1: ({ children }) => (
            <h1 className="font-display text-[26px] sm:text-[30px] font-semibold leading-[1.25] tracking-[-0.02em] text-neutral-900 dark:text-neutral-100 mt-10 mb-4">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="font-display text-[24px] sm:text-[28px] font-semibold leading-[1.3] tracking-[-0.02em] text-neutral-900 dark:text-neutral-100 mt-[44px] mb-3 border-b border-neutral-200 dark:border-neutral-800 pb-2">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="font-display text-[20px] sm:text-[22px] font-semibold leading-[1.3] tracking-[-0.015em] text-neutral-900 dark:text-neutral-100 mt-[32px] mb-2">
              {children}
            </h3>
          ),
          p: ({ children }) => <p className="mb-5 last:mb-0">{children}</p>,
          ul: ({ children }) => (
            <ul className="list-disc pl-5 space-y-2 mb-4 marker:text-neutral-400 dark:marker:text-neutral-600">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-5 space-y-2 mb-4 marker:text-neutral-500">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="pl-1">{children}</li>,
          a: ({ href, children }) => {
            if (isInternalHref(href)) {
              return (
                <Link
                  href={href!}
                  className="text-neutral-600 underline underline-offset-2 decoration-neutral-400 hover:text-neutral-900 hover:decoration-neutral-500 dark:text-neutral-300 dark:decoration-neutral-600 dark:hover:text-neutral-100 dark:hover:decoration-neutral-400"
                >
                  {children}
                </Link>
              );
            }
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-600 underline underline-offset-2 decoration-neutral-400 hover:text-neutral-900 dark:text-neutral-300 dark:decoration-neutral-600 dark:hover:text-neutral-100"
              >
                {children}
              </a>
            );
          },
          strong: ({ children }) => (
            <strong className="font-semibold text-neutral-900 dark:text-neutral-100">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="text-neutral-800 dark:text-neutral-200 italic">
              {children}
            </em>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-neutral-300 pl-4 my-6 text-neutral-500 italic dark:border-neutral-600 dark:text-neutral-400">
              {children}
            </blockquote>
          ),
          hr: () => (
            <hr className="border-neutral-200 my-10 dark:border-neutral-800" />
          ),
          img: ({ src, alt }) => {
            if (!src || typeof src !== "string") return null;
            const isRemote =
              src.startsWith("http://") || src.startsWith("https://");
            return (
              <span className="block my-6 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-[#121314]">
                {isRemote ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={src}
                    alt={alt || ""}
                    className="w-full h-auto max-h-[480px] object-cover"
                    loading="lazy"
                  />
                ) : (
                  <Image
                    src={src}
                    alt={alt || ""}
                    width={1200}
                    height={630}
                    className="w-full h-auto max-h-[480px] object-cover"
                  />
                )}
                {alt ? (
                  <span className="block px-3 py-2 text-xs text-neutral-500 border-t border-neutral-200 dark:border-neutral-800">
                    {alt}
                  </span>
                ) : null}
              </span>
            );
          },
          pre: ({ children }) => {
            const codeEl = isValidElement<{ className?: string }>(children)
              ? children
              : null;
            const className = codeEl?.props?.className ?? "";
            const lang = className.match(/language-(\w+)/)?.[1] ?? "code";
            const body =
              className.includes("language-") || !codeEl
                ? children
                : cloneElement(codeEl, { className: undefined });
            return (
              <div className="my-6 overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-[#121314]">
                <div className="flex items-center justify-between border-b border-neutral-200 bg-neutral-100 px-4 py-2.5 dark:border-neutral-800/70 dark:bg-[#0b0c0d]">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="h-[11px] w-[11px] rounded-full bg-[#ff5f57]"
                      aria-hidden="true"
                    />
                    <span
                      className="h-[11px] w-[11px] rounded-full bg-[#febc2e]"
                      aria-hidden="true"
                    />
                    <span
                      className="h-[11px] w-[11px] rounded-full bg-[#28c840]"
                      aria-hidden="true"
                    />
                  </div>
                  <span className="text-[11px] font-medium tracking-[0.02em] text-neutral-400 dark:text-white/40">
                    {lang}
                  </span>
                </div>
                <pre className="overflow-x-auto p-4 text-[13.5px] font-mono leading-relaxed text-neutral-800 dark:text-neutral-200">
                  {body}
                </pre>
              </div>
            );
          },
          code: ({ className, children }) => {
            const isBlock = className?.includes("language-") ?? false;
            if (isBlock) {
              return <code className={className}>{children}</code>;
            }
            return (
              <code className="px-1.5 py-0.5 rounded bg-neutral-200 text-neutral-800 text-[14px] font-mono border border-neutral-300 dark:bg-neutral-800/80 dark:text-neutral-200 dark:border-neutral-700/50">
                {children}
              </code>
            );
          },
          table: ({ children }) => (
            <div className="my-6 overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="border-b-2 border-neutral-300 dark:border-neutral-700">
              {children}
            </thead>
          ),
          tbody: ({ children }) => <tbody>{children}</tbody>,
          tr: ({ children }) => (
            <tr className="border-b border-neutral-200 last:border-0 dark:border-neutral-800">
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="px-3 py-2.5 text-left font-semibold text-neutral-900 whitespace-nowrap dark:text-neutral-100">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-3 py-2.5 align-top text-neutral-700 dark:text-neutral-300">
              {children}
            </td>
          ),
        }}
      >
        {preprocessDirectives(content)}
      </ReactMarkdown>
    </div>
  );
}
