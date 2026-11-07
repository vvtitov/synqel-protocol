import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Markdown } from "@/components/markdown";
import {
  DOC_PAGES,
  extractTitle,
  headingIds,
  readDoc,
  rewriteHref,
} from "./docs-content";

const GITHUB_BLOB = "https://github.com/vvtitov/synqel-protocol/blob/main";

function render(source: string): string {
  return renderToStaticMarkup(createElement(Markdown, { source }));
}

describe("rewriteHref", () => {
  it("maps sibling doc pages to /docs routes", () => {
    expect(rewriteHref("./protocol.md")).toBe("/docs/protocol");
    expect(rewriteHref("protocol.md")).toBe("/docs/protocol");
    expect(rewriteHref("./examples.md")).toBe("/docs/examples");
  });

  it("maps getting-started.md to the /docs index", () => {
    expect(rewriteHref("./getting-started.md")).toBe("/docs");
    expect(rewriteHref("./getting-started.md#install")).toBe("/docs#install");
  });

  it("keeps the hash on doc page links", () => {
    expect(rewriteHref("./sdk.md#x")).toBe("/docs/sdk#x");
  });

  it("maps paths leaving docs/ to GitHub URLs", () => {
    expect(rewriteHref("../CONTRIBUTING.md")).toBe(`${GITHUB_BLOB}/CONTRIBUTING.md`);
    expect(rewriteHref("../packages/sdk/src/index.ts")).toBe(
      `${GITHUB_BLOB}/packages/sdk/src/index.ts`,
    );
    expect(rewriteHref("../README.md#install")).toBe(`${GITHUB_BLOB}/README.md#install`);
  });

  it("maps files inside docs/ that are not site pages to GitHub URLs", () => {
    expect(rewriteHref("./README.md")).toBe(`${GITHUB_BLOB}/docs/README.md`);
  });

  it("leaves absolute URLs, root paths and hashes untouched", () => {
    expect(rewriteHref("https://example.com/a.md")).toBe("https://example.com/a.md");
    expect(rewriteHref("mailto:hi@example.com")).toBe("mailto:hi@example.com");
    expect(rewriteHref("#registerentity")).toBe("#registerentity");
    expect(rewriteHref("/docs/sdk")).toBe("/docs/sdk");
  });
});

describe("headingIds", () => {
  it("slugs h2/h3 like GitHub (camelCase lowercased)", () => {
    const md = "# Title\n\n## registerEntity\n\n### bindAction\n\n#### deep\n";
    expect(headingIds(md)).toEqual([
      { depth: 2, text: "registerEntity", id: "registerentity" },
      { depth: 3, text: "bindAction", id: "bindaction" },
    ]);
  });

  it("uses the plain text of inline code and drops punctuation", () => {
    expect(headingIds("## `@synqel/mcp` adapter\n")).toEqual([
      { depth: 2, text: "@synqel/mcp adapter", id: "synqelmcp-adapter" },
    ]);
    expect(headingIds("## Policy & roles: [actors](./policy.md)\n")).toEqual([
      { depth: 2, text: "Policy & roles: actors", id: "policy--roles-actors" },
    ]);
  });

  it("suffixes duplicate headings with -1, -2", () => {
    const md = "## Example\n\n## Example\n\n### Example\n";
    expect(headingIds(md).map((h) => h.id)).toEqual(["example", "example-1", "example-2"]);
  });

  it("uses a fresh slugger per document", () => {
    headingIds("## Example\n");
    expect(headingIds("## Example\n")[0]?.id).toBe("example");
  });

  it("ignores headings inside fenced code blocks", () => {
    const md = "## Real\n\n```md\n## Fake\n```\n\n~~~\n### Also fake\n~~~\n\n### After\n";
    expect(headingIds(md).map((h) => h.text)).toEqual(["Real", "After"]);
  });
});

describe("extractTitle", () => {
  it("returns the first H1 text", () => {
    expect(extractTitle("Intro\n\n# `@synqel/sdk` API\n\n## A\n\n# Second\n")).toBe("@synqel/sdk API");
  });

  it("returns undefined when there is no H1", () => {
    expect(extractTitle("## Only h2\n")).toBeUndefined();
  });

  it("ignores an H1 inside a code fence", () => {
    expect(extractTitle("```sh\n# comment\n```\n\n# Real title\n")).toBe("Real title");
  });
});

describe("readDoc", () => {
  it("maps every route slug to a docs/ markdown file", () => {
    expect(DOC_PAGES).toEqual({
      "": "getting-started.md",
      protocol: "protocol.md",
      sdk: "sdk.md",
      events: "events.md",
      policy: "policy.md",
      examples: "examples.md",
    });
  });

  it("reads an existing doc file", () => {
    expect(readDoc("protocol").length).toBeGreaterThan(0);
  });

  it("throws a clear error for an unknown slug", () => {
    expect(() => readDoc("nope")).toThrow(/Unknown docs slug "nope"/);
  });
});

describe("Markdown", () => {
  it("gives h2/h3 the same ids as headingIds", () => {
    const md = [
      "# Title",
      "## registerEntity",
      "## `@synqel/mcp` adapter",
      "### Example",
      "### Example",
      "## Policy & roles: [actors](./policy.md)",
      "```md\n## Fake\n```",
    ].join("\n\n");
    const html = render(md);
    const rendered = [...html.matchAll(/<h[23] id="([^"]+)"/g)].map((m) => m[1]);
    expect(rendered).toEqual(headingIds(md).map((h) => h.id));
  });

  it("renders fenced code with CodeBlock, language and fence title", () => {
    const html = render('```ts title="src/app.ts"\nconst a = 1;\n```\n');
    expect(html).toContain("src/app.ts");
    expect(html).toContain(">ts</span>");
    expect(html).toContain("Copy");
    expect(html).toContain('class="language-ts');
    expect(html).toContain("const a = 1;");
  });

  it("defaults fenced code without a language to text", () => {
    const html = render("```\nplain\n```\n");
    expect(html).toContain(">text</span>");
    expect(html).toContain("Copy");
  });

  it("keeps inline code inline", () => {
    const html = render("Use `executeAction` here.");
    expect(html).toContain("<code>executeAction</code>");
    expect(html).not.toContain("Copy");
  });

  it("rewrites links and opens external links in a new tab", () => {
    const html = render("[sdk](./sdk.md#x) [site](https://example.com) [c](../CONTRIBUTING.md)");
    expect(html).toContain('href="/docs/sdk#x"');
    expect(html).not.toMatch(/href="\/docs\/sdk#x"[^>]*target/);
    expect(html).toContain('href="https://example.com" target="_blank" rel="noopener noreferrer"');
    expect(html).toContain(`href="${GITHUB_BLOB}/CONTRIBUTING.md" target="_blank" rel="noopener noreferrer"`);
  });

  it("wraps GFM tables in a horizontal scroll container", () => {
    const html = render("| a | b |\n| - | - |\n| 1 | 2 |\n");
    expect(html).toMatch(/<div class="doc-table"[^>]*><table>/);
  });

  it("renders blockquotes", () => {
    expect(render("> note")).toContain("<blockquote>");
  });
});
