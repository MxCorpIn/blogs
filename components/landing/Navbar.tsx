import Container from "@/components/ui/Container";
import SearchOverlay from "@/components/ui/SearchOverlay";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { Github } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

/** Minimal transparent navbar - logo on the left, search / GitHub / theme on the right. */
export default function Navbar() {
  return (
    <header className="relative z-40 w-full">
      <Container className="flex items-center justify-between gap-4 py-5 sm:py-6">
        <nav
          aria-label="Primary"
          className="flex w-full items-center justify-between gap-4"
        >
          <Link href="/" aria-label="Ossium - home" className="shrink-0">
            <Image
              src="/logo/ossium_fullname_logo.webp"
              alt="Ossium"
              width={160}
              height={40}
              priority
              className="h-6 w-auto object-contain sm:h-7"
            />
            <span className="sr-only">Ossium - home</span>
          </Link>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <SearchOverlay />
            <a
              href="https://github.com/MxCorpIn/blogs"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Give a star on GitHub"
              className="inline-flex h-9 shrink-0 items-center justify-center rounded-full bg-white text-neutral-600 transition-colors duration-200 ease-out hover:bg-neutral-200 hover:text-neutral-900 dark:bg-white/5 dark:text-neutral-300 dark:hover:bg-white/10 dark:hover:text-white"
            >
              <span className="inline-flex items-center gap-1.5 px-3.5">
                <span className="hidden whitespace-nowrap text-[13px] font-medium lg:inline">
                  Give a star
                </span>
                <Github size={15} />
              </span>
            </a>
            <ThemeToggle />
          </div>
        </nav>
      </Container>
    </header>
  );
}
