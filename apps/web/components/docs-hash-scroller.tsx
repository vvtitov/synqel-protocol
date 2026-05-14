"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { getDocScrollAnchorOffsetPx } from "@/lib/docs-scroll-offset";

/** After route change, honour `#fragment` so cross-page TOC links scroll into view. */
export function DocsHashScroller() {
  const pathname = usePathname();

  useEffect(() => {
    let id = "";
    try {
      id = decodeURIComponent(location.hash.slice(1));
    } catch {
      return;
    }
    if (!id) return;

    const run = () => {
      const el = document.getElementById(id);
      if (!el) return;
      const offset = getDocScrollAnchorOffsetPx();
      const anchorTop = window.scrollY + el.getBoundingClientRect().top;
      window.scrollTo({
        top: Math.max(0, anchorTop - offset),
        behavior: "smooth",
      });
    };

    const frame = requestAnimationFrame(run);
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return null;
}
