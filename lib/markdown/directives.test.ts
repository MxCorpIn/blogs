import { describe, expect, it } from "vitest";
import rehypeStringify from "rehype-stringify";
import remarkDirective from "remark-directive";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import {
  GALLERY_CLASS,
  GALLERY_DEFAULT_COLUMNS,
  parseGalleryColumns,
  preprocessDirectives,
  remarkDirectives,
} from "./directives";

interface DirectiveNode {
  type: string;
  name?: string;
  attributes?: Record<string, string | undefined>;
  children: unknown[];
  data?: {
    hName?: string;
    hProperties?: Record<string, string | number>;
  };
}

function collectDirectives(
  node: unknown,
  out: DirectiveNode[] = [],
): DirectiveNode[] {
  if (!node || typeof node !== "object") return out;
  const candidate = node as { type?: unknown; children?: unknown };
  if (candidate.type === "containerDirective") {
    out.push(node as DirectiveNode);
  }
  if (Array.isArray(candidate.children)) {
    for (const child of candidate.children) collectDirectives(child, out);
  }
  return out;
}

function parseWithDirectives(markdown: string): DirectiveNode[] {
  const processor = unified()
    .use(remarkParse)
    .use(remarkDirective)
    .use(remarkDirectives);
  const tree = processor.runSync(
    processor.parse(preprocessDirectives(markdown)),
  );
  return collectDirectives(tree);
}

describe("parseGalleryColumns", () => {
  it("accepts 2, 3, and 4", () => {
    expect(parseGalleryColumns("2")).toBe(2);
    expect(parseGalleryColumns("3")).toBe(3);
    expect(parseGalleryColumns("4")).toBe(4);
  });

  it("falls back to the default for missing or invalid values", () => {
    expect(parseGalleryColumns(undefined)).toBe(GALLERY_DEFAULT_COLUMNS);
    expect(parseGalleryColumns("1")).toBe(GALLERY_DEFAULT_COLUMNS);
    expect(parseGalleryColumns("5")).toBe(GALLERY_DEFAULT_COLUMNS);
    expect(parseGalleryColumns("2.5")).toBe(GALLERY_DEFAULT_COLUMNS);
    expect(parseGalleryColumns("abc")).toBe(GALLERY_DEFAULT_COLUMNS);
  });
});

describe("preprocessDirectives", () => {
  it("wraps bare attributes in braces", () => {
    expect(preprocessDirectives(":::gallery columns=3\n\n:::")).toBe(
      ":::gallery{columns=3}\n\n:::",
    );
  });

  it("leaves braced attributes, ids, and classes untouched", () => {
    const input = ":::gallery{columns=3}\n\n:::\n\n:::note{.warning}\n\n:::";
    expect(preprocessDirectives(input)).toBe(input);
  });

  it("leaves directives without attributes untouched", () => {
    const input = ":::gallery\n\n![](/a.jpg)\n\n:::";
    expect(preprocessDirectives(input)).toBe(input);
  });

  it("leaves lines inside fenced code blocks untouched", () => {
    const input =
      "```\n:::gallery columns=2\n```\n\n:::gallery columns=4\n\n:::";
    expect(preprocessDirectives(input)).toBe(
      "```\n:::gallery columns=2\n```\n\n:::gallery{columns=4}\n\n:::",
    );
  });

  it("leaves closing fences and closing directives untouched", () => {
    const input = ":::gallery columns=2\n\n:::\n\n```\n:::\n```";
    expect(preprocessDirectives(input)).toBe(
      ":::gallery{columns=2}\n\n:::\n\n```\n:::\n```",
    );
  });
});

describe("remarkDirectives", () => {
  it("defaults a gallery without columns to 2", () => {
    const [directive] = parseWithDirectives(":::gallery\n\n![](/a.jpg)\n\n:::");
    expect(directive?.data).toEqual({
      hName: "div",
      hProperties: { className: GALLERY_CLASS, "data-columns": "2" },
    });
  });

  it("honors the columns attribute", () => {
    const [directive] = parseWithDirectives(
      ":::gallery columns=3\n\n![](/a.jpg)\n\n:::",
    );
    expect(directive?.data?.hProperties).toEqual({
      className: GALLERY_CLASS,
      "data-columns": "3",
    });
  });

  it("falls back to 2 columns for invalid values", () => {
    const [directive] = parseWithDirectives(
      ":::gallery columns=9\n\n![](/a.jpg)\n\n:::",
    );
    expect(directive?.data?.hProperties?.["data-columns"]).toBe("2");
  });

  it("transforms multiple galleries", () => {
    const directives = parseWithDirectives(
      ":::gallery\n\n![](/a.jpg)\n\n:::\n\n:::gallery columns=4\n\n![](/b.jpg)\n\n:::",
    );
    expect(directives).toHaveLength(2);
    expect(directives[0]?.data?.hProperties?.["data-columns"]).toBe("2");
    expect(directives[1]?.data?.hProperties?.["data-columns"]).toBe("4");
  });

  it("leaves unhandled directives untouched", () => {
    const [directive] = parseWithDirectives(":::note\n\nSome note.\n\n:::");
    expect(directive?.data).toBeUndefined();
  });
});

describe("directive rendering pipeline", () => {
  it("emits a gallery div with the requested columns", () => {
    const html = String(
      unified()
        .use(remarkParse)
        .use(remarkDirective)
        .use(remarkDirectives)
        .use(remarkRehype)
        .use(rehypeStringify)
        .processSync(
          preprocessDirectives(
            ":::gallery columns=3\n\n![](/a.jpg)\n![](/b.jpg)\n\n:::",
          ),
        ),
    );
    expect(html).toContain('<div class="gallery" data-columns="3">');
    expect(html).toContain('<img src="/a.jpg" alt="">');
    expect(html).toContain('<img src="/b.jpg" alt="">');
  });

  it("renders unhandled directives as plain divs", () => {
    const html = String(
      unified()
        .use(remarkParse)
        .use(remarkDirective)
        .use(remarkDirectives)
        .use(remarkRehype)
        .use(rehypeStringify)
        .processSync("Before.\n\n:::note\n\nHidden.\n\n:::\n\nAfter."),
    );
    expect(html).toContain("<p>Before.</p>");
    expect(html).toContain("<p>Hidden.</p>");
    expect(html).toContain("<p>After.</p>");
  });
});
