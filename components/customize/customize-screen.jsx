"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";

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

  const t = normalizeTheme(theme);
  const contrastIssues = failingContrast(t).length;

  return (
    <div className="flex min-h-full flex-col lg:flex-row">
      <CustomizeRail onStartChat={() => setIsChatOpen(true)} />

      <div className="min-w-0 flex-1 px-6 py-10 lg:px-12 lg:py-14">
        <header>
          <h1 className="text-[1.75rem] font-semibold tracking-tight">
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

        <div className="mt-9 flex flex-col gap-12 xl:flex-row xl:gap-16">
          {/* Controls */}
          <div className="w-full max-w-md space-y-8">
            <ImageField
              label="Logo"
              hint="Shown in the header, on the launcher, and beside the greeting. Up to 200 KB."
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
          <div className="xl:w-[380px] xl:shrink-0">
            <div className="xl:sticky xl:top-14">
              <WidgetPreview theme={t} />
            </div>
          </div>
        </div>
      </div>

      {isAdvancedOpen ? (
        <AdvancedPanel
          theme={t}
          onChange={setThemeValue}
          onClose={() => setIsAdvancedOpen(false)}
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
