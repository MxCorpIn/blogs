import Link from "next/link";

/** Decorative diamond / rhombus outlines from thin diagonals (left & right edges). */
function EdgeGeometry({ side }: { side: "left" | "right" }) {
  const isLeft = side === "left";
  return (
    <svg
      className="pointer-events-none absolute top-0 bottom-0 h-full w-[min(42vw,420px)] opacity-100"
      style={{ [isLeft ? "left" : "right"]: 0 }}
      viewBox="0 0 200 800"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <g
        fill="none"
        stroke="var(--geom)"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
        transform={isLeft ? undefined : "translate(200,0) scale(-1,1)"}
      >
        <path d="M0 0 L90 120 L0 240 L90 360 L0 480 L90 600 L0 720 L40 800" />
        <path d="M0 80 L70 200 L0 320 L70 440 L0 560 L70 680 L0 800" />
        <path d="M20 0 L100 140 L20 280 L100 420 L20 560 L100 700 L50 800" />
        <path d="M0 160 L55 260 L0 360 L55 460 L0 560 L55 660 L0 760" />
        <path d="M0 40 L110 200 L0 360" />
        <path d="M0 200 L110 360 L0 520" />
        <path d="M0 360 L110 520 L0 680" />
        <path d="M0 120 L80 240 L0 360 L80 480 L0 600" />
        <path d="M30 80 L95 200 L30 320 L95 440 L30 560 L95 680" />
        <path d="M0 280 L65 380 L0 480 L65 580 L0 680" />
        <path
          d="M45 0 L120 160 L45 320 L120 480 L45 640 L90 800"
          opacity="0.7"
        />
        <path d="M0 440 L100 560 L0 680 L50 760" opacity="0.65" />
      </g>
    </svg>
  );
}

/** Custom 404 page with decorative diamond geometry. */
export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#f5f2ea] px-6 py-16 text-[#2b2926] dark:bg-black dark:text-[#e8e4d8]">
      <EdgeGeometry side="left" />
      <EdgeGeometry side="right" />

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 70% at 50% 50%, var(--vignette) 35%, transparent 100%)",
        }}
        aria-hidden
      />

      <main className="relative z-10 flex max-w-3xl flex-col items-center text-center">
        <h1 className="select-none">
          <span className="block text-[clamp(2.5rem,8vw,5.5rem)] font-semibold uppercase leading-[1.05] tracking-tight text-current">
            The page
          </span>
          <span className="mt-1 block text-[clamp(2.5rem,8vw,5.5rem)] font-semibold uppercase leading-[1.05] tracking-tight text-current">
            You&apos;re looking for
          </span>
          <span className="mt-2 block text-[clamp(2.25rem,7vw,4.75rem)] font-normal italic leading-[1.15] tracking-normal text-current normal-case">
            doesn&apos;t exist
          </span>
        </h1>

        <p className="mt-10 max-w-md text-[11px] font-medium uppercase leading-relaxed tracking-[0.22em] text-neutral-500 sm:text-[13px] sm:tracking-[0.28em]">
          Please check the URL or return to the
          <br className="hidden sm:block" /> homepage to continue browsing.
        </p>

        <Link
          href="/"
          className="mt-12 inline-flex min-w-[200px] items-center justify-center bg-[#2b2926] px-10 py-3.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#f5f2ea] transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] dark:bg-[#e8e4d8] dark:text-black sm:min-w-[240px] sm:text-xs"
          style={{
            // Ticket / elongated hexagon: flat top & bottom, pointed sides
            clipPath:
              "polygon(18px 0%, calc(100% - 18px) 0%, 100% 50%, calc(100% - 18px) 100%, 18px 100%, 0% 50%)",
          }}
        >
          Back to homepage
        </Link>
      </main>
    </div>
  );
}
