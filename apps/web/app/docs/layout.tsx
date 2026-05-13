import { Sidebar } from "@/components/sidebar";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex max-w-6xl px-4 sm:px-6">
      <Sidebar />
      <main className="min-w-0 flex-1 py-8 lg:pl-8">{children}</main>
    </div>
  );
}
