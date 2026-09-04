import { BrandGlyph } from "./brand-glyph";

/**
 * The greeting shown when the panel opens. Phase 1 has no conversation state,
 * so this is the configured copy rather than a rendered message.
 */
export function WelcomeMessage({ text, avatar }) {
  return (
    <div className="flex animate-message-in items-end gap-2.5">
      <span className="grid size-8 shrink-0 place-items-center overflow-hidden rounded-full border border-[var(--wp-border)] bg-[var(--wp-avatar-bg)] text-[var(--wp-bubble-fg)]">
        <BrandGlyph
          src={avatar}
          markClassName="w-4"
          sparkleClassName="fill-[var(--wp-launcher-bg)]"
        />
      </span>

      <div className="max-w-[85%] whitespace-pre-line rounded-2xl rounded-bl-md border border-[var(--wp-border)] bg-[var(--wp-bubble-bg)] px-4 py-3 text-sm leading-relaxed text-[var(--wp-bubble-fg)] shadow-sm shadow-black/5">
        {text}
      </div>
    </div>
  );
}
