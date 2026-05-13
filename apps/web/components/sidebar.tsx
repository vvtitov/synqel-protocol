"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type SidebarSection = {
  title: string;
  items: Array<{ label: string; href: string }>;
};

const SECTIONS: SidebarSection[] = [
  {
    title: "Getting Started",
    items: [
      { label: "Overview", href: "/docs" },
      { label: "Installation", href: "/docs#installation" },
      { label: "Quick Start", href: "/docs#quick-start" },
    ],
  },
  {
    title: "Protocol Spec",
    items: [
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
      { label: "E-commerce", href: "/docs/examples#ecommerce" },
      { label: "Form completion", href: "/docs/examples#form" },
      { label: "Dashboard navigation", href: "/docs/examples#dashboard" },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 overflow-y-auto border-r py-6 pr-6 max-lg:hidden" style={{ borderColor: "var(--color-border)" }}>
      <nav className="flex flex-col gap-6">
        {SECTIONS.map((section) => (
          <div key={section.title}>
            <h3
              className="mb-2 text-xs font-semibold uppercase tracking-wider"
              style={{ color: "var(--color-text-muted)" }}
            >
              {section.title}
            </h3>
            <ul className="flex flex-col gap-1">
              {section.items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/docs" && pathname === item.href.split("#")[0]);

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="block rounded-md px-3 py-1.5 text-sm transition-colors"
                      style={{
                        color: isActive
                          ? "var(--color-accent)"
                          : "var(--color-text-secondary)",
                        backgroundColor: isActive
                          ? "var(--color-bg-secondary)"
                          : "transparent",
                      }}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
