"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";

import { useMediaQuery } from "@/lib/use-media-query";
import { usePrefersDark } from "@/lib/use-prefers-dark";
import { useScrollLock } from "@/lib/use-scroll-lock";
import {
  DEFAULT_THEME,
  isValidPhone,
  normalizeTheme,
  themeToCssVars,
} from "@/lib/widget-theme";
import { ChatButton } from "./chat-button";
import { ChatPopup } from "./chat-popup";

const EXIT_ANIMATION_MS = 150;

/**
 * Mirrors the `wp-docked` variant in `globals.css` — the conditions under which
 * the panel is a card rather than the whole viewport. Kept in step by hand: a
 * scroll lock is a side effect CSS cannot express, and it must agree with the
 * layout it is compensating for.
 */
const DOCKED_QUERY = "(min-width: 40rem) and (min-height: 34rem)";

/**
 * Entry point for the WhatsPortal Support widget.
 *
 * Owns the focus and keyboard behaviour around the panel; everything below it
 * is presentational, which keeps the seams clean for later phases (a
 * conversation store, then a transport, would slot in here).
 *
 * `theme` is the branding seam: its values become `--wp-*` custom properties on
 * a wrapper element, and every surface below reads them from there.
 *
 * Open state is uncontrolled by default. Pass `open` + `onOpenChange` to drive
 * it from outside — the customizer uses that to launch the panel from its own
 * button.
 */
export function SupportChatWidget({ theme = DEFAULT_THEME, open, onOpenChange }) {
  const t = normalizeTheme(theme);
  const prefersDark = usePrefersDark();
  const isDark = t.scheme === "dark" || (t.scheme === "auto" && prefersDark);
  const isDocked = useMediaQuery(DOCKED_QUERY);

  const isControlled = open !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isOpen = isControlled ? open : uncontrolledOpen;

  // Kept mounted through the closing animation, then dropped.
  const [isMounted, setIsMounted] = useState(false);
  const [lastOpen, setLastOpen] = useState(isOpen);

  const launcherRef = useRef(null);
  const inputRef = useRef(null);
  const sendFormRef = useRef(null);
  const sendPhoneRef = useRef(null);
  const sendMessageRef = useRef(null);
  // Guards the focus effect so page load never steals focus to the launcher.
  const hasOpenedRef = useRef(false);

  const uid = useId();
  const panelId = `wp-support-panel-${uid}`;
  const titleId = `wp-support-title-${uid}`;
  const inputId = `wp-support-input-${uid}`;

  const setOpen = useCallback(
    (next) => {
      if (!isControlled) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  const close = useCallback(() => setOpen(false), [setOpen]);
  const toggle = useCallback(() => setOpen(!isOpen), [setOpen, isOpen]);

  // WhatsApp is the transport, and `/api/send` builds the link: the message is
  // posted there and the route redirects this tab onto `wa.me` with the text
  // already typed.
  //
  // A real form submission rather than fetch-then-window.open. Awaiting a
  // response first would end the user gesture, and the popup blocker would eat
  // the tab; submitting in the same tick as the click does not have that
  // problem, and keeps the message out of any URL of ours.
  const phone = t.phone;
  const sendMessage = useCallback(
    (text) => {
      // Nothing configured to send to — stay the no-op rather than opening a
      // tab onto a dead end.
      if (!isValidPhone(phone)) return;

      sendPhoneRef.current.value = phone;
      sendMessageRef.current.value = text;
      sendFormRef.current.submit();
    },
    [phone],
  );

  // Mount before the enter animation runs. A render-phase adjustment rather
  // than an effect, so the panel is never painted one frame late.
  if (isOpen !== lastOpen) {
    setLastOpen(isOpen);
    if (isOpen) setIsMounted(true);
  }

  // Unmount only once the exit animation has played out.
  useEffect(() => {
    if (isOpen || !isMounted) return;
    const timer = setTimeout(() => setIsMounted(false), EXIT_ANIMATION_MS);
    return () => clearTimeout(timer);
  }, [isOpen, isMounted]);

  // Move focus into the composer on open, and hand it back to the launcher on
  // close, so keyboard users never lose their place.
  useEffect(() => {
    if (isOpen) {
      hasOpenedRef.current = true;
      inputRef.current?.focus();
    } else if (hasOpenedRef.current) {
      launcherRef.current?.focus({ preventScroll: true });
    }
  }, [isOpen]);


  // Hold the page still behind the panel, but only where the panel is
  // full-bleed and the page is merely showing through. Docked, the page beside
  // it is still the user's to scroll. Re-evaluates on rotate.
  useScrollLock(isOpen && !isDocked);

  // Escape closes the panel from anywhere on the page.
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, close]);

  // The panel and launcher are fixed-positioned and the form is hidden, so
  // this wrapper carries the theme without taking part in layout.
  return (
    <div style={themeToCssVars(theme, { dark: isDark })}>
      {isMounted && (
        <ChatPopup
          id={panelId}
          titleId={titleId}
          inputId={inputId}
          theme={theme}
          side={t.side}
          isOpen={isOpen}
          onClose={close}
          inputRef={inputRef}
          onSendMessage={sendMessage}
        />
      )}

      <ChatButton
        ref={launcherRef}
        isOpen={isOpen}
        onClick={toggle}
        controls={panelId}
        logo={t.logo}
      />

      {/* Submitted from `sendMessage`; never shown, never focusable. */}
      <form ref={sendFormRef} action="/api/send" method="POST" target="_blank" hidden>
        <input type="hidden" name="phone" ref={sendPhoneRef} />
        <input type="hidden" name="message" ref={sendMessageRef} />
      </form>
    </div>
  );
}
