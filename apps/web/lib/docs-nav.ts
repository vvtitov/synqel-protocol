export type DocNavItem = { label: string; href: string };
export type DocNavSection = { title: string; items: DocNavItem[] };

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
      { label: "registerCapability", href: "/docs/sdk#registerCapability" },
      { label: "registerWorkflow", href: "/docs/sdk#registerWorkflow" },
      { label: "SemanticRegistry", href: "/docs/sdk#SemanticRegistry" },
      { label: "SemanticEventBus", href: "/docs/sdk#SemanticEventBus" },
      { label: "evaluatePolicy", href: "/docs/sdk#evaluatePolicy" },
      { label: "useSemanticRuntime", href: "/docs/sdk#useSemanticRuntime" },
      { label: "useSemanticEvents", href: "/docs/sdk#useSemanticEvents" },
    ],
  },
  {
    title: "Examples",
    items: [
      { label: "Overview", href: "/docs/examples" },
      { label: "E-commerce", href: "/docs/examples#ecommerce" },
      { label: "Form completion", href: "/docs/examples#form" },
      { label: "Dashboard navigation", href: "/docs/examples#dashboard" },
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
  const targets: DocsScrollSpyTarget[] = [];
  for (const section of DOC_NAV_SECTIONS) {
    for (const item of section.items) {
      const hashIndex = item.href.indexOf("#");
      const path =
        hashIndex === -1 ? item.href : item.href.slice(0, hashIndex);
      const hash = hashIndex === -1 ? null : item.href.slice(hashIndex + 1);
      if (path !== pathname) continue;
      targets.push({ href: item.href, id: hash });
    }
  }
  return targets;
}
