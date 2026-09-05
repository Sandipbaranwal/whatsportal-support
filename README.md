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

Two routes: `/` hosts the widget on an ordinary page, `/customize` is the
customizer. Both are static; `/api/send` is the only server code.

```
app/
  globals.css                     design tokens, custom variants, keyframes
  layout.js                       fonts, metadata, viewport
  page.js                         preview host page
  customize/page.js               the customizer
  api/send/route.js               POST → redirect onto wa.me
components/support-widget/
  support-chat-widget.jsx         open/close state, focus, Escape  ← entry point
  chat-button.jsx                 floating launcher
  chat-popup.jsx                  the floating box: full-bleed or docked card
  chat-panel.jsx                  panel contents, shared with the preview
  chat-header.jsx                 brand bar + close button
  welcome-message.jsx             the static greeting
  suggested-replies.jsx           quick-reply chips
  visitor-phone-field.jsx         optional "your number" strip
  message-input.jsx               composer
  widget-footer.jsx               "Powered by WhatsPortal"
  brand-glyph.jsx                 the uploaded logo, or the mark
  whatsportal-mark.jsx            inline logo, tintable
  icons.jsx                       stroke icon set
components/customize/
  customize-screen.jsx            page shell: rail, controls, preview
  customize-rail.jsx              context column at xl, banner below it
  widget-preview.jsx              the same panel, docked instead of floating
  advanced-panel.jsx              every surface, one control each
  *-field.jsx                     the individual controls
lib/
  widget-theme.js                 theme contract → --wp-* custom properties
  theme-store.js                  localStorage store, writes debounced
  use-media-query.js              a media query as an external store
  use-scroll-lock.js              holds the page still behind an overlay
  use-focus-trap.js               keeps Tab inside the open panel
  use-prefers-dark.js             the visitor's OS colour scheme
  use-auto-grow.js                textarea that grows with its content
  utils.js                        cn() class joiner
public/whatsportal-mark.svg       logo asset / favicon
```

## Responsive

Sized for 320px phones through ultra-wide, portrait and landscape. Two things
are worth knowing before changing layout here:

- `wp-docked` (defined in `globals.css`) asks for width **and** height, because
  "is there room for a floating card?" is not a question width alone can
  answer — a landscape phone is wide enough and nowhere near tall enough.
- The launcher's size is the token `--wp-launcher-size`, and the panel offsets
  itself from that same token in CSS. Changing one moves the other.

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
