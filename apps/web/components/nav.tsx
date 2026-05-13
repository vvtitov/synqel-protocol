"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";

function MenuIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        aria-hidden
      >
        <path d="M6 6l12 12M18 6L6 18" />
      </svg>
    );
  }
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

const links = [
  { href: "/docs", label: "Docs" },
  { href: "/docs/protocol", label: "Protocol" },
  { href: "/docs/examples", label: "Examples" },
] as const;

export function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    if (!menuOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className="sticky top-0 z-50 border-b backdrop-blur-md backdrop-saturate-150 pt-[max(0px,env(safe-area-inset-top,0px))]"
      style={{
        backgroundColor:
          "color-mix(in srgb, var(--color-bg) 82%, transparent)",
        borderColor: "var(--color-border)",
      }}
    >
      {menuOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 cursor-pointer bg-[color-mix(in_srgb,var(--color-text-primary)_24%,transparent)] md:hidden"
          aria-label="Close menu"
          tabIndex={-1}
          onClick={() => setMenuOpen(false)}
        />
      ) : null}
      <nav
        className="page-gutter relative z-50 mx-auto flex max-w-6xl items-center justify-between gap-3 py-3"
        aria-label="Primary"
      >
        <Link
          href="/"
          className="flex min-h-11 min-w-0 shrink items-center"
          style={{ color: "var(--color-text-primary)" }}
          onClick={() => setMenuOpen(false)}
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
            href="https://github.com/vvtitov/synqel-protocol"
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
          className="nav-link-focus flex size-11 shrink-0 items-center justify-center rounded-lg border md:hidden"
          style={{
            borderColor: "var(--color-border)",
            color: "var(--color-text-primary)",
            backgroundColor: "var(--color-bg-secondary)",
          }}
          aria-expanded={menuOpen}
          aria-controls={menuOpen ? panelId : undefined}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <MenuIcon open={menuOpen} />
          <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
        </button>
      </nav>

      {menuOpen ? (
        <div
          id={panelId}
          className="page-gutter relative z-50 border-t pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] md:hidden"
          style={{
            borderColor: "var(--color-border)",
            backgroundColor: "var(--color-bg)",
          }}
        >
          <ul className="mx-auto max-w-6xl py-1">
            {links.map((link, index) => (
              <li
                key={link.href}
                className={index > 0 ? "border-t" : ""}
                style={{ borderColor: "var(--color-border)" }}
              >
                <Link
                  href={link.href}
                  className="nav-link-focus flex min-h-12 items-center py-3.5 text-base font-semibold"
                  style={{ color: "var(--color-text-primary)" }}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li
              className="border-t"
              style={{ borderColor: "var(--color-border)" }}
            >
              <a
                href="https://github.com/vvtitov/synqel-protocol"
                target="_blank"
                rel="noopener noreferrer"
                className="nav-link-focus flex min-h-12 items-center py-3.5 text-base font-semibold"
                style={{ color: "var(--color-text-primary)" }}
                onClick={() => setMenuOpen(false)}
              >
                GitHub
              </a>
            </li>
          </ul>
        </div>
      ) : null}
    </header>
  );
}
