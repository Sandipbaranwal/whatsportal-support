"use client";

import { cn } from "@/lib/utils";
import { BrandGlyph } from "./brand-glyph";
import { CloseIcon } from "./icons";

/**
 * The floating launcher. Stays pinned to its corner everywhere; it steps aside
 * while the panel is open only where the panel is full-bleed and would cover
 * it anyway — which is a question of available room, not of width, hence
 * `wp-full` rather than a plain `max-sm`.
 *
 * Its diameter comes from `--wp-launcher-size` so the panel, which positions
 * itself relative to that same token, cannot fall out of step with it.
 */
export function ChatButton({ isOpen, onClick, controls, logo, ref }) {
  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      aria-label={isOpen ? "Close WhatsPortal Support chat" : "Open WhatsPortal Support chat"}
      aria-expanded={isOpen}
      aria-controls={controls}
      className={cn(
        "fixed z-50 grid place-items-center overflow-hidden rounded-full",
        "size-[var(--wp-launcher-size)]",
        "bottom-[calc(var(--wp-offset-y)+var(--wp-safe-b))] left-[var(--wp-left)] right-[var(--wp-right)]",
        "bg-[var(--wp-launcher-bg)] text-[var(--wp-launcher-icon)]",
        "shadow-lg shadow-black/15 ring-1 ring-black/5",
        "transition-[transform,background-color,box-shadow] duration-200 ease-out",
        "hover:-translate-y-0.5 hover:bg-[var(--wp-launcher-bg-hover)] hover:shadow-xl hover:shadow-black/20",
        "active:translate-y-0 active:scale-95",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--wp-launcher-bg)] focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        isOpen && "wp-full:pointer-events-none wp-full:opacity-0",
      )}
    >
      {/* Both glyphs are stacked so the swap cross-fades instead of popping. */}
      <span
        className={cn(
          "col-start-1 row-start-1 transition-[opacity,transform] duration-200",
          isOpen ? "scale-75 opacity-0" : "scale-100 opacity-100",
        )}
      >
        <BrandGlyph src={logo} markClassName="w-7" sparkleClassName="fill-current" className="rounded-full" />
      </span>
      <span
        className={cn(
          "col-start-1 row-start-1 transition-[opacity,transform] duration-200",
          isOpen ? "scale-100 opacity-100" : "scale-75 opacity-0",
        )}
      >
        <CloseIcon className="size-6" />
      </span>
    </button>
  );
}

