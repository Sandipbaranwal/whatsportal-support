"use client";

import { useId, useState } from "react";

import { cn } from "@/lib/utils";
import { isValidPhone } from "@/lib/widget-theme";

/**
 * Asks the visitor for their own WhatsApp number before their first message.
 *
 * Once given it collapses to a single line, so the strip above the composer
 * costs a row rather than a permanent form.
 */
export function VisitorPhoneField({ value, onChange, inputRef }) {
  const id = useId();
  const [draft, setDraft] = useState(value);
  const [isEditing, setIsEditing] = useState(!value);
  const canSave = isValidPhone(draft);

  if (!isEditing) {
    return (
      <div className="flex shrink-0 items-center justify-between gap-3 border-t border-[var(--wp-border)] bg-[var(--wp-panel-bg)] px-3.5 py-2">
        <p className="min-w-0 truncate text-xs text-[var(--wp-panel-muted)]">
          Your number:{" "}
          <span className="font-medium text-[var(--wp-panel-fg)]">{value}</span>
        </p>
        <button
          type="button"
          onClick={() => {
            setDraft(value);
            setIsEditing(true);
          }}
          className="shrink-0 rounded-md text-xs font-medium text-[var(--wp-launcher-bg)] underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--wp-launcher-bg)]"
        >
          Change
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (!canSave) return;
        onChange(draft.trim());
        setIsEditing(false);
      }}
      className="shrink-0 border-t border-[var(--wp-border)] bg-[var(--wp-panel-bg)] px-3.5 pb-2.5 pt-3"
    >
      <label
        htmlFor={id}
        className="block text-xs font-medium text-[var(--wp-panel-fg)]"
      >
        Your WhatsApp number
      </label>

      <div className="mt-1.5 flex items-center gap-2">
        <input
          id={id}
          ref={inputRef}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          maxLength={32}
          value={draft}
          placeholder="+91 98765 43210"
          onChange={(event) => setDraft(event.target.value)}
          className={cn(
            "min-w-0 flex-1 rounded-xl border border-[var(--wp-border)] bg-[var(--wp-input-bg)] px-3 py-2",
            "text-sm text-[var(--wp-input-fg)] placeholder:text-[var(--wp-panel-muted)]",
            "transition-colors focus-visible:border-[var(--wp-launcher-bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--wp-launcher-bg)]",
          )}
        />

        <button
          type="submit"
          disabled={!canSave}
          className={cn(
            "shrink-0 rounded-xl px-3.5 py-2 text-sm font-medium",
            "bg-[var(--wp-launcher-bg)] text-[var(--wp-launcher-icon)]",
            "transition-[background-color,opacity] hover:bg-[var(--wp-launcher-bg-hover)]",
            "disabled:pointer-events-none disabled:opacity-40",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--wp-launcher-bg)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--wp-panel-bg)]",
          )}
        >
          Save
        </button>
      </div>

      <p className="mt-1.5 text-[11px] leading-relaxed text-[var(--wp-panel-muted)]">
        So we can reply on WhatsApp. Include your country code.
      </p>
    </form>
  );
}
