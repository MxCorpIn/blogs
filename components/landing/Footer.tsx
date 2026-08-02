import Container, { SECTION_Y_TOP } from "@/components/ui/Container";
import DashedFrame, { DashedRule } from "@/components/landing/DashedFrame";
import { cn } from "@/lib/utils";
import { Coffee, Github, Mail, Rss, Twitter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Left → right underline on hover (smooth scale-x from origin-left).
 * Use for text links; optional `className` for layout (e.g. inline-flex).
 */
function FooterLink({
  href,
  children,
  className,
  external,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  external?: boolean;
}) {
  const isExternal =
    external ?? (href.startsWith("http") || href.startsWith("mailto:"));

  return (
    <Link
      href={href}
      target={isExternal && href.startsWith("http") ? "_blank" : undefined}
      rel={
        isExternal && href.startsWith("http")
          ? "noopener noreferrer"
          : undefined
      }
      className={cn(
        "group/flink relative inline-flex w-fit max-w-full items-center gap-2",
        "text-sm font-medium tracking-[-0.005em] text-neutral-600 transition-colors duration-300 ease-out",
        "hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-100",
        className,
      )}
    >
      <span className="relative inline-block max-w-full">
        {children}
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute bottom-0 left-0 h-px w-full",
            "origin-left scale-x-0 bg-current",
            "transition-transform duration-300 ease-out",
            "group-hover/flink:scale-x-100",
          )}
        />
      </span>
    </Link>
  );
}

export default function Footer() {
  return (
    <footer className={`w-full pb-8 sm:pb-10 ${SECTION_Y_TOP}`}>
      <Container>
        <DashedFrame>
          {/* Brand row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-6 sm:px-8 md:px-10 py-6 sm:py-7">
            <div className="flex flex-col gap-1.5">
              <Link
                href="/"
                className="inline-flex w-fit items-center -ml-1 sm:-ml-1.5"
              >
                <Image
                  src="/logo/ossium_fullname_logo.webp"
                  alt="Ossium"
                  width={160}
                  height={40}
                  className="h-6 sm:h-7 w-auto object-contain object-left"
                />
              </Link>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed max-w-sm">
                The ossium blog - practical guides on open source contribution,
                GSoC, first PRs, and the tools that get you unstuck.
              </p>
            </div>
            <FooterLink href="/feed.xml" className="text-sm">
              <span className="inline-flex items-center gap-2">
                <Rss className="w-3.5 h-3.5 shrink-0" />
                RSS feed
              </span>
            </FooterLink>
          </div>

          <DashedRule />

          {/* Social + copyright */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-6 sm:px-8 md:px-10 py-5 sm:py-6 text-xs text-neutral-500 dark:text-neutral-400">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="inline-flex h-5 items-center text-[11px] font-semibold uppercase tracking-[0.08em] leading-none text-neutral-500">
                Follow us
              </span>
              <FooterLink
                href="https://x.com/Manixh02"
                className="h-5 items-center leading-none"
              >
                <span className="inline-flex h-5 items-center gap-2 leading-none">
                  <Twitter className="w-4 h-4 shrink-0" />
                  Twitter
                </span>
              </FooterLink>
              <FooterLink
                href="https://github.com/MxCorpIn/blogs"
                className="h-5 items-center leading-none"
              >
                <span className="inline-flex h-5 items-center gap-2 leading-none">
                  <Github className="w-4 h-4 shrink-0" />
                  GitHub
                </span>
              </FooterLink>
              <FooterLink
                href="mailto:help@ossium.in"
                className="h-5 items-center leading-none"
              >
                <span className="inline-flex h-5 items-center gap-2 leading-none">
                  <Mail className="w-4 h-4 shrink-0" />
                  Email
                </span>
              </FooterLink>
              <FooterLink
                href="https://buymeacoffee.com/manixh"
                className="h-5 items-center leading-none"
              >
                <span className="inline-flex h-5 items-center gap-2 leading-none">
                  <Coffee className="w-4 h-4 shrink-0" />
                  Buy me a coffee
                </span>
              </FooterLink>
            </div>
            <div className="text-neutral-500">
              © 2026 Ossium. All rights reserved.
            </div>
          </div>
        </DashedFrame>
      </Container>
    </footer>
  );
}
