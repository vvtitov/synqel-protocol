export type DocNavItem = { label: string; href: string };
export type DocNavSection = { title: string; items: DocNavItem[] };

/** Match `pathname` from `usePathname()` against nav URLs (slashes / trailing slashes). */
export function normalizeDocsPathname(path: string): string {
  const p = path.trim();
  if (p === "" || p === "/") return "/";
  return p.replace(/\/+$/, "") || "/";
}

export function docPageMatchesPathname(
  pageHref: string,
  pathname: string,
): boolean {
  return normalizeDocsPathname(pageHref) === normalizeDocsPathname(pathname);
}

export const DOC_NAV_SECTIONS: DocNavSection[] = [
  {
    title: "Getting Started",
    items: [
      { label: "Overview", href: "/docs" },
      { label: "Installation", href: "/docs#installation" },
      { label: "Quick start", href: "/docs#quick-start" },
    ],
  },
  {
    title: "Protocol",
    items: [
      { label: "Overview", href: "/docs/protocol" },
      { label: "Entities", href: "/docs/protocol#entities" },
      { label: "Actions", href: "/docs/protocol#actions" },
      { label: "Capabilities", href: "/docs/protocol#capabilities" },
      { label: "Workflows", href: "/docs/protocol#workflows" },
      { label: "Registry snapshot", href: "/docs/protocol#registry-snapshot" },
      { label: "Events", href: "/docs/events" },
      { label: "Policy", href: "/docs/policy" },
    ],
  },
  {
    title: "SDK Reference",
    items: [
      { label: "Overview", href: "/docs/sdk" },
      { label: "registerEntity", href: "/docs/sdk#registerEntity" },
      { label: "registerAction", href: "/docs/sdk#registerAction" },
      { label: "bindAction", href: "/docs/sdk#bindAction" },
      { label: "executeAction", href: "/docs/sdk#executeAction" },
      { label: "Snapshot & HTTP", href: "/docs/sdk#snapshot" },
      { label: "registerCapability", href: "/docs/sdk#registerCapability" },
      { label: "registerWorkflow", href: "/docs/sdk#registerWorkflow" },
      { label: "SemanticRegistry", href: "/docs/sdk#SemanticRegistry" },
      { label: "SemanticEventBus", href: "/docs/sdk#SemanticEventBus" },
      { label: "evaluatePolicy", href: "/docs/sdk#evaluatePolicy" },
      { label: "useSemanticRuntime", href: "/docs/sdk#useSemanticRuntime" },
      { label: "useSemanticEvents", href: "/docs/sdk#useSemanticEvents" },
      { label: "MCP adapter (@synqel/mcp)", href: "/docs/sdk#synqel-mcp" },
    ],
  },
  {
    title: "Examples",
    items: [
      { label: "Overview", href: "/docs/examples" },
      { label: "E-commerce", href: "/docs/examples#ecommerce" },
      { label: "Form completion", href: "/docs/examples#form" },
      { label: "Dashboard navigation", href: "/docs/examples#dashboard" },
      { label: "Agents & MCP", href: "/docs/examples#agents-mcp" },
    ],
  },
];

/** Paths under each sidebar group heading (pathname-only, for styling the group title). */
export const DOC_SECTION_PAGES: Record<string, string[]> = {
  "Getting Started": ["/docs"],
  Protocol: ["/docs/protocol", "/docs/events", "/docs/policy"],
  "SDK Reference": ["/docs/sdk"],
  Examples: ["/docs/examples"],
};

export type DocsScrollSpyTarget = { href: string; id: string | null };

/** Ordered sidebar entries for `pathname`: used to match headings in the docs article. */
export function getDocsScrollSpyTargets(pathname: string): DocsScrollSpyTarget[] {
  const here = normalizeDocsPathname(pathname);
  const targets: DocsScrollSpyTarget[] = [];
  for (const section of DOC_NAV_SECTIONS) {
    for (const item of section.items) {
      const hashIndex = item.href.indexOf("#");
      const path =
        hashIndex === -1 ? item.href : item.href.slice(0, hashIndex);
      const hash = hashIndex === -1 ? null : item.href.slice(hashIndex + 1);
      if (normalizeDocsPathname(path) !== here) continue;
      targets.push({ href: item.href, id: hash });
    }
  }
  return targets;
}
