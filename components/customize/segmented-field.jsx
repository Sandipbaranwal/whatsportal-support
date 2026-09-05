"use client";

import { cn } from "@/lib/utils";

/**
 * A labelled row of mutually exclusive choices.
 *
 * `size` picks the label treatment rather than accepting a className, because
 * this project's `cn` is a plain join with no conflict resolution — overlapping
 * text utilities would both land in the class list.
 */
export function SegmentedField({
  label,
  hint,
  value,
  options,
  onChange,
  size = "sm",
}) {
  return (
    <div>
      <p className={size === "md" ? "text-sm font-medium" : "text-xs"}>
        {label}
      </p>

      {/* `flex-wrap` is insurance: the group is `inline-flex` and would rather
          push past a 320px screen than fold. */}
      <div className="mt-2 inline-flex flex-wrap rounded-lg border border-border p-0.5">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={value === option.value}
            onClick={() => onChange(option.value)}
            className={cn(
              "rounded-md px-3.5 py-1.5 text-xs font-medium transition-colors wp-touch:py-2.5",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              value === option.value
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      {hint ? (
        <p
          className={cn(
            "mt-2 leading-relaxed text-muted-foreground",
            size === "md" ? "text-xs" : "text-[10px]",
          )}
        >
          {hint}
        </p>
      ) : null}
    </div>
  );
}
