import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/nav";

export const metadata: Metadata = {
  title: "Synqel Protocol — The open standard for AI-navigable web applications",
  description:
    "Synqel Protocol defines how any web app describes itself to an AI — entities, actions, workflows, and events as a semantic contract.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <Nav />
        {children}
      </body>
    </html>
  );
}
