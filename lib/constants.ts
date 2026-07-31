/** Public base URL of the site — from `NEXT_PUBLIC_APP_URL`, falls back to blog.ossium.in. */
export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://blog.ossium.in";

/** Static site-wide config shared by metadata and UI. */
export const APP_CONFIG = {
  name: "ossium",
  description:
    "Blog & guides on open source contribution, GSoC, and GitHub workflows",
  defaultOgImage: "/demo/oss_og-toposspage.png",
} as const;

/** Base URL for the "Edit this page" link — GitHub file-edit path prefix. */
export const SOURCE_EDIT_BASE = "https://github.com/MxCorpIn/blogs/edit/main";
