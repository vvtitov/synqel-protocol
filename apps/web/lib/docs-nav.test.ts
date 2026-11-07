import { describe, expect, it } from "vitest";
import { DOC_PAGES, headingIds, readDoc } from "./docs-content";
import { DOC_NAV_SECTIONS } from "./docs-nav";

const navItems = DOC_NAV_SECTIONS.flatMap((section) => section.items);

function slugFor(path: string): string {
  return path.replace(/^\/docs\/?/, "");
}

describe("docs navigation", () => {
  it("links only to pages backed by a docs/*.md file", () => {
    for (const item of navItems) {
      const path = item.href.split("#")[0];
      expect(Object.keys(DOC_PAGES), item.href).toContain(slugFor(path));
    }
  });

  it.each(navItems.filter((item) => item.href.includes("#")).map((item) => [item.href]))(
    "%s points to a heading in the markdown",
    (href) => {
      const [path, hash] = href.split("#");
      const ids = headingIds(readDoc(slugFor(path))).map((heading) => heading.id);
      expect(ids).toContain(hash);
    },
  );
});
