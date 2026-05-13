import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/nav";

const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const BASE_URL = "https://synqel.dev";

export const metadata: Metadata = {
  title: "Synqel Protocol — The open standard for AI-navigable web applications",
  description:
    "Synqel Protocol defines how any web app describes itself to an AI — entities, actions, workflows, and events as a semantic contract.",
  metadataBase: new URL(BASE_URL),
  openGraph: {
    title: "Synqel Protocol — The open standard for AI-navigable web applications",
    description:
      "Synqel Protocol defines how any web app describes itself to an AI — entities, actions, workflows, and events as a semantic contract.",
    url: BASE_URL,
    siteName: "Synqel Protocol",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Synqel Protocol — The open standard for AI-navigable web applications",
    description:
      "Synqel Protocol defines how any web app describes itself to an AI — entities, actions, workflows, and events as a semantic contract.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fontSans.variable} ${fontMono.variable}`}>
      <body className="relative min-h-screen antialiased">
        <a href="#main-content" className="skip-to-main">
          Skip to content
        </a>
        <Nav />
        {children}
      </body>
    </html>
  );
}
