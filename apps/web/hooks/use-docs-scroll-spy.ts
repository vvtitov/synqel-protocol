"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect, useMemo, useState } from "react";
import {
  getDocsScrollSpyTargets,
  type DocsScrollSpyTarget,
} from "@/lib/docs-nav";
import { getDocScrollAnchorOffsetPx } from "@/lib/docs-scroll-offset";

/** Subpixel/layout tolerance vs sticky header measurement */
const EDGE_EPS_PX = 1;

function computeActiveHref(targets: DocsScrollSpyTarget[]): string | null {
  if (typeof document === "undefined" || targets.length === 0) return null;

  const cutoff = getDocScrollAnchorOffsetPx() + EDGE_EPS_PX;

  const keyed = targets.filter(
    (t): t is DocsScrollSpyTarget & { id: string } => t.id !== null,
  );

  if (keyed.length === 0) {
    return targets[0]?.href ?? null;
  }

  let active = targets[0]?.href ?? null;

  for (const item of keyed) {
    const el = document.getElementById(item.id);
    if (!el) continue;
    if (el.getBoundingClientRect().top <= cutoff) {
      active = item.href;
    }
  }

  const firstKeyed = keyed[0];
  const firstEl = document.getElementById(firstKeyed?.id ?? "");
  if (
    firstKeyed &&
    firstEl &&
    firstEl.getBoundingClientRect().top > cutoff
  ) {
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

    /** `hashchange` / `popstate` */
    const onHashAnchor = () => schedule();

    apply();

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("hashchange", onHashAnchor);
    window.addEventListener("popstate", onHashAnchor);
    window.addEventListener("synqel:doc-scroll-anchor", schedule);
    /** Final highlight after inertia / smooth-scroll (Chromium baseline; ignores unsupported browsers). */
    window.addEventListener("scrollend", schedule);

    const main = document.getElementById("main-content");
    const ro = main ? new ResizeObserver(schedule) : null;
    if (main) ro?.observe(main);

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("hashchange", onHashAnchor);
      window.removeEventListener("popstate", onHashAnchor);
      window.removeEventListener("synqel:doc-scroll-anchor", schedule);
      window.removeEventListener("scrollend", schedule);
      ro?.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [targets, pathname]);

  return activeHref;
}
