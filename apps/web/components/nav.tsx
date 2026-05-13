import Link from "next/link";

function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle
        cx="16"
        cy="16"
        r="14"
        stroke="currentColor"
        strokeWidth="1.25"
        opacity="0.4"
      />
      <circle cx="16" cy="10" r="2.5" fill="currentColor" />
      <circle cx="10" cy="21" r="2.5" fill="currentColor" />
      <circle cx="22" cy="21" r="2.5" fill="currentColor" />
      <path
        d="M16 12.5v4M14 18l-3 1.5M18 18l3 1.5"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        opacity="0.95"
      />
    </svg>
  );
}

const links = [
  { href: "/docs", label: "Docs" },
  { href: "/docs/protocol", label: "Protocol" },
  { href: "/docs/examples", label: "Examples" },
] as const;

export function Nav() {
  return (
    <header
      className="sticky top-0 z-50 border-b backdrop-blur-md backdrop-saturate-150"
      style={{
        backgroundColor:
          "color-mix(in srgb, var(--color-bg) 82%, transparent)",
        borderColor: "var(--color-border)",
      }}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-2.5 text-lg font-extrabold tracking-tight"
          style={{ color: "var(--color-text-primary)" }}
        >
          <span
            className="flex size-9 items-center justify-center rounded-lg border transition-[border-color,box-shadow] group-hover:border-[var(--color-border-hover)]"
            style={{
              borderColor: "var(--color-border)",
              color: "var(--color-accent)",
              backgroundColor: "var(--color-bg-secondary)",
              boxShadow: "0 0 0 1px var(--card-shine) inset",
            }}
          >
            <LogoMark className="size-5" />
          </span>
          <span>
            Synqel
            <span style={{ color: "var(--color-accent)" }}>Protocol</span>
          </span>
        </Link>

        <div className="flex min-w-0 items-center gap-1 overflow-x-auto pb-0.5 sm:gap-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="nav-link-hover shrink-0 rounded-lg px-3 py-2 text-sm font-semibold transition-colors"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://github.com/vvtitov/synqel-protocol"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link-hover shrink-0 rounded-lg px-3 py-2 text-sm font-semibold transition-colors"
            style={{ color: "var(--color-text-secondary)" }}
          >
            GitHub
          </a>
        </div>
      </nav>
    </header>
  );
}
