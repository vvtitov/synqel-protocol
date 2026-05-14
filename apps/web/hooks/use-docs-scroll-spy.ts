"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect, useMemo, useState } from "react";
import {
  getDocsScrollSpyTargets,
  type DocsScrollSpyTarget,
} from "@/lib/docs-nav";

/** Viewport offset from top (sticky header + padding). Aligns with ~5rem scroll-margin on headings. */
const HEADER_OFFSET_PX = 88;

function computeActiveHref(targets: DocsScrollSpyTarget[]): string | null {
  if (typeof document === "undefined" || targets.length === 0) return null;

  const firstKeyed = targets.find((t) => t.id !== null);
  if (!firstKeyed?.id) {
    return targets[0]?.href ?? null;
  }

  let active = targets[0]?.href ?? null;

  for (const item of targets) {
    if (item.id === null) continue;
    const el = document.getElementById(item.id);
    if (!el) continue;
    if (el.getBoundingClientRect().top <= HEADER_OFFSET_PX) {
      active = item.href;
    }
  }

  const firstEl = document.getElementById(firstKeyed.id);
  if (firstEl && firstEl.getBoundingClientRect().top > HEADER_OFFSET_PX) {
    active = targets[0]?.href ?? null;
  }

  return active;
}

/**
 * Returns the sidebar `href` that should appear active while scrolling the current docs page.
 */
export function useDocsScrollSpyActiveHref(): string | null {
  const pathname = usePathname();
  const targets = useMemo(
    () => getDocsScrollSpyTargets(pathname),
    [pathname],
  );

  const [activeHref, setActiveHref] = useState<string | null>(() =>
    targets.length ? targets[0].href : null,
  );

  useLayoutEffect(() => {
    if (targets.length === 0) {
      setActiveHref(null);
      return;
    }

    let frame = 0;

    const apply = () => {
      const next = computeActiveHref(targets);
      setActiveHref((prev) => (prev === next ? prev : next));
    };

    const schedule = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        frame = 0;
        apply();
      });
    };

    apply();

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    const main = document.getElementById("main-content");
    const ro = main ? new ResizeObserver(schedule) : null;
    if (main) ro?.observe(main);

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      ro?.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [targets]);

  return activeHref;
}
