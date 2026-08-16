import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";
import remarkDirective from "remark-directive";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import {
  GALLERY_CLASS,
  preprocessDirectives,
  remarkDirectives,
} from "@/lib/markdown/directives";

const IMAGE_GRID_CLASS = "image-grid";

interface HElement {
  type: "element";
  tagName: string;
  properties: Record<string, unknown>;
  children: HNode[];
}

interface HRoot {
  type: "root";
  children: HNode[];
}

type HNode =
  | HElement
  | HRoot
  | { type: "text"; value: string }
  | { type: "comment"; value: string };

function getClasses(el: HElement): string[] {
  const value = el.properties.className;
  if (typeof value === "string") return value.split(/\s+/).filter(Boolean);
  if (Array.isArray(value)) {
    return value.flatMap((v) =>
      typeof v === "string" ? v.split(/\s+/).filter(Boolean) : [],
    );
  }
  return [];
}

function getCodeLanguage(pre: HElement): string {
  const code = pre.children.find(
    (c): c is HElement => c.type === "element" && c.tagName === "code",
  );
  const classes = code ? getClasses(code) : [];
  const langClass = classes.find((c) => c.startsWith("language-"));
  return langClass ? langClass.replace("language-", "") : "code";
}

function wrapCodeWindow(pre: HElement): HElement {
  return {
    type: "element",
    tagName: "div",
    properties: { className: "code-window" },
    children: [
      {
        type: "element",
        tagName: "div",
        properties: { className: "code-window-bar" },
        children: [
          {
            type: "element",
            tagName: "span",
            properties: {
              className: "code-window-dots",
              "aria-hidden": "true",
            },
            children: [],
          },
          {
            type: "element",
            tagName: "span",
            properties: { className: "code-lang" },
            children: [{ type: "text", value: getCodeLanguage(pre) }],
          },
        ],
      },
      pre,
    ],
  };
}

function wrapTableScroll(table: HElement): HElement {
  return {
    type: "element",
    tagName: "div",
    properties: { className: "table-scroll" },
    children: [table],
  };
}

function wrapInFigure(img: HElement): HElement {
  const alt = typeof img.properties.alt === "string" ? img.properties.alt : "";
  const figure: HElement = {
    type: "element",
    tagName: "figure",
    properties: {},
    children: [img],
  };
  if (alt) {
    figure.children.push({
      type: "element",
      tagName: "figcaption",
      properties: {},
      children: [{ type: "text", value: alt }],
    });
  }
  return figure;
}

function wrapGalleryImage(img: HElement): HElement {
  const alt = typeof img.properties.alt === "string" ? img.properties.alt : "";
  const wrapper: HElement = {
    type: "element",
    tagName: "span",
    properties: {
      className:
        "block overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-[#121314]",
    },
    children: [img],
  };
  if (alt) {
    wrapper.children.push({
      type: "element",
      tagName: "span",
      properties: {
        className:
          "block px-3 py-2 text-xs text-neutral-500 border-t border-neutral-200 dark:border-neutral-800",
      },
      children: [{ type: "text", value: alt }],
    });
  }
  return wrapper;
}

function fixExternalLink(a: HElement): void {
  const href = a.properties.href;
  if (typeof href !== "string") return;
  const isInternal = href.startsWith("/") && !href.startsWith("//");
  if (!isInternal) {
    a.properties.target = "_blank";
    a.properties.rel = "noopener noreferrer";
  }
}

function processChildren(parent: HNode, inGrid: boolean): void {
  if (parent.type !== "element" && parent.type !== "root") return;
  const children = parent.children;
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    if (child.type !== "element") continue;
    const el = child;
    const isGrid =
      inGrid ||
      getClasses(el).includes(IMAGE_GRID_CLASS) ||
      getClasses(el).includes(GALLERY_CLASS);
    switch (el.tagName) {
      case "pre":
        children[i] = wrapCodeWindow(el);
        break;
      case "table": {
        children[i] = wrapTableScroll(el);
        processChildren(el, isGrid);
        break;
      }
      case "a":
        fixExternalLink(el);
        processChildren(el, isGrid);
        break;
      case "img":
        if (isGrid) {
          el.properties.loading = "lazy";
          children[i] = wrapGalleryImage(el);
        } else {
          children[i] = wrapInFigure(el);
        }
        break;
      default:
        processChildren(el, isGrid);
    }
  }
}

function rehypePostProcess() {
  return (tree: HNode) => {
    processChildren(tree, false);
  };
}

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkDirective)
  .use(remarkDirectives)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeHighlight)
  .use(rehypePostProcess)
  .use(rehypeStringify, { allowDangerousHtml: true });

const htmlCache = new Map<string, string>();

/** Render a Markdown post body to static HTML (server-side only). */
export function renderMarkdownToHtml(markdown: string): string {
  const source = preprocessDirectives(markdown);
  const cached = htmlCache.get(source);
  if (cached) return cached;
  const file = processor.processSync(source);
  const html = String(file);
  htmlCache.set(source, html);
  return html;
}
