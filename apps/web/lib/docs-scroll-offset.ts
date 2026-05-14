/** Sticky navbar publishes `--doc-scroll-margin` from measured height (`Nav`). */

function rootRemFallbackPx(): number {
  const fs = Number.parseFloat(
    getComputedStyle(document.documentElement).fontSize || "16",
  );
  /* Matches sidebar sticky `top-[4.5rem]` until the nav has measured itself. */
  return (Number.isFinite(fs) ? fs : 16) * 4.5;
}

/**
 * Anchor offset for scroll-spy thresholds and programmatic scroll —
 * aligns with `[id]{ scroll-margin-top: var(--doc-scroll-margin, …) }`.
 */
export function getDocScrollAnchorOffsetPx(): number {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue("--doc-scroll-margin")
    .trim();

  if (raw.endsWith("px")) {
    const px = Number.parseFloat(raw);
    return Number.isFinite(px) ? px : rootRemFallbackPx();
  }

  return rootRemFallbackPx();
}
