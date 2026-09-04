# whatsportal-support

Customer-support chat widget for [WhatsPortal](https://www.whatsportal.io).

**Phase 1 — UI only.** No backend, API, socket, database, auth, or chatbot.
Nothing is faked either: there are no canned replies and no mock data.

## Stack

Next.js 16 (App Router) · React 19 · JavaScript · Tailwind CSS v4 · Geist.

Design tokens live in `app/globals.css` and follow the same semantic vocabulary
as the main WhatsPortal product (`--primary`, `--muted-foreground`, `--radius`,
…). Components never hard-code a colour — retheme from that one file.

## Structure

```
app/
  globals.css                     design tokens + keyframes
  layout.js                       fonts, metadata, theme colour
  page.js                         preview host page
components/support-widget/
  support-chat-widget.jsx         open/close state, focus, Escape  ← entry point
  chat-button.jsx                 floating launcher
  chat-popup.jsx                  panel shell + transcript region
  chat-header.jsx                 brand bar + close button
  welcome-message.jsx             the static greeting
  message-input.jsx               composer (send is a deliberate no-op)
  widget-footer.jsx               "Powered by WhatsPortal"
  whatsportal-mark.jsx            inline logo, tintable
  icons.jsx                       stroke icon set
lib/utils.js                      cn() class joiner
public/whatsportal-mark.svg       logo asset / favicon
```

## Run

```bash
npm install
npm run dev
```

Then open http://localhost:3000 and use the launcher in the bottom-right.

## Extending

`SupportChatWidget` is the single stateful component — later phases hook in
there. `MessageInput` already accepts an `onSend` callback that Phase 2 can
point at a local conversation store; today nothing is passed to it.
