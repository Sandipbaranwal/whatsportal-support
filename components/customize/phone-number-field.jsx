"use client";

import { useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { isValidPhone, phoneDigits } from "@/lib/widget-theme";
import { SegmentedField } from "./segmented-field";

/**
 * The number every message is delivered to, plus whether to ask the visitor
 * for theirs.
 *
 * One field rather than a country picker and a national number: people know
 * their own number in one piece, and everything but the digits is thrown away
 * before the link is built anyway.
 */
export function PhoneNumberField({
  value,
  askVisitorPhone,
  onChange,
  onAskChange,
}) {
  // The stored value is trimmed, so the draft has to own the box while it has
  // focus — otherwise the space after "+91" disappears as it is typed.
  const isFocused = useRef(false);
  const [draft, setDraft] = useState(value);
  const [lastValue, setLastValue] = useState(value);
  if (!isFocused.current && value !== lastValue) {
    setLastValue(value);
    setDraft(value);
  }

  const digits = phoneDigits(draft);
  const isIncomplete = draft.trim() !== "" && !isValidPhone(draft);

  return (
    <div>
      <label htmlFor="wp-phone" className="text-sm font-medium">
        WhatsApp number
      </label>
      <input
        id="wp-phone"
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        maxLength={32}
        value={draft}
        placeholder="+91 98765 43210"
        aria-describedby="wp-phone-hint"
        aria-invalid={isIncomplete}
        onFocus={() => {
          isFocused.current = true;
        }}
        onChange={(event) => {
          setDraft(event.target.value);
          setLastValue(event.target.value);
          onChange(event.target.value);
        }}
        onBlur={() => {
          isFocused.current = false;
          setDraft(value);
          setLastValue(value);
        }}
        className={cn(
          "mt-2 block w-full rounded-lg border bg-background px-3.5 py-2.5 text-sm",
          "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          isIncomplete
            ? "border-amber-500/60"
            : "border-border focus-visible:border-primary",
        )}
      />

      <p id="wp-phone-hint" className="mt-1.5 text-xs text-muted-foreground">
        Messages sent from the widget open WhatsApp for this number. Include the
        country code.
      </p>

      {isIncomplete ? (
        <p className="mt-1.5 text-xs text-amber-700 dark:text-amber-300">
          That doesn&apos;t look like a full number yet — 8 to 15 digits,
          country code included. Sending stays switched off until it does.
        </p>
      ) : null}

      {digits ? (
        <p className="mt-1.5 font-mono text-xs text-muted-foreground">
          wa.me/{digits}
        </p>
      ) : null}

      <div className="mt-4">
        <SegmentedField
          label="Ask for the visitor's number"
          hint="Adds a short field above the composer. Their number is carried in as the first line of the message they send, since there is nowhere here to store it."
          value={askVisitorPhone ? "on" : "off"}
          options={[
            { value: "off", label: "Off" },
            { value: "on", label: "On" },
          ]}
          onChange={(next) => onAskChange(next === "on")}
        />
      </div>
    </div>
  );
}
