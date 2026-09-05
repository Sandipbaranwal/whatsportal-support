"use client";

import { useState } from "react";

import { importTheme } from "@/lib/theme-store";
import { cn } from "@/lib/utils";

const buttonClass = cn(
  "rounded-lg border border-border px-3.5 py-2 text-xs font-medium wp-touch:py-2.5",
  "transition-colors hover:bg-muted",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
);

/**
 * Moves a theme between browsers.
 *
 * Until there's a config endpoint, `localStorage` is the only home a theme has
 * — which means it lives in exactly one browser. Copy and paste is the bridge.
 */
export function ThemeTransfer({ theme }) {
  const [isImporting, setIsImporting] = useState(false);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const json = JSON.stringify(theme, null, 2);
  const sizeKb = Math.round(new Blob([json]).size / 1024);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(json);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Couldn't reach the clipboard — copy from the box below.");
      setDraft(json);
      setIsImporting(true);
    }
  };

  const apply = () => {
    const failure = importTheme(draft);
    setError(failure);
    if (!failure) {
      setIsImporting(false);
      setDraft("");
    }
  };

  return (
    <div>
      <p className="text-sm font-medium">Move this config</p>
      <p className="mt-1 text-xs text-muted-foreground">
        Settings live in this browser only. Copy the JSON to carry them
        elsewhere{sizeKb >= 1 ? ` (~${sizeKb} KB with the logo)` : ""}.
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={copy} className={buttonClass}>
          {copied ? "Copied" : "Copy JSON"}
        </button>
        <button
          type="button"
          onClick={() => {
            setIsImporting((wasOpen) => !wasOpen);
            setError(null);
          }}
          aria-expanded={isImporting}
          className={buttonClass}
        >
          {isImporting ? "Cancel" : "Paste JSON"}
        </button>
      </div>

      {isImporting ? (
        <div className="mt-3">
          <label htmlFor="wp-theme-import" className="sr-only">
            Theme JSON
          </label>
          <textarea
            id="wp-theme-import"
            rows={6}
            value={draft}
            spellCheck={false}
            placeholder='{ "title": "…", "launcherBg": "#008231" }'
            onChange={(event) => setDraft(event.target.value)}
            className={cn(
              "wp-thin-scrollbar w-full resize-y rounded-lg border border-border bg-background px-3 py-2 font-mono text-xs",
              "transition-colors focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            )}
          />
          <button
            type="button"
            onClick={apply}
            disabled={!draft.trim()}
            className={cn(
              "mt-2 rounded-lg bg-primary px-3.5 py-2 text-xs font-medium text-primary-foreground",
              "transition-colors hover:bg-primary-hover",
              "disabled:pointer-events-none disabled:opacity-40",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            )}
          >
            Apply
          </button>
        </div>
      ) : null}

      {error ? (
        <p role="alert" className="mt-2 text-xs text-red-500">
          {error}
        </p>
      ) : null}
    </div>
  );
}
