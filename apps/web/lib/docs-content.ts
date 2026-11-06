/**
 * Server-only access to the monorepo `docs/*.md` files, which are the single
 * documentation source for both GitHub and the site.
 *
 * Uses `node:fs`, so import it only from Server Components / build-time code.
 *
 * Titles: pages render the markdown's own `# H1` (styled by `.doc-prose h1`)
 * instead of a hand-written one. `extractTitle` exists for page metadata only.
 * Keeping the H1 in the rendered source also keeps heading ids identical to
 * GitHub, whose slugger counts the H1 when de-duplicating ids.
 */
import fs from "node:fs";
import path from "node:path";
import GithubSlugger from "github-slugger";
import type { Heading, Nodes, Root } from "mdast";
import { toString } from "mdast-util-to-string";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import { unified } from "unified";

/** Route slug under `/docs` → markdown file in the monorepo `docs/` folder. */
export const DOC_PAGES = {
  "": "getting-started.md",
  protocol: "protocol.md",
  sdk: "sdk.md",
  events: "events.md",
  policy: "policy.md",
  examples: "examples.md",
} as const satisfies Record<string, string>;

export type DocSlug = keyof typeof DOC_PAGES;

export interface DocHeading {
  depth: 2 | 3;
  text: string;
  id: string;
}

const GITHUB_BLOB = "https://github.com/vvtitov/synqel-protocol/blob/main";
const URL_SCHEME = /^[a-z][a-z\d+.-]*:/i;

function isDocSlug(slug: string): slug is DocSlug {
  return Object.prototype.hasOwnProperty.call(DOC_PAGES, slug);
}

/**
 * Finds the monorepo `docs/` folder by walking up from `process.cwd()` until a
 * directory holds both `docs/` and `apps/web/`. Works when Next runs from
 * `apps/web` (→ `../../docs`) and when tools run from the repo root (→ `docs`).
 */
function docsDir(): string {
  const tried: string[] = [];
  let dir = process.cwd();
  for (;;) {
    const candidate = path.join(dir, "docs");
    tried.push(candidate);
    if (
      fs.existsSync(candidate) &&
      fs.statSync(candidate).isDirectory() &&
      fs.existsSync(path.join(dir, "apps", "web"))
    ) {
      return candidate;
    }
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  throw new Error(`Synqel docs folder not found. Looked for: ${tried.join(", ")}`);
}

/** Reads the markdown for a `/docs` route slug at build time. */
export function readDoc(slug: string): string {
  if (!isDocSlug(slug)) {
    const known = Object.keys(DOC_PAGES)
      .map((s) => JSON.stringify(s))
      .join(", ");
    throw new Error(`Unknown docs slug ${JSON.stringify(slug)}. Known slugs: ${known}`);
  }
  const file = path.join(docsDir(), DOC_PAGES[slug]);
  if (!fs.existsSync(file)) {
    throw new Error(`Docs file not found for slug ${JSON.stringify(slug)}: ${file}`);
  }
  return fs.readFileSync(file, "utf8");
}

function parse(markdown: string): Root {
  return unified().use(remarkParse).use(remarkGfm).parse(markdown);
}

/** Plain text of a heading as GitHub sees it: inline code kept, markup and raw HTML dropped. */
function headingText(node: Heading): string {
  return toString(node, { includeHtml: false }).trim();
}

/** Visits every heading in document order (including inside lists and blockquotes). */
function eachHeading(tree: Nodes, visit: (node: Heading) => void): void {
  if (tree.type === "heading") visit(tree);
  if ("children" in tree) {
    for (const child of tree.children) eachHeading(child, visit);
  }
}

/**
 * Assigns GitHub-compatible ids to every heading of an mdast tree, with a
 * fresh slugger per tree so duplicates get `-1`, `-2`, … exactly like GitHub.
 * Returns the assigned ids in document order.
 */
function assignHeadingIds(tree: Root): { node: Heading; text: string; id: string }[] {
  const slugger = new GithubSlugger();
  const out: { node: Heading; text: string; id: string }[] = [];
  eachHeading(tree, (node) => {
    const text = headingText(node);
    const id = slugger.slug(text);
    node.data = {
      ...node.data,
      hProperties: { ...node.data?.hProperties, id },
    };
    out.push({ node, text, id });
  });
  return out;
}

/**
 * Remark plugin used by `<Markdown>`: sets the same heading ids that
 * `headingIds` reports, so `#anchor`s match GitHub and the site.
 */
export function remarkHeadingIds() {
  return (tree: Root) => {
    assignHeadingIds(tree);
  };
}

/** h2/h3 headings with their GitHub-compatible ids (fenced code is ignored by the parser). */
export function headingIds(markdown: string): DocHeading[] {
  return assignHeadingIds(parse(markdown)).flatMap(({ node, text, id }) =>
    node.depth === 2 || node.depth === 3 ? [{ depth: node.depth, text, id }] : [],
  );
}

/** Text of the first `# ` heading, for page metadata. */
export function extractTitle(markdown: string): string | undefined {
  let title: string | undefined;
  eachHeading(parse(markdown), (node) => {
    if (title === undefined && node.depth === 1) title = headingText(node);
  });
  return title;
}

/**
 * Rewrites a link written relative to `docs/`:
 * - `./protocol.md` → `/docs/protocol`, `./getting-started.md` → `/docs`, hash kept;
 * - any other relative path (inside or outside `docs/`) → GitHub blob URL;
 * - absolute URLs, root paths and `#hash` links are returned unchanged.
 */
export function rewriteHref(href: string): string {
  if (href === "" || href.startsWith("#") || href.startsWith("/") || URL_SCHEME.test(href)) {
    return href;
  }
  const cut = href.search(/[?#]/);
  const filePart = cut === -1 ? href : href.slice(0, cut);
  const suffix = cut === -1 ? "" : href.slice(cut);
  const resolved = path.posix.normalize(path.posix.join("docs", filePart));
  if (resolved === ".." || resolved.startsWith("../")) return href;

  for (const [slug, file] of Object.entries(DOC_PAGES)) {
    if (resolved === `docs/${file}`) {
      return `${slug === "" ? "/docs" : `/docs/${slug}`}${suffix}`;
    }
  }
  return `${GITHUB_BLOB}/${resolved}${suffix}`;
}
