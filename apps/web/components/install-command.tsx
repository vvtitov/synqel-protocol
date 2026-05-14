"use client";

import { useState } from "react";

const PACKAGE_MANAGERS = {
  bun: "bun add @synqel/sdk zod",
  npm: "npm install @synqel/sdk zod",
  pnpm: "pnpm add @synqel/sdk zod",
  yarn: "yarn add @synqel/sdk zod",
} as const;

type PM = keyof typeof PACKAGE_MANAGERS;

function ClipboardIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="4.5" y="2.5" width="8" height="10" rx="1.25" />
      <path d="M4.5 4.5H3A1.25 1.25 0 0 0 1.75 5.75v7A1.25 1.25 0 0 0 3 14h5.25A1.25 1.25 0 0 0 9.5 12.75V11" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M2.5 7l3.5 3.5 5.5-6.5" />
    </svg>
  );
}

export function InstallCommand() {
  const [pm, setPm] = useState<PM>("bun");
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(PACKAGE_MANAGERS[pm]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  }

  return (
    <div
      className="overflow-hidden rounded-xl border"
      style={{
        borderColor: "var(--color-border)",
        backgroundColor: "var(--color-code-bg)",
        boxShadow: "0 0 0 1px var(--card-shine) inset",
      }}
    >
      {/* Package manager tabs */}
      <div
        className="flex items-center gap-0.5 border-b px-2 py-2"
        style={{ borderColor: "var(--color-border)" }}
      >
        {(Object.keys(PACKAGE_MANAGERS) as PM[]).map((key) => {
          const active = pm === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setPm(key)}
              className="rounded-md px-3 py-1.5 text-[0.72rem] font-semibold tracking-wide transition-colors duration-150"
              style={
                active
                  ? {
                      backgroundColor:
                        "color-mix(in srgb, var(--color-accent) 16%, transparent)",
                      color: "var(--color-accent)",
                    }
                  : {
                      color: "var(--color-text-muted)",
                    }
              }
            >
              {key}
            </button>
          );
        })}
      </div>

      {/* Command line */}
      <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-5 sm:py-5">
        <div className="flex min-w-0 items-center gap-3 overflow-hidden font-mono text-sm sm:text-base">
          <span
            className="shrink-0 select-none font-bold"
            style={{ color: "var(--color-accent)" }}
            aria-hidden
          >
            $
          </span>
          <code
            className="min-w-0 truncate"
            style={{ color: "var(--color-text-primary)" }}
          >
            {PACKAGE_MANAGERS[pm]}
          </code>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? "Copied to clipboard" : "Copy command to clipboard"}
          className="flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition-all duration-200"
          style={
            copied
              ? {
                  borderColor:
                    "color-mix(in srgb, var(--color-success) 40%, transparent)",
                  color: "var(--color-success)",
                  backgroundColor:
                    "color-mix(in srgb, var(--color-success) 10%, transparent)",
                }
              : {
                  borderColor: "var(--color-border)",
                  color: "var(--color-text-secondary)",
                  backgroundColor:
                    "color-mix(in srgb, var(--color-bg-secondary) 80%, transparent)",
                }
          }
        >
          {copied ? <CheckIcon /> : <ClipboardIcon />}
          <span>{copied ? "Copied!" : "Copy"}</span>
        </button>
      </div>
    </div>
  );
}
