"use client";

import { WhatsPortalMark } from "@/components/support-widget/whatsportal-mark";
import { cn } from "@/lib/utils";

/**
 * The context column.
 *
 * Committed to a dark surface in both colour schemes: it frames the form the
 * way an onboarding rail does, and staying dark keeps it from competing with
 * the widget preview, whose colours are the point of the page.
 */
export function CustomizeRail({ onStartChat }) {
  return (
    <aside className="flex shrink-0 flex-col gap-8 bg-neutral-900 px-8 py-10 text-neutral-100 lg:w-[360px] lg:px-10 lg:py-14 xl:w-[400px]">
      <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-neutral-800 text-neutral-100">
        <WhatsPortalMark className="w-8" sparkleClassName="fill-emerald-400" />
      </span>

      <div className="flex items-start gap-4 rounded-xl border border-neutral-700/70 p-5">
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

      <div>
        <h2 className="text-[1.6rem] font-semibold leading-snug tracking-tight">
          Talk to the visitors on your website
        </h2>

        <div className="mt-7 space-y-5 text-sm leading-relaxed text-neutral-400">
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
            "mt-5 rounded-lg border border-neutral-700 px-5 py-2.5 text-sm font-medium",
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
