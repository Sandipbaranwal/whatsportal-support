"use client";

import { cn } from "@/lib/utils";
import { BrandGlyph } from "./brand-glyph";
import { CloseIcon } from "./icons";

/**
 * The floating launcher. Stays pinned bottom-right on every breakpoint; on
 * small screens it steps aside while the panel is open, since the panel takes
 * the full viewport there.
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
        "fixed z-50 grid size-14 place-items-center overflow-hidden rounded-full",
        "bottom-[var(--wp-offset-y)] left-[var(--wp-left)] right-[var(--wp-right)]",
        "bg-[var(--wp-launcher-bg)] text-[var(--wp-launcher-icon)]",
        "shadow-lg shadow-black/15 ring-1 ring-black/5",
        "transition-[transform,background-color,box-shadow] duration-200 ease-out",
        "hover:-translate-y-0.5 hover:bg-[var(--wp-launcher-bg-hover)] hover:shadow-xl hover:shadow-black/20",
        "active:translate-y-0 active:scale-95",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--wp-launcher-bg)] focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        isOpen && "max-sm:pointer-events-none max-sm:opacity-0",
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

