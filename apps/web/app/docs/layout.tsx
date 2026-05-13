import { Sidebar } from "@/components/sidebar";
import { DocsMobileNav } from "@/components/docs-mobile-nav";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="page-gutter mx-auto flex max-w-6xl items-start">
      <Sidebar />
      <main
        id="main-content"
        tabIndex={-1}
        className="min-w-0 flex-1 scroll-mt-20 py-7 outline-none sm:py-9 lg:border-l lg:pl-10"
        style={{ borderColor: "var(--color-border)" }}
      >
        <DocsMobileNav />
        {children}
      </main>
    </div>
  );
}
