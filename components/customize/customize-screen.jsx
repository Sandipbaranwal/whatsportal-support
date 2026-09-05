"use client";

import Link from "next/link";
import { useCallback, useState, useSyncExternalStore } from "react";

import { SupportChatWidget } from "@/components/support-widget";
import { cn } from "@/lib/utils";
import {
  getThemeError,
  getThemeServerSnapshot,
  getThemeSnapshot,
  resetTheme,
  setBrandColor,
  setThemeValue,
  subscribeToTheme,
} from "@/lib/theme-store";
import {
  brandColorOf,
  failingContrast,
  normalizeTheme,
} from "@/lib/widget-theme";
import { AdvancedPanel } from "./advanced-panel";
import { BrandColorField } from "./brand-color-field";
import { CustomizeRail } from "./customize-rail";
import { ImageField } from "./image-field";
import { PhoneNumberField } from "./phone-number-field";
import { SegmentedField } from "./segmented-field";
import { SuggestedMessagesField } from "./suggested-messages-field";
import { ThemeTransfer } from "./theme-transfer";
import { WelcomeMessageField } from "./welcome-message-field";
import { WidgetPreview } from "./widget-preview";

/**
 * The customizer: context rail, controls, and the real widget previewing
 * alongside. Everything reads and writes the same store the live widget uses,
 * so changes here are already saved — there is nothing to submit.
 */
export function CustomizeScreen() {
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    getThemeServerSnapshot,
  );
  const storageError = useSyncExternalStore(
    subscribeToTheme,
    getThemeError,
    () => null,
  );

  // Lets the rail's "Chat with us" open the real launcher on this page.
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  // Stable identity: the drawer keys an effect off this, and every edit made
  // inside it re-renders this screen. A fresh closure each time would rebind
  // that effect on every keystroke.
  const closeAdvanced = useCallback(() => setIsAdvancedOpen(false), []);

  const t = normalizeTheme(theme);
  const contrastIssues = failingContrast(t).length;

  return (
    <div className="flex min-h-full flex-col xl:flex-row">
      <CustomizeRail onStartChat={() => setIsChatOpen(true)} />

      <div
        className={cn(
          "min-w-0 flex-1 py-8",
          // The safe-area terms are 0 except on a notched phone in landscape.
          "pl-[calc(1.5rem+var(--wp-safe-l))] pr-[calc(1.5rem+var(--wp-safe-r))]",
          "sm:py-10 lg:px-10 xl:px-12 xl:py-14",
          // Text run across the full width of a 2560px display is text nobody
          // reads, so the column stops growing and centres instead.
          "2xl:mx-auto 2xl:max-w-[1400px]",
        )}
      >
        <header>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-[1.75rem]">
            Customize the widget to suit your brand
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            (you can change this later)
          </p>
        </header>

        {storageError ? (
          <p
            role="alert"
            className="mt-6 max-w-md rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-300"
          >
            {storageError}
          </p>
        ) : null}

        {/*
         * Controls beside the preview from `lg` rather than `xl`.
         *
         * With the rail lying down as a banner below `xl`, the full width is
         * free here: 448 of controls + 32 of gap + 340 of preview + 80 of
         * padding is 900, inside 1024. It used to wait until 1280 and then not
         * fit — 1388 of content into 1280, with the preview marked `shrink-0`
         * so the controls absorbed all of it and came out narrower than they
         * had been one pixel earlier.
         */}
        <div className="mt-8 flex flex-col gap-10 lg:flex-row lg:gap-8 xl:gap-10 2xl:gap-16">
          {/* Controls */}
          <div className="w-full min-w-0 max-w-md space-y-8">
            <ImageField
              label="Logo"
              hint="Shown in the header, on the launcher, and beside the greeting. Up to 500 KB."
              value={t.logo}
              onChange={(value) => setThemeValue("logo", value)}
            />

            <PhoneNumberField
              value={t.phone}
              askVisitorPhone={t.askVisitorPhone}
              onChange={(value) => setThemeValue("phone", value)}
              onAskChange={(value) => setThemeValue("askVisitorPhone", value)}
            />

            <div>
              <BrandColorField value={brandColorOf(t)} onChange={setBrandColor} />

              <button
                type="button"
                onClick={() => setIsAdvancedOpen(true)}
                className={cn(
                  "mt-3 inline-flex items-center gap-1.5 rounded-lg border border-border px-3.5 py-2",
                  "text-xs font-medium transition-colors hover:bg-muted",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                )}
              >
                Advanced
                {contrastIssues ? (
                  <span className="rounded-full bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 dark:text-amber-300">
                    {contrastIssues}
                  </span>
                ) : null}
                <span aria-hidden="true" className="text-muted-foreground">
                  →
                </span>
              </button>

              {contrastIssues ? (
                <p className="mt-2 text-xs text-amber-700 dark:text-amber-300">
                  {contrastIssues === 1
                    ? "1 colour pair is hard to read — see Advanced."
                    : `${contrastIssues} colour pairs are hard to read — see Advanced.`}
                </p>
              ) : null}
            </div>

            <SegmentedField
              size="md"
              label="Appearance"
              hint="Auto follows each visitor's own light or dark setting. Dark surfaces are derived from the colours above — your brand colour is kept as-is."
              value={t.scheme}
              options={[
                { value: "light", label: "Light" },
                { value: "dark", label: "Dark" },
                { value: "auto", label: "Auto" },
              ]}
              onChange={(value) => setThemeValue("scheme", value)}
            />

            <WelcomeMessageField
              value={t.welcomeMessage}
              onChange={(value) => setThemeValue("welcomeMessage", value)}
            />

            <SuggestedMessagesField
              messages={t.suggestedMessages}
              onChange={(messages) =>
                setThemeValue("suggestedMessages", messages)
              }
            />

            <div className="border-t border-border pt-6">
              <ThemeTransfer theme={t} />
            </div>

            <div className="flex items-center gap-4 border-t border-border pt-6">
              <button
                type="button"
                onClick={resetTheme}
                className={cn(
                  "rounded-lg border border-border px-4 py-2 text-sm font-medium",
                  "transition-colors hover:bg-muted",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                )}
              >
                Reset to defaults
              </button>

              <Link
                href="/"
                className="rounded-md text-sm text-muted-foreground underline-offset-2 transition-colors hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                See it on a page
              </Link>
            </div>
          </div>

          {/* Preview */}
          <div className="lg:w-[340px] lg:shrink-0 xl:w-[380px]">
            <div className="lg:sticky lg:top-8 xl:top-14">
              <WidgetPreview theme={t} />
            </div>
          </div>
        </div>
      </div>

      {isAdvancedOpen ? (
        <AdvancedPanel
          theme={t}
          onChange={setThemeValue}
          onClose={closeAdvanced}
        />
      ) : null}

      {/* The real widget, so the rail's button can launch it in place. */}
      <SupportChatWidget
        theme={t}
        open={isChatOpen}
        onOpenChange={setIsChatOpen}
      />
    </div>
  );
}
