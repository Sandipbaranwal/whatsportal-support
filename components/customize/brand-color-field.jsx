"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";
import { COLOR_PRESETS, toHex } from "@/lib/widget-theme";

/**
 * The brand colour: preset shortcuts, a picker, and a hex box.
 *
 * The text box keeps its own draft so a half-typed value like `#00` isn't
 * pushed to the theme — it commits on blur, Enter, or as soon as it parses.
 */
export function BrandColorField({ value, onChange }) {
  const [draft, setDraft] = useState(value);
  const [lastValue, setLastValue] = useState(value);

  // Follow the theme when a preset or the picker changes it elsewhere. This is
  // the render-phase adjustment React documents for derived state — an effect
  // would render the stale draft first, then correct it.
  if (value !== lastValue) {
    setLastValue(value);
    setDraft(value);
  }

  const commit = (raw) => {
    const hex = toHex(raw);
    if (hex) onChange(hex);
    else setDraft(value);
  };

  return (
    <div>
      <p className="text-sm font-medium">Colour</p>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        {COLOR_PRESETS.map((preset) => (
          <button
            key={preset.value}
            type="button"
            title={preset.name}
            aria-label={preset.name}
            aria-pressed={value.toLowerCase() === preset.value}
            onClick={() => onChange(preset.value)}
            style={{ backgroundColor: preset.value }}
            className={cn(
              "size-9 rounded-lg ring-offset-2 ring-offset-background transition-transform wp-touch:size-11",
              "hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              value.toLowerCase() === preset.value && "ring-2 ring-foreground",
            )}
          />
        ))}

        <div className="flex items-center gap-1.5 rounded-lg border border-border bg-background py-1 pl-1 pr-2.5">
          <input
            type="color"
            value={value}
            aria-label="Pick brand colour"
            onChange={(event) => onChange(event.target.value)}
            className={cn(
              "size-7 shrink-0 cursor-pointer rounded-md border-none bg-transparent p-0 wp-touch:size-9",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              "[&::-webkit-color-swatch]:rounded [&::-webkit-color-swatch]:border-none",
              "[&::-webkit-color-swatch-wrapper]:p-0",
            )}
          />
          <input
            type="text"
            value={draft}
            spellCheck={false}
            aria-label="Brand colour hex"
            onChange={(event) => setDraft(event.target.value)}
            onBlur={(event) => commit(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                commit(event.currentTarget.value);
              }
            }}
            className="w-[9ch] bg-transparent font-mono text-sm uppercase focus:outline-none"
          />
        </div>
      </div>

      <p className="mt-2 text-xs text-muted-foreground">
        Sets the launcher, the header and the quick-reply chips.
      </p>
    </div>
  );
}
