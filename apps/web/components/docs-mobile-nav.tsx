"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/docs",          label: "Overview" },
  { href: "/docs/protocol", label: "Protocol" },
  { href: "/docs/sdk",      label: "SDK" },
  { href: "/docs/examples", label: "Examples" },
  { href: "/docs/events",   label: "Events" },
  { href: "/docs/policy",   label: "Policy" },
] as const;

export function DocsMobileNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Documentation sections"
      className="mb-7 flex gap-1 overflow-x-auto pb-4 [-webkit-overflow-scrolling:touch] lg:hidden"
      style={{ borderBottom: "1px solid var(--color-border)" }}
    >
      {ITEMS.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className="flex shrink-0 min-h-9 items-center rounded-lg px-3 py-1.5 text-sm font-semibold whitespace-nowrap transition-colors duration-150"
            style={
              isActive
                ? {
                    color: "var(--color-accent)",
                    backgroundColor:
                      "color-mix(in srgb, var(--color-accent) 10%, transparent)",
                  }
                : {
                    color: "var(--color-text-muted)",
                  }
            }
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
