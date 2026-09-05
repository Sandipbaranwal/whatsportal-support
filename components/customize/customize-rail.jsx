"use client";

import { WhatsPortalMark } from "@/components/support-widget/whatsportal-mark";
import { cn } from "@/lib/utils";

/**
 * The context column.
 *
 * Committed to a dark surface in both colour schemes: it frames the form the
 * way an onboarding rail does, and staying dark keeps it from competing with
 * the widget preview, whose colours are the point of the page.
 *
 * Two layouts, one component. As a column it needs 300–400px of width, which
 * below `xl` is width the form and its live preview need more — so there it
 * lies down into a banner: mark, heading and the launch button on one line,
 * and the explanatory copy dropped. That copy is orientation for a first
 * visit, not instruction, and it is the part worth losing to put the preview
 * beside the controls at 1024px instead of 520px below them.
 */
export function CustomizeRail({ onStartChat }) {
  return (
    <aside
      className={cn(
        "flex shrink-0 flex-row items-center gap-4 bg-neutral-900 text-neutral-100",
        // The safe-area terms are 0 on everything but a notched phone held
        // sideways, where they hold the content clear of the cutout.
        "py-4 pl-[calc(1.25rem+var(--wp-safe-l))] pr-[calc(1.25rem+var(--wp-safe-r))]",
        "sm:py-5 sm:pl-[calc(1.5rem+var(--wp-safe-l))] sm:pr-[calc(1.5rem+var(--wp-safe-r))]",
        // Standing up as a column, once there is width to spare for one.
        "xl:w-[300px] xl:flex-col xl:items-stretch xl:gap-8 xl:px-10 xl:py-14",
        "2xl:w-[400px]",
      )}
    >
      <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-neutral-800 text-neutral-100 sm:size-14 xl:mx-auto">
        <WhatsPortalMark className="w-6 sm:w-8" sparkleClassName="fill-emerald-400" />
      </span>

      {/* Redundant beside the heading when they share a line. */}
      <div className="hidden items-start gap-4 rounded-xl border border-neutral-700/70 p-5 xl:flex">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-emerald-500 text-neutral-900">
          <ChatGlyph />
        </span>
        <div>
          <p className="text-[0.95rem] font-semibold">Live Chat</p>
          <p className="mt-0.5 text-sm leading-relaxed text-neutral-400">
            Add live chat to your website
          </p>
        </div>
      </div>

      {/* A row that becomes a block: as a banner the heading and the button sit
          at opposite ends of the line, as a column they stack. */}
      <div className="flex min-w-0 flex-1 flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-5 xl:block">
        <h2 className="text-base font-semibold leading-snug tracking-tight sm:text-lg xl:text-[1.6rem]">
          Talk to the visitors on your website
        </h2>

        <div className="mt-7 hidden space-y-5 text-sm leading-relaxed text-neutral-400 xl:block">
          <p>
            Set the basics here — your logo, your colour, and the first thing
            people see when they open the chat.
          </p>
          <p>
            Everything saves as you type and applies to the preview beside you,
            so there is nothing to submit.
          </p>
          <p>Want to see it in place?</p>
        </div>

        <button
          type="button"
          onClick={onStartChat}
          className={cn(
            "shrink-0 whitespace-nowrap rounded-lg border border-neutral-700 px-4 py-2 text-sm font-medium",
            "sm:px-5 sm:py-2.5 xl:mt-5",
            "transition-colors hover:bg-neutral-800",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900",
          )}
        >
          Chat with us
        </button>
      </div>
    </aside>
  );
}

function ChatGlyph() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9 9 0 0 1-3.9-.9L3 21l1.9-4.1A8.4 8.4 0 0 1 12 3.1a8.4 8.4 0 0 1 9 8.4Z" />
    </svg>
  );
}
