"use client";

import { useState } from "react";
import { Check, Share2 } from "lucide-react";

/** Share button - native share sheet when available, otherwise copies the URL. */
export default function ShareButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: document.title, url });
        return;
      } catch {
        // user cancelled the native sheet - fall through to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable; nothing more we can do
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label={copied ? "Link copied" : "Share this post"}
      className="inline-flex items-center gap-1.5 rounded-full bg-neutral-200/80 px-3.5 py-1.5 text-sm font-semibold tracking-[0.005em] text-neutral-700 transition-colors duration-200 ease-out hover:text-neutral-900 dark:bg-neutral-800/60 dark:text-neutral-300 dark:hover:text-neutral-100"
    >
      {copied ? (
        <Check size={13} className="text-neutral-700 dark:text-neutral-200" />
      ) : (
        <Share2 size={13} />
      )}
      {copied ? "Copied" : "Share"}
    </button>
  );
}
