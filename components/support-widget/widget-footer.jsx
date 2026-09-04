export const WHATSPORTAL_URL = "https://www.whatsportal.io";

/** Quiet attribution strip — present, but never competing with the chat. */
export function WidgetFooter() {
  return (
    <footer className="shrink-0 border-t border-[var(--wp-border)] bg-[var(--wp-panel-bg)] px-4 py-2.5 text-center text-[11px] text-[var(--wp-panel-muted)]">
      Powered by{" "}
      <a
        href={WHATSPORTAL_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-md font-medium text-[var(--wp-panel-fg)] underline-offset-2 transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--wp-launcher-bg)]"
      >
        WhatsPortal
      </a>
    </footer>
  );
}
