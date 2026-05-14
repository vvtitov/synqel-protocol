import { normalizeDocsPathname } from "@/lib/docs-nav";
import { getDocScrollAnchorOffsetPx } from "@/lib/docs-scroll-offset";

function decodeFragment(raw: string): string | null {
  try {
    return decodeURIComponent(raw);
  } catch {
    return null;
  }
}

/**
 * Scroll to `href`'s `#fragment` when it targets the **current** docs pathname.
 * Syncs `history`. Return `true` if handled (caller typically `preventDefault()`).
 */
export function focusDocsHrefFragment(pathname: string, href: string): boolean {
  const hashIdx = href.indexOf("#");
  if (hashIdx === -1) return false;

  const base = href.slice(0, hashIdx);
  const rawFragment = href.slice(hashIdx + 1);
  if (!rawFragment) return false;

  const destinationPath =
    hashIdx === 0 || base === "" ? pathname : base;

  if (
    normalizeDocsPathname(destinationPath) !== normalizeDocsPathname(pathname)
  ) {
    return false;
  }

  const id = decodeFragment(rawFragment);
  if (!id) return false;

  const el = document.getElementById(id);
  if (!el) return false;

  const offset = getDocScrollAnchorOffsetPx();
  const anchorTop = window.scrollY + el.getBoundingClientRect().top;
  window.scrollTo({
    top: Math.max(0, anchorTop - offset),
    behavior: "smooth",
  });

  try {
    history.replaceState(null, "", href);
  } catch {
    /* SSR or restricted environments — scroll still happened */
  }

  requestAnimationFrame(() => {
    window.dispatchEvent(new Event("scroll"));
  });

  return true;
}
