"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import {
  failingContrast,
  MAX_OFFSET,
  THEME_FIELDS,
  THEME_GROUPS,
} from "@/lib/widget-theme";
import { SegmentedField } from "./segmented-field";

/**
 * Every surface, one control each — the escape hatch behind the four fields on
 * the form.
 *
 * A right-hand drawer rather than an inline section: these twelve controls are
 * for fine-tuning against the preview, so they need to sit beside it without
 * pushing the page around.
 */
export function AdvancedPanel({ theme, onChange, onClose }) {
  const panelRef = useRef(null);

  // Escape closes, and focus moves in so the drawer is usable from the keyboard.
  useEffect(() => {
    panelRef.current?.focus();

    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <>
      <button
        type="button"
        aria-label="Close advanced settings"
        onClick={onClose}
        className="fixed inset-0 z-40 animate-fade-in bg-black/40 focus-visible:outline-none"
      />

      <aside
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="wp-advanced-title"
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-full max-w-sm animate-drawer-in flex-col",
          "border-l border-border bg-card shadow-2xl shadow-black/30",
          "focus-visible:outline-none",
        )}
      >
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-border px-5 py-4">
          <div>
            <h2 id="wp-advanced-title" className="text-sm font-semibold tracking-tight">
              Advanced
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Every surface, set individually.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close advanced settings"
            className="-mr-1 shrink-0 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <CloseGlyph />
          </button>
        </header>

        <div className="wp-thin-scrollbar min-h-0 flex-1 space-y-6 overflow-y-auto px-5 py-5">
          <ContrastReport theme={theme} />

          <section>
            <h3 className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Placement
            </h3>
            <div className="space-y-3">
              <SegmentedField
                label="Side"
                value={theme.side}
                options={[
                  { value: "left", label: "Left" },
                  { value: "right", label: "Right" },
                ]}
                onChange={(value) => onChange("side", value)}
              />
              <NumberField
                label="Distance from side"
                value={theme.offsetX}
                onChange={(value) => onChange("offsetX", value)}
              />
              <NumberField
                label="Distance from bottom"
                value={theme.offsetY}
                onChange={(value) => onChange("offsetY", value)}
              />
            </div>
          </section>

          {THEME_GROUPS.map((group) => {
            const fields = THEME_FIELDS.filter((f) => f.group === group);
            if (!fields.length) return null;

            return (
              <section key={group}>
                <h3 className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {group}
                </h3>
                <div className="space-y-2.5">
                  {fields.map((field) => (
                    <AdvancedField
                      key={field.key}
                      field={field}
                      value={theme[field.key]}
                      onChange={(value) => onChange(field.key, value)}
                    />
                  ))}
                </div>
              </section>
            );
          })}

          <p className="rounded-lg bg-muted/60 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
            Heads up: picking a brand colour on the form rewrites the launcher
            and header values below.
          </p>
        </div>
      </aside>
    </>
  );
}

/** Flags any pair a reader would struggle with, using the WCAG AA floors. */
function ContrastReport({ theme }) {
  const failing = failingContrast(theme);
  if (!failing.length) return null;

  return (
    <div
      role="status"
      className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2.5"
    >
      <p className="text-xs font-medium text-amber-700 dark:text-amber-300">
        {failing.length === 1
          ? "1 pair is hard to read"
          : `${failing.length} pairs are hard to read`}
      </p>
      <ul className="mt-1.5 space-y-1">
        {failing.map((pair) => (
          <li
            key={pair.fg}
            className="flex items-baseline justify-between gap-3 text-[11px] text-amber-700/90 dark:text-amber-300/90"
          >
            <span>{pair.label}</span>
            <span className="shrink-0 font-mono">
              {pair.ratio.toFixed(1)}:1 &lt; {pair.min}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function NumberField({ label, value, min = 0, max = MAX_OFFSET, onChange }) {
  const inputId = `wp-advanced-${label.replace(/\s+/g, "-").toLowerCase()}`;

  // The draft owns the box while it has focus.
  //
  // The theme rounds and clamps whatever it is handed, and this panel is
  // rendered from that normalised copy — so syncing the draft from the prop on
  // every keystroke rewrote the digits under the caret. Typing "165" became
  // "160" on the third key. Now the prop only wins when the field is idle.
  const [isFocused, setIsFocused] = useState(false);
  const [draft, setDraft] = useState(String(value));
  const [lastValue, setLastValue] = useState(value);
  if (!isFocused && value !== lastValue) {
    setLastValue(value);
    setDraft(String(value));
  }

  // Numbers, never strings: `--wp-panel-offset-y` adds 72 to this value.
  const push = (n) => {
    setLastValue(n);
    if (n !== value) onChange(n);
  };

  const commit = (raw) => {
    const n = Number(raw);
    if (raw.trim() === "" || !Number.isFinite(n)) return value;
    const clamped = Math.min(max, Math.max(min, Math.round(n)));
    push(clamped);
    return clamped;
  };

  return (
    <div className="flex items-center gap-2.5">
      <label htmlFor={inputId} className="min-w-0 flex-1 text-xs">
        {label}
      </label>
      <div className="flex shrink-0 items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1.5">
        <input
          id={inputId}
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          value={draft}
          onFocus={() => setIsFocused(true)}
          onChange={(event) => {
            const next = event.target.value;
            setDraft(next);
            // Preview whole numbers that are already in range. Everything else
            // — blanks, a lone "-", a value on its way past the cap — waits for
            // blur rather than snapping the launcher around mid-word.
            const n = Number(next);
            if (/^\d+$/.test(next) && n >= min && n <= max) push(n);
          }}
          onBlur={(event) => {
            setIsFocused(false);
            setDraft(String(commit(event.target.value)));
          }}
          className={cn(
            "w-16 bg-transparent text-right text-xs tabular-nums focus:outline-none",
            // The native spinner covers half of a box this size; arrow keys
            // still step the value without it.
            "[appearance:textfield]",
            "[&::-webkit-inner-spin-button]:appearance-none",
            "[&::-webkit-outer-spin-button]:appearance-none",
          )}
        />
        <span className="text-[10px] text-muted-foreground">px</span>
      </div>
    </div>
  );
}

/** A text box for the title, a swatch for everything else. */
function AdvancedField({ field, value, onChange }) {
  const inputId = `wp-advanced-${field.key}`;

  if (field.type === "text") {
    return (
      <div>
        <label htmlFor={inputId} className="text-xs text-muted-foreground">
          {field.label}
        </label>
        <input
          id={inputId}
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={cn(
            "mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm",
            "transition-colors focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          )}
        />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2.5">
      <label htmlFor={inputId} className="min-w-0 flex-1">
        <span className="block truncate text-xs">{field.label}</span>
        {field.hint ? (
          <span className="block truncate text-[10px] text-muted-foreground">
            {field.hint}
          </span>
        ) : null}
      </label>

      <span className="shrink-0 font-mono text-[10px] uppercase text-muted-foreground/70">
        {value}
      </span>

      <input
        id={inputId}
        type="color"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          "size-8 shrink-0 cursor-pointer rounded-md border border-border bg-transparent p-0.5",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          "[&::-webkit-color-swatch]:rounded [&::-webkit-color-swatch]:border-none",
          "[&::-webkit-color-swatch-wrapper]:p-0",
        )}
      />
    </div>
  );
}

function CloseGlyph() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}
