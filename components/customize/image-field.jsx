"use client";

import { useId, useRef, useState } from "react";

import { cn } from "@/lib/utils";

/**
 * Uploads are inlined as data URLs and kept in `localStorage`, which caps out
 * around 5 MB for the whole origin. 200 KB leaves room for everything else and
 * is generous for a logo.
 */
const MAX_BYTES = 200 * 1024;

function formatKb(bytes) {
  return `${Math.round(bytes / 1024)} KB`;
}

/** A single image slot: click to upload, thumbnail with a remove button once set. */
export function ImageField({ label, hint, value, onChange }) {
  const inputRef = useRef(null);
  const [error, setError] = useState(null);
  const describedBy = useId();

  const handleFile = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("That file isn't an image.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError(`Too large (${formatKb(file.size)}). Max ${formatKb(MAX_BYTES)}.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setError(null);
      onChange(reader.result);
    };
    reader.onerror = () => setError("Couldn't read that file.");
    reader.readAsDataURL(file);
  };

  const clear = () => {
    setError(null);
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div>
      <p className="text-sm font-medium">{label}</p>

      <div className="mt-2 flex items-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          aria-describedby={describedBy}
          className={cn(
            "relative grid size-20 shrink-0 place-items-center overflow-hidden rounded-xl",
            "border border-dashed border-border bg-muted/40",
            "transition-colors hover:border-primary hover:bg-muted",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          )}
        >
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={value}
              alt={`${label} preview`}
              className="size-full object-cover"
            />
          ) : (
            <span className="text-2xl leading-none text-muted-foreground">+</span>
          )}
        </button>

        <div className="min-w-0">
          <p id={describedBy} className="text-xs text-muted-foreground">
            {hint}
          </p>
          {value ? (
            <button
              type="button"
              onClick={clear}
              className="mt-1.5 rounded-md text-xs font-medium text-muted-foreground underline-offset-2 transition-colors hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Remove
            </button>
          ) : null}
          {error ? (
            <p role="alert" className="mt-1.5 text-xs text-red-500">
              {error}
            </p>
          ) : null}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        aria-label={label}
        onChange={(event) => handleFile(event.target.files?.[0])}
      />
    </div>
  );
}
