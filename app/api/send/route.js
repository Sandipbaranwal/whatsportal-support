import { isValidPhone, whatsappHref } from "@/lib/widget-theme";

/**
 * Hands a message over to WhatsApp.
 *
 * The widget posts the destination number and the message here and the browser
 * follows the redirect, so the link is built and checked in one place on the
 * server rather than assembled in the page.
 *
 * What this is not: `wa.me` is a redirect target, not a delivery API. Nothing
 * is sent from here — the visitor's own WhatsApp opens with the text already
 * typed. Delivering messages server-side would mean the Meta Cloud API, which
 * is a different thing entirely.
 */

/** A `wa.me` URL carries the whole message; past this it stops being one. */
const MAX_MESSAGE_LENGTH = 2000;

export async function POST(request) {
  const form = await request.formData();
  const phone = String(form.get("phone") ?? "");
  const message = String(form.get("message") ?? "").slice(0, MAX_MESSAGE_LENGTH);

  if (!isValidPhone(phone)) {
    return problem(
      "This chat widget has no usable WhatsApp number set, so there is nowhere to send your message.",
    );
  }

  if (!message.trim()) {
    return problem("There was no message to send.");
  }

  const href = whatsappHref({ phone }, message);

  // 303, not 307: the browser must turn this POST into a GET to land on
  // WhatsApp. `next/navigation`'s redirect() answers 307 and is meant for UI
  // routes, so the header is set directly.
  return new Response(null, { status: 303, headers: { Location: href } });
}

/**
 * A readable dead end.
 *
 * This response is what the visitor's newly opened tab renders, so it is a
 * page rather than JSON. Nothing they submitted is echoed back into it.
 */
function problem(reason) {
  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Message not sent</title>
    <style>
      :root { color-scheme: light dark; }
      body {
        margin: 0;
        min-height: 100dvh;
        display: grid;
        place-items: center;
        padding: 2rem;
        font: 16px/1.6 system-ui, -apple-system, "Segoe UI", sans-serif;
      }
      main { max-width: 30rem; text-align: center; }
      h1 { margin: 0 0 0.5rem; font-size: 1.125rem; }
      p { margin: 0; opacity: 0.7; }
    </style>
  </head>
  <body>
    <main>
      <h1>Message not sent</h1>
      <p>${reason}</p>
    </main>
  </body>
</html>
`;

  return new Response(html, {
    status: 400,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}
