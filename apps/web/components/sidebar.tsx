"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDocsScrollSpyActiveHref } from "@/hooks/use-docs-scroll-spy";
import { focusDocsHrefFragment } from "@/lib/docs-in-page-hash";
import {
  DOC_NAV_SECTIONS,
  DOC_SECTION_PAGES,
  docPageMatchesPathname,
} from "@/lib/docs-nav";

export function Sidebar() {
  const pathname = usePathname();
  const scrollActiveHref = useDocsScrollSpyActiveHref();

  return (
    <aside
      className="w-56 shrink-0 self-start sticky top-[4.5rem] max-h-[calc(100vh-4.5rem)] overflow-y-auto border-r py-6 pr-5 max-lg:hidden xl:w-60"
      style={{ borderColor: "var(--color-border)" }}
    >
      <nav className="flex flex-col gap-6" aria-label="Documentation">
        {DOC_NAV_SECTIONS.map((section) => {
          const sectionPages = DOC_SECTION_PAGES[section.title] ?? [];
          const isSectionActive = sectionPages.some((p) =>
            docPageMatchesPathname(p, pathname),
          );

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
                  const pagePath = item.href.split("#")[0] ?? item.href;

                  const isOnDocPage = docPageMatchesPathname(pagePath, pathname);
                  const isScrollActive =
                    isOnDocPage &&
                    scrollActiveHref !== null &&
                    scrollActiveHref === item.href;

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={(e) => {
                          if (
                            e.button !== 0 ||
                            e.metaKey ||
                            e.ctrlKey ||
                            e.shiftKey ||
                            e.altKey
                          ) {
                            return;
                          }
                          if (focusDocsHrefFragment(pathname, item.href)) {
                            e.preventDefault();
                          }
                        }}
                        aria-current={
                          isScrollActive && isOnDocPage ? "location" : undefined
                        }
                        className="nav-link-focus flex items-center border-l-2 py-1.5 pr-3 text-sm transition-colors duration-150"
                        style={{
                          paddingLeft: isAnchor ? "1.625rem" : "0.625rem",
                          fontSize: isAnchor ? "0.8125rem" : undefined,
                          borderLeftColor: isScrollActive
                            ? "var(--color-accent)"
                            : "transparent",
                          color: isScrollActive
                            ? "var(--color-accent)"
                            : isOnDocPage
                              ? "var(--color-text-secondary)"
                              : "var(--color-text-muted)",
                          backgroundColor: isScrollActive
                            ? "color-mix(in srgb, var(--color-accent) 8%, transparent)"
                            : "transparent",
                          fontWeight: isScrollActive ? 600 : 400,
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
