import Link from "next/link";

export function Nav() {
  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{
        backgroundColor: "var(--color-bg)",
        borderColor: "var(--color-border)",
      }}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="text-lg font-bold tracking-tight"
          style={{ color: "var(--color-text-primary)" }}
        >
          Synqel<span style={{ color: "var(--color-accent)" }}>Protocol</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/docs"
            className="text-sm font-medium transition-colors hover:opacity-80"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Docs
          </Link>
          <Link
            href="/docs/protocol"
            className="text-sm font-medium transition-colors hover:opacity-80"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Protocol
          </Link>
          <Link
            href="/docs/examples"
            className="text-sm font-medium transition-colors hover:opacity-80"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Examples
          </Link>
          <a
            href="https://github.com/vvtitov/synqel-protocol"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium transition-colors hover:opacity-80"
            style={{ color: "var(--color-text-secondary)" }}
          >
            GitHub
          </a>
        </div>
      </nav>
    </header>
  );
}
