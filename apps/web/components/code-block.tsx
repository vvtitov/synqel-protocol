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
      {title && (
        <div
          className="flex items-center justify-between border-b px-4 py-2 text-xs"
          style={{
            borderColor: "var(--color-border)",
            color: "var(--color-text-muted)",
          }}
        >
          <span>{title}</span>
          <span
            className="rounded px-2 py-0.5"
            style={{ backgroundColor: "var(--color-bg-tertiary)" }}
          >
            {language}
          </span>
        </div>
      )}
      <div className="relative">
        <button
          onClick={handleCopy}
          className="absolute right-3 top-3 rounded-md border px-2 py-1 text-xs transition-colors hover:opacity-80"
          style={{
            borderColor: "var(--color-border)",
            color: "var(--color-text-muted)",
            backgroundColor: "var(--color-bg-secondary)",
          }}
        >
          {copied ? "Copied!" : "Copy"}
        </button>
        <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
          <code
            className={`language-${language}`}
            style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-mono)" }}
          >
            {code}
          </code>
        </pre>
      </div>
    </div>
  );
}
