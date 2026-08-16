import { visit } from "unist-util-visit";

export const GALLERY_COLUMN_OPTIONS = [2, 3, 4] as const;
export type GalleryColumns = (typeof GALLERY_COLUMN_OPTIONS)[number];
export const GALLERY_DEFAULT_COLUMNS: GalleryColumns = 2;
export const GALLERY_CLASS = "gallery";

interface ContainerDirectiveNode {
  type: "containerDirective";
  name?: string;
  attributes?: Record<string, string | undefined>;
  children: unknown[];
  data?: {
    hName?: string;
    hProperties?: Record<string, string | number>;
  };
}

/** Parse a gallery `columns` attribute, falling back to the default. */
export function parseGalleryColumns(value: string | undefined): GalleryColumns {
  const n = Number(value);
  return (GALLERY_COLUMN_OPTIONS as readonly number[]).includes(n)
    ? (n as GalleryColumns)
    : GALLERY_DEFAULT_COLUMNS;
}

function handleGallery(node: ContainerDirectiveNode): void {
  const columns = parseGalleryColumns(node.attributes?.columns);
  const data = node.data ?? (node.data = {});
  data.hName = "div";
  data.hProperties = {
    className: GALLERY_CLASS,
    "data-columns": String(columns),
  };
}

const CONTAINER_DIRECTIVE_HANDLERS: Record<
  string,
  (node: ContainerDirectiveNode) => void
> = {
  gallery: handleGallery,
  // Future directives (note, warning, tabs, ...) register here.
};

/**
 * remark plugin that turns handled container directives (e.g. `:::gallery`)
 * into renderable nodes via `data.hName`/`data.hProperties`.
 */
export function remarkDirectives() {
  return (tree: { type: string; children: unknown[] }) => {
    visit(tree, (node) => {
      if (node.type !== "containerDirective") return;
      const directive = node as unknown as ContainerDirectiveNode;
      const handler = directive.name
        ? CONTAINER_DIRECTIVE_HANDLERS[directive.name]
        : undefined;
      handler?.(directive);
    });
  };
}

/**
 * Normalize bare directive attributes (`:::gallery columns=2`) into the
 * braced form the directive parser understands (`:::gallery{columns=2}`).
 * Lines inside fenced code blocks are left untouched.
 */
export function preprocessDirectives(markdown: string): string {
  let inCodeFence = false;
  return markdown.replace(
    /^(`{3,}|~{3,})[^\n]*$|^:::([a-zA-Z][\w-]*)([^{}\n]*)$/gm,
    (
      match,
      fence: string | undefined,
      name: string | undefined,
      attrs: string | undefined,
    ) => {
      if (fence) {
        inCodeFence = !inCodeFence;
        return match;
      }
      if (inCodeFence) return match;
      const raw = (attrs ?? "").trim();
      return raw ? `:::${name}{${raw}}` : match;
    },
  );
}
