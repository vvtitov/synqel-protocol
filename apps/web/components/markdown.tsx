import type { Element, ElementContent } from "hast";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "@/components/code-block";
import { remarkHeadingIds, rewriteHref } from "@/lib/docs-content";

/** Reads `title="..."` (or `title='...'` / `title=bare`) from a code fence meta string. */
function fenceTitle(meta: unknown): string | undefined {
  if (typeof meta !== "string") return undefined;
  const match = /(?:^|\s)title=(?:"([^"]*)"|'([^']*)'|(\S+))/.exec(meta);
  return match ? (match[1] ?? match[2] ?? match[3]) : undefined;
}

function textOf(node: ElementContent): string {
  if (node.type === "text") return node.value;
  if (node.type === "element") return node.children.map(textOf).join("");
  return "";
}

function fenceLanguage(code: Element): string {
  const classes = code.properties.className;
  const list = Array.isArray(classes) ? classes : [];
  for (const cls of list) {
    if (typeof cls === "string" && cls.startsWith("language-")) return cls.slice("language-".length);
  }
  return "text";
}

const components: Components = {
  a({ node: _node, href, children, ...rest }) {
    const target = href === undefined ? undefined : rewriteHref(href);
    const external = target !== undefined && /^https?:\/\//i.test(target);
    return (
      <a
        {...rest}
        href={target}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </a>
    );
  },
  // Fenced code arrives as <pre><code class="language-x">; inline code never
  // goes through `pre`, so it keeps the default <code> rendering.
  pre({ node, children }) {
    const code = node?.children.find(
      (child): child is Element => child.type === "element" && child.tagName === "code",
    );
    if (!code) return <pre>{children}</pre>;
    // mdast-util-to-hast appends one "\n" to fenced code; mdast keeps `meta` on `code.data`.
    const source = code.children.map(textOf).join("").replace(/\n$/, "");
    return (
      <div className="doc-code">
        <CodeBlock code={source} language={fenceLanguage(code)} title={fenceTitle(code.data?.meta)} />
      </div>
    );
  },
  table({ node: _node, ...rest }) {
    return (
      <div className="doc-table">
        <table {...rest} />
      </div>
    );
  },
};

/** Renders a docs markdown string (GFM) with the site's prose styles and CodeBlock. */
export function Markdown({ source, className }: { source: string; className?: string }) {
  return (
    <div className={className ? `doc-prose ${className}` : "doc-prose"}>
      <ReactMarkdown remarkPlugins={[remarkGfm, remarkHeadingIds]} components={components}>
        {source}
      </ReactMarkdown>
    </div>
  );
}
