"use client";

import { useState } from "react";

export function CodeBlock({
  code,
  language = "typescript",
  title,
}: {
  code: string;
  language?: string;
  title?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      className="overflow-hidden rounded-lg border"
      style={{
        borderColor: "var(--color-border)",
        backgroundColor: "var(--color-code-bg)",
      }}
    >
      <div
        className="flex flex-wrap items-center justify-between gap-2 border-b px-3 py-2.5 sm:px-4 sm:py-3"
        style={{
          borderColor: "var(--color-border)",
          color: "var(--color-text-muted)",
        }}
      >
        <span className="min-w-0 flex-1 text-xs font-medium sm:text-sm">
          {title ?? "\u00a0"}
        </span>
        <div className="flex shrink-0 items-center gap-2">
          <span
            className="rounded px-2 py-1 text-[0.65rem] font-medium uppercase sm:text-xs"
            style={{ backgroundColor: "var(--color-bg-tertiary)" }}
          >
            {language}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="rounded-md border px-3 py-2 text-xs font-semibold transition-opacity hover:opacity-90 sm:min-h-10 sm:px-3.5"
            style={{
              borderColor: "var(--color-border)",
              color: "var(--color-text-secondary)",
              backgroundColor: "var(--color-bg-secondary)",
            }}
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>
      <pre className="overflow-x-auto overscroll-x-contain p-3 text-xs leading-relaxed [-webkit-overflow-scrolling:touch] sm:p-4 sm:text-sm">
        <code
          className={`language-${language} block whitespace-pre font-mono`}
          style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-mono), ui-monospace, monospace" }}
        >
          {code}
        </code>
      </pre>
    </div>
  );
}
