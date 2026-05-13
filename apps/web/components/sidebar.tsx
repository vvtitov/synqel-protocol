"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = { label: string; href: string };
type Section = { title: string; items: NavItem[] };

const SECTIONS: Section[] = [
  {
    title: "Getting Started",
    items: [
      { label: "Overview",     href: "/docs" },
      { label: "Installation", href: "/docs#installation" },
      { label: "Quick start",  href: "/docs#quick-start" },
    ],
  },
  {
    title: "Protocol",
    items: [
      { label: "Overview",     href: "/docs/protocol" },
      { label: "Entities",     href: "/docs/protocol#entities" },
      { label: "Actions",      href: "/docs/protocol#actions" },
      { label: "Capabilities", href: "/docs/protocol#capabilities" },
      { label: "Workflows",    href: "/docs/protocol#workflows" },
      { label: "Events",       href: "/docs/events" },
      { label: "Policy",       href: "/docs/policy" },
    ],
  },
  {
    title: "SDK Reference",
    items: [
      { label: "Overview",             href: "/docs/sdk" },
      { label: "registerEntity",       href: "/docs/sdk#registerEntity" },
      { label: "registerAction",       href: "/docs/sdk#registerAction" },
      { label: "registerCapability",   href: "/docs/sdk#registerCapability" },
      { label: "registerWorkflow",     href: "/docs/sdk#registerWorkflow" },
      { label: "SemanticRegistry",     href: "/docs/sdk#SemanticRegistry" },
      { label: "SemanticEventBus",     href: "/docs/sdk#SemanticEventBus" },
      { label: "evaluatePolicy",       href: "/docs/sdk#evaluatePolicy" },
      { label: "useSemanticRuntime",   href: "/docs/sdk#useSemanticRuntime" },
      { label: "useSemanticEvents",    href: "/docs/sdk#useSemanticEvents" },
    ],
  },
  {
    title: "Examples",
    items: [
      { label: "Overview",              href: "/docs/examples" },
      { label: "E-commerce",            href: "/docs/examples#ecommerce" },
      { label: "Form completion",       href: "/docs/examples#form" },
      { label: "Dashboard navigation",  href: "/docs/examples#dashboard" },
    ],
  },
];

// Pages that belong to each section (for section-header highlight)
const SECTION_PAGES: Record<string, string[]> = {
  "Getting Started": ["/docs"],
  "Protocol":        ["/docs/protocol", "/docs/events", "/docs/policy"],
  "SDK Reference":   ["/docs/sdk"],
  "Examples":        ["/docs/examples"],
};

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="w-56 shrink-0 self-start sticky top-[4.5rem] max-h-[calc(100vh-4.5rem)] overflow-y-auto border-r py-6 pr-5 max-lg:hidden xl:w-60"
      style={{ borderColor: "var(--color-border)" }}
    >
        <nav className="flex flex-col gap-6" aria-label="Documentation">
          {SECTIONS.map((section) => {
            const sectionPages = SECTION_PAGES[section.title] ?? [];
            const isSectionActive = sectionPages.includes(pathname);

            return (
              <div key={section.title}>
                <p
                  className="mb-1 px-3 text-[0.65rem] font-bold uppercase tracking-[0.16em]"
                  style={{
                    color: isSectionActive
                      ? "var(--color-text-secondary)"
                      : "var(--color-text-muted)",
                  }}
                >
                  {section.title}
                </p>
                <ul className="flex flex-col">
                  {section.items.map((item) => {
                    const isAnchor = item.href.includes("#");
                    const pagePath = item.href.split("#")[0];

                    // Active: pathname exactly matches, only possible for non-anchor items
                    // (usePathname never returns a hash, so anchor items are never "active")
                    const isActive = !isAnchor && pathname === item.href;

                    // "On current page": anchor item whose parent page is open
                    const isOnPage = isAnchor && pathname === pagePath;

                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          aria-current={isActive ? "page" : undefined}
                          className="nav-link-focus flex items-center border-l-2 py-1.5 pr-3 text-sm transition-colors duration-150"
                          style={{
                            paddingLeft: isAnchor ? "1.625rem" : "0.625rem",
                            fontSize: isAnchor ? "0.8125rem" : undefined,
                            borderLeftColor: isActive
                              ? "var(--color-accent)"
                              : "transparent",
                            color: isActive
                              ? "var(--color-accent)"
                              : isOnPage
                              ? "var(--color-text-secondary)"
                              : "var(--color-text-muted)",
                            backgroundColor: isActive
                              ? "color-mix(in srgb, var(--color-accent) 8%, transparent)"
                              : "transparent",
                            fontWeight: isActive ? 600 : 400,
                            borderRadius: "0 6px 6px 0",
                          }}
                        >
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </nav>
    </aside>
  );
}
