import Link from "next/link";

import { cn } from "@/lib/utils";
import { WidgetPlayground } from "@/components/widget-playground";
import { WhatsPortalMark } from "@/components/support-widget/whatsportal-mark";

/**
 * Host page for the widget preview. Its only job is to give the launcher a
 * realistic page to sit on top of — the deliverable is the widget itself.
 */
export default function Home() {
  return (
    <main
      className={cn(
        "flex flex-1 flex-col items-center justify-center",
        "pl-[calc(1.5rem+var(--wp-safe-l))] pr-[calc(1.5rem+var(--wp-safe-r))]",
        // 80px top and bottom is most of a small phone's screen. The heavier
        // bottom padding keeps the fine print out from under the launcher,
        // which is fixed and knows nothing about this page's content.
        "py-12 pb-28 sm:px-6 sm:py-20 sm:pb-24",
      )}
    >
      <div className="w-full max-w-md text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl border border-border bg-card text-foreground shadow-sm shadow-black/5">
          <WhatsPortalMark className="w-8" />
        </span>

        <h1 className="mt-6 text-2xl font-semibold tracking-tight">
          WhatsPortal Support
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Phase 1 preview of the customer-support chat widget, sitting on an
          ordinary page. Use the launcher to open and close the panel.
        </p>

        <Link
          href="/customize"
          className="mt-6 inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Customize the widget
        </Link>

        <p className="mt-8 text-xs text-muted-foreground">
          UI only — no messaging, no backend.
        </p>
      </div>

      <WidgetPlayground />
    </main>
  );
}
