"use client";

import { BrandGlyph } from "./brand-glyph";
import { CloseIcon } from "./icons";

/**
 * Brand bar for the panel. `titleId` is owned by the panel so it can point its
 * `aria-labelledby` here.
 */
export function ChatHeader({ titleId, title, subtitle, logo, onClose }) {
  return (
    <header className="flex shrink-0 items-center gap-3 bg-[var(--wp-header-bg)] px-4 py-4 text-[var(--wp-header-fg)]">
      <span className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-xl bg-white/15">
        <BrandGlyph src={logo} markClassName="w-6" sparkleClassName="fill-current" />
      </span>

      <div className="min-w-0 flex-1">
        <h2
          id={titleId}
          className="truncate text-[0.95rem] font-semibold tracking-tight"
        >
          {title}
        </h2>
        {subtitle ? (
          <p className="truncate text-xs text-[var(--wp-header-muted)]">
            {subtitle}
          </p>
        ) : null}
      </div>

      {onClose ? (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close chat"
          className="grid size-9 shrink-0 place-items-center rounded-xl wp-touch:size-11 text-[var(--wp-header-muted)] transition-colors hover:bg-white/15 hover:text-[var(--wp-header-fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--wp-header-fg)]"
        >
          <CloseIcon />
        </button>
      ) : null}
    </header>
  );
}
