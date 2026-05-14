import { DocsHashScroller } from "@/components/docs-hash-scroller";
import { DocsMobileNav } from "@/components/docs-mobile-nav";
import { Sidebar } from "@/components/sidebar";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="page-gutter mx-auto flex max-w-6xl items-start">
      <DocsHashScroller />
      <Sidebar />
      <main
        id="main-content"
        tabIndex={-1}
        className="min-w-0 flex-1 pt-7 outline-none sm:pt-9 lg:border-l lg:pl-10"
        style={{
          borderColor: "var(--color-border)",
          paddingBottom:
            "max(14rem, calc(100svh - var(--doc-scroll-margin, 4.5rem)))",
        }}
      >
        <DocsMobileNav />
        {children}
      </main>
    </div>
  );
}
