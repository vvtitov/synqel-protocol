import type { Metadata } from "next";
import { Markdown } from "@/components/markdown";
import { extractTitle, readDoc, type DocSlug } from "@/lib/docs-content";

/** Page metadata for a docs route, titled from the markdown's `# H1`. */
export function docMetadata(slug: DocSlug): Metadata {
  const title = extractTitle(readDoc(slug));
  return { title: title ? `${title} · Synqel Protocol` : "Synqel Protocol docs" };
}

/** Renders `docs/<file>.md` for a docs route. The markdown is the single source of truth. */
export function DocPage({ slug }: { slug: DocSlug }) {
  return (
    <article className="max-w-3xl">
      <Markdown source={readDoc(slug)} />
    </article>
  );
}
