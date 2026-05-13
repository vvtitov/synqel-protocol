"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

const links = [
  { href: "/docs", label: "Docs" },
  { href: "/docs/protocol", label: "Protocol" },
  { href: "/docs/examples", label: "Examples" },
] as const;

const GITHUB_URL = "https://github.com/vvtitov/synqel-protocol";

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <span
      aria-hidden
      className="relative flex h-5 w-5 flex-col items-center justify-center gap-[5px]"
    >
      <span
        className="block h-px w-full rounded-full transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] origin-center"
        style={{
          backgroundColor: "var(--color-text-primary)",
          transform: open ? "translateY(6px) rotate(45deg)" : undefined,
        }}
      />
      <span
        className="block h-px rounded-full transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]"
        style={{
          backgroundColor: "var(--color-text-primary)",
          width: open ? "0%" : "100%",
          opacity: open ? 0 : 1,
        }}
      />
      <span
        className="block h-px w-full rounded-full transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] origin-center"
        style={{
          backgroundColor: "var(--color-text-primary)",
          transform: open ? "translateY(-6px) rotate(-45deg)" : undefined,
        }}
      />
    </span>
  );
}

export function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const panelId = useId();
  const headerRef = useRef<HTMLElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const obs = new ResizeObserver(() => {
      setHeaderHeight(header.getBoundingClientRect().height);
    });
    obs.observe(header);
    setHeaderHeight(header.getBoundingClientRect().height);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const close = () => setMenuOpen(false);

  return (
    <>
      <header
        ref={headerRef}
        className="sticky top-0 z-50 border-b backdrop-blur-md backdrop-saturate-150 pt-[max(0px,env(safe-area-inset-top,0px))]"
        style={{
          backgroundColor: "color-mix(in srgb, var(--color-bg) 82%, transparent)",
          borderColor: "var(--color-border)",
        }}
      >
        <nav
          className="page-gutter mx-auto flex max-w-6xl items-center justify-between gap-3 py-3"
          aria-label="Primary"
        >
          <Link
            href="/"
            className="flex min-h-11 min-w-0 shrink items-center"
            style={{ color: "var(--color-text-primary)" }}
            onClick={close}
          >
            <span className="truncate text-base font-extrabold tracking-tight sm:text-lg">
              Synqel
              <span style={{ color: "var(--color-accent)" }}>Protocol</span>
            </span>
          </Link>

          <div className="hidden items-center gap-0.5 md:flex md:gap-1 lg:gap-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="nav-link-focus nav-link-hover rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors lg:px-3.5"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {link.label}
              </Link>
            ))}
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="nav-link-focus nav-link-hover rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors lg:px-3.5"
              style={{ color: "var(--color-text-secondary)" }}
            >
              GitHub
            </a>
          </div>

          <button
            type="button"
            className="nav-link-focus relative flex size-9 shrink-0 items-center justify-center rounded-lg md:hidden"
            style={{ color: "var(--color-text-primary)" }}
            aria-expanded={menuOpen}
            aria-controls={panelId}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <HamburgerIcon open={menuOpen} />
          </button>
        </nav>
      </header>

      {/* Backdrop — fixed, z-40, outside the header so it doesn't inherit backdrop-filter */}
      <div
        aria-hidden
        className="fixed inset-0 z-40 md:hidden transition-all duration-300"
        style={{
          backgroundColor: "color-mix(in srgb, var(--color-bg) 20%, transparent)",
          backdropFilter: menuOpen ? "blur(4px)" : "none",
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "auto" : "none",
        }}
        onClick={close}
      />

      {/* Menu panel — fixed, z-50, solid background, slides in from right */}
      <div
        id={panelId}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className="fixed right-0 z-50 md:hidden"
        style={{
          top: headerHeight,
          bottom: 0,
          width: "min(320px, 85vw)",
          backgroundColor: "var(--color-bg)",
          borderLeft: "1px solid var(--color-border)",
          transform: menuOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)",
          paddingBottom: "max(1.5rem, env(safe-area-inset-bottom, 0px))",
          overflowY: "auto",
          willChange: "transform",
        }}
      >
        <ul className="flex flex-col px-4 pt-3">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="nav-link-focus group flex items-center gap-3 rounded-xl px-3 py-3.5 text-sm font-semibold transition-colors duration-150"
                style={{ color: "var(--color-text-secondary)" }}
                onClick={close}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "var(--color-text-primary)";
                  (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-bg-secondary)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "var(--color-text-secondary)";
                  (e.currentTarget as HTMLElement).style.backgroundColor = "";
                }}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div
          className="mx-4 my-2"
          style={{ height: "1px", backgroundColor: "var(--color-border)" }}
        />

        <div className="px-4 pb-2">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link-focus flex items-center gap-3 rounded-xl px-3 py-3.5 text-sm font-semibold transition-colors duration-150"
            style={{ color: "var(--color-text-secondary)" }}
            onClick={close}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = "var(--color-text-primary)";
              (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-bg-secondary)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = "var(--color-text-secondary)";
              (e.currentTarget as HTMLElement).style.backgroundColor = "";
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden
              className="shrink-0 opacity-70"
            >
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
            </svg>
            GitHub
          </a>
        </div>
      </div>
    </>
  );
}
