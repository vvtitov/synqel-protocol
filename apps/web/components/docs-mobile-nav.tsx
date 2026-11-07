"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

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
  const activeRef = useRef<HTMLAnchorElement>(null);

  // Keep the current section visible when the tab strip is wider than the screen.
  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "nearest", inline: "center" });
  }, [pathname]);

  return (
    <div
      className="mb-7 lg:hidden"
      style={{ borderBottom: "1px solid var(--color-border)" }}
    >
      <nav
        aria-label="Documentation sections"
        className="-mx-4 flex gap-1 overflow-x-auto pl-4 pr-10 pb-4 [scrollbar-width:none] [-webkit-overflow-scrolling:touch] [mask-image:linear-gradient(to_right,transparent,#000_1rem,#000_calc(100%-2rem),transparent)] sm:-mx-6 sm:pl-6 sm:pr-12 [&::-webkit-scrollbar]:hidden"
      >
        {ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              ref={isActive ? activeRef : undefined}
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
    </div>
  );
}
