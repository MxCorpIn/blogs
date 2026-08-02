import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/**
 * Landing / marketing content width.
 * max-width 1280px, centered, consistent horizontal padding.
 * Nest inside full-bleed sections so backgrounds stay edge-to-edge.
 */
export const SECTION_CONTAINER_CLASS =
  "mx-auto w-full max-w-[1280px] px-6 md:px-8 lg:px-12";

/**
 * Shared vertical rhythm between landing sections.
 * Keep this modest - adjacent sections stack pt+pb, so large py doubles the gap.
 * Use `SECTION_Y_TOP` for Hero bottom / Footer top.
 */
export const SECTION_Y_TOP = "pt-6 sm:pt-8 md:pt-10";

type ContainerProps = {
  children: ReactNode;
  className?: string;
};

/** Shared max-width container for landing content. */
export default function Container({ children, className }: ContainerProps) {
  return (
    <div className={cn(SECTION_CONTAINER_CLASS, className)}>{children}</div>
  );
}
