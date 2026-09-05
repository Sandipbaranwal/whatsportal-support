# whatsportal-support

Customer-support chat widget for [WhatsPortal](https://www.whatsportal.io).

Live: <https://whatsportal-support.vercel.app>

**No backend, API, socket, database, auth, or chatbot.** Nothing is faked
either: there are no canned replies and no mock data. A sent message leaves the
page as a prefilled `wa.me` link to the number set in the customizer, so the
conversation continues in WhatsApp itself.

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
  message-input.jsx               composer
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

`SupportChatWidget` owns open/close state and builds the `wa.me` link;
`ChatPanel` owns the visitor's number and decides whether a message can go.
A later phase that wants a real transcript replaces `ChatPanel`'s `send` —
`MessageInput` and `SuggestedReplies` both already submit to it.
