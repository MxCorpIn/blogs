import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/** Outer / divider stroke - follows the theme's decorative geometry token. */
const FRAME_STROKE = "var(--geom)";

/**
 * "+" registration marks at each corner of the dashed frame.
 * Anchored with left/top % so translate(-50%,-50%) centers on the corner point.
 * Solid page-bg mask + padding so dash strokes don't show through the glyph.
 */
function CornerPlus({
  position,
  /** Section/page bg used to mask the dash under the plus (follows page background) */
  bg = "var(--background)",
}: {
  position: "tl" | "tr" | "bl" | "br";
  bg?: string;
}) {
  // Corner intersection in parent coords (0% or 100% on each axis)
  const anchor =
    position === "tl"
      ? { top: "0%", left: "0%" }
      : position === "tr"
        ? { top: "0%", left: "100%" }
        : position === "bl"
          ? { top: "100%", left: "0%" }
          : { top: "100%", left: "100%" };

  return (
    <span
      aria-hidden
      className="pointer-events-none absolute z-30 select-none flex items-center justify-center text-[15px] leading-none font-light text-neutral-400"
      style={{
        top: anchor.top,
        left: anchor.left,
        // Center glyph+mask exactly on the corner intersection
        transform: "translate(-50%, -50%)",
        // 4–6px pad around glyph → clean mask over dash ends
        padding: "5px",
        backgroundColor: bg,
      }}
    >
      +
    </span>
  );
}

/**
 * Controlled dashed rectangle (~5px dash / 5px gap) on all four edges.
 * Uses background gradients so dash length is consistent across browsers.
 */
function DashedFrameBorder() {
  const dash = `repeating-linear-gradient(90deg, ${FRAME_STROKE} 0 5px, transparent 5px 10px)`;
  const dashV = `repeating-linear-gradient(180deg, ${FRAME_STROKE} 0 5px, transparent 5px 10px)`;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-10"
      style={{
        backgroundImage: `${dash}, ${dash}, ${dashV}, ${dashV}`,
        backgroundSize: "100% 1px, 100% 1px, 1px 100%, 1px 100%",
        backgroundPosition: "top left, bottom left, top left, top right",
        backgroundRepeat: "repeat-x, repeat-x, repeat-y, repeat-y",
      }}
    />
  );
}

/**
 * Horizontal dashed rule (~5px dash / 5px gap).
 * Use for footer / section separators.
 */
export function DashedRule({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("h-px w-full shrink-0", className)}
      style={{
        backgroundImage: `repeating-linear-gradient(90deg, ${FRAME_STROKE} 0 5px, transparent 5px 10px)`,
        backgroundSize: "100% 1px",
        backgroundRepeat: "repeat-x",
      }}
    />
  );
}

/**
 * Transparent dashed card with corner plus marks.
 * Place content as children; frame draws around the box.
 */
export default function DashedFrame({
  children,
  className,
  contentClassName,
  corners = true,
  /**
   * Fill color for the frame surface.
   * Use solid values for overlays (e.g. mega menus); "transparent" for landing cards.
   * Applied via style so it is not overridden by conflicting Tailwind bg classes.
   */
  bg = "transparent",
  /** Background color for corner "+" masks (must match section/page behind the frame) */
  cornerBg = "var(--background)",
}: {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  /** Show registration-mark "+" at each corner (default true) */
  corners?: boolean;
  bg?: string;
  cornerBg?: string;
}) {
  return (
    <div
      className={cn("relative w-full", className)}
      style={{ backgroundColor: bg }}
    >
      {/* z-10 - dashes sit under corner marks */}
      <DashedFrameBorder />
      {corners ? (
        <>
          <CornerPlus position="tl" bg={cornerBg} />
          <CornerPlus position="tr" bg={cornerBg} />
          <CornerPlus position="bl" bg={cornerBg} />
          <CornerPlus position="br" bg={cornerBg} />
        </>
      ) : null}
      <div
        className={cn("relative z-[1]", contentClassName)}
        style={bg !== "transparent" ? { backgroundColor: bg } : undefined}
      >
        {children}
      </div>
    </div>
  );
}
