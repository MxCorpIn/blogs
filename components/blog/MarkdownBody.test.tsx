// @vitest-environment jsdom
import type { ComponentProps } from "react";
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import MarkdownBody from "./MarkdownBody";

vi.mock("next/image", () => ({
  default: (props: ComponentProps<"img">) => <img {...props} />,
}));

vi.mock("next/link", () => ({
  default: ({ children, ...props }: ComponentProps<"a">) => (
    <a {...props}>{children}</a>
  ),
}));

describe("MarkdownBody galleries", () => {
  it("renders a gallery directive as a grid with default columns", () => {
    const { container } = render(
      <MarkdownBody
        content={`:::gallery

![](/a.jpg)
![](/b.jpg)

:::`}
      />,
    );

    const grid = container.querySelector(".gallery");
    const images = container.querySelectorAll("img");

    expect(grid).toBeInTheDocument();
    expect(grid).toHaveAttribute("data-columns", "2");
    expect(grid?.querySelectorAll("img")).toHaveLength(2);
    expect(images).toHaveLength(2);
  });

  it("honors the columns attribute for 2, 3, and 4 columns", () => {
    const { container } = render(
      <MarkdownBody
        content={`:::gallery columns=2

![](/a.jpg)

:::

:::gallery columns=3

![](/b.jpg)

:::

:::gallery columns=4

![](/c.jpg)

:::`}
      />,
    );

    const grids = container.querySelectorAll(".gallery");
    expect(grids).toHaveLength(3);
    expect(grids[0]).toHaveAttribute("data-columns", "2");
    expect(grids[1]).toHaveAttribute("data-columns", "3");
    expect(grids[2]).toHaveAttribute("data-columns", "4");
  });

  it("falls back to 2 columns for invalid values", () => {
    const { container } = render(
      <MarkdownBody
        content={`:::gallery columns=5

![](/a.jpg)

:::`}
      />,
    );

    expect(container.querySelector(".gallery")).toHaveAttribute(
      "data-columns",
      "2",
    );
  });

  it("renders images inside galleries with the custom image component", () => {
    const { container } = render(
      <MarkdownBody
        content={`:::gallery columns=2

![First](/a.jpg)
![Second](https://example.com/b.jpg)

:::`}
      />,
    );

    const images = container.querySelectorAll(".gallery img");
    expect(images).toHaveLength(2);
    expect(images[0]).toHaveAccessibleName("First");
    expect(images[1]).toHaveAccessibleName("Second");
    expect(images[1]).toHaveAttribute("loading", "lazy");
  });

  it("keeps standalone images and multiple galleries separate", () => {
    const { container } = render(
      <MarkdownBody
        content={`:::gallery

![A](/a.jpg)

:::

![Standalone](/standalone.png)

:::gallery columns=3

![B](/b.jpg)

:::`}
      />,
    );

    const grids = container.querySelectorAll(".gallery");
    const images = container.querySelectorAll("img");

    expect(grids).toHaveLength(2);
    expect(grids[0]?.querySelectorAll("img")).toHaveLength(1);
    expect(grids[1]?.querySelectorAll("img")).toHaveLength(1);
    expect(images).toHaveLength(3);
    expect(images[1]).toHaveAccessibleName("Standalone");
  });

  it("renders unhandled directives as plain blocks without breaking content", () => {
    const { container } = render(
      <MarkdownBody
        content={`Before.

:::note

Hidden.

:::

After.`}
      />,
    );

    expect(container.textContent).toContain("Before.");
    expect(container.textContent).toContain("Hidden.");
    expect(container.textContent).toContain("After.");
    expect(container.querySelector(".gallery")).toBeNull();
  });
});
