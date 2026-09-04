"use client";

/**
 * Quick-reply chips under the greeting.
 *
 * Phase 1 is UI only, so these are real buttons with nothing behind them —
 * the same seam as the composer's no-op send.
 */
export function SuggestedReplies({ messages, onSelect }) {
  if (!messages?.length) return null;

  return (
    <div className="flex flex-col items-end gap-2">
      {messages.map((message) => (
        <button
          key={message.id}
          type="button"
          onClick={() => onSelect?.(message.text)}
          className="max-w-[85%] rounded-xl border border-[var(--wp-launcher-bg)] bg-[var(--wp-bubble-bg)] px-3.5 py-2 text-sm font-medium text-[var(--wp-launcher-bg)] transition-colors hover:bg-[var(--wp-body-bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--wp-launcher-bg)]"
        >
          {message.text}
        </button>
      ))}
    </div>
  );
}
