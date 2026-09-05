/**
 * The widget's theme contract.
 *
 * Everything the customizer can change lives in one flat object — hex strings
 * for colour (so `<input type="color">` drives them directly), plain strings
 * for copy, data URLs for uploaded art. Components read colours as `--wp-*`
 * custom properties and take content as props.
 *
 * Colour defaults are the sRGB equivalents of the light `oklch` tokens in
 * globals.css, so an untouched widget looks as it did before theming existed.
 */
export const MAX_MESSAGES = 6;
export const MAX_SUGGESTION_LENGTH = 200;
export const MAX_WELCOME_LENGTH = 500;

/** Room for "+" plus grouping spaces around an E.164 number. */
const MAX_PHONE_LENGTH = 32;

export const DEFAULT_THEME = {
  title: "WhatsPortal Support",
  subtitle: "Customer support",
  welcomeMessage:
    "Hi there 👋\nWelcome to WhatsPortal Support!\nHow can I help you today?",

  /** Data URL, or null to fall back to the WhatsPortal mark. */
  logo: null,

  /** The business WhatsApp number, as typed — e.g. "+91 98765 43210". */
  phone: "",

  /** Ask the visitor for their own number before their first message. */
  askVisitorPhone: false,

  suggestedMessages: [
    { id: "default-question", text: "I have a question" },
    { id: "default-more", text: "Tell me more" },
  ],

  /** "light" | "dark" | "auto" — auto follows the visitor's OS setting. */
  scheme: "auto",

  /** Launcher placement. Offsets are px from that corner. */
  side: "right",
  offsetX: 24,
  offsetY: 24,

  launcherIcon: "#fafafa",
  launcherBg: "#008231",

  headerBg: "#008231",
  headerFg: "#fafafa",

  bodyBg: "#f6f9f7",
  avatarBg: "#ffffff",
  bubbleBg: "#ffffff",
  bubbleFg: "#0a0a0a",
  panelBg: "#ffffff",

  inputBg: "#ffffff",
  inputFg: "#0a0a0a",
};

/** One-click brand colours, mirroring the shortcut row in the reference UI. */
export const COLOR_PRESETS = [
  { name: "WhatsPortal green", value: "#008231" },
  { name: "Blue", value: "#1a73e8" },
  { name: "Red", value: "#d93025" },
  { name: "Purple", value: "#7c5cfa" },
  { name: "Emerald", value: "#03a84e" },
  { name: "Slate", value: "#334155" },
];

/** Every per-surface control, shown under Advanced. */
export const THEME_FIELDS = [
  {
    key: "title",
    label: "Chat window title",
    group: "Chat window",
    type: "text",
  },

  { key: "launcherIcon", label: "Icon colour", group: "Launcher" },
  { key: "launcherBg", label: "Icon background", group: "Launcher" },

  { key: "headerBg", label: "Title background", group: "Header" },
  { key: "headerFg", label: "Title colour", group: "Header" },

  { key: "bodyBg", label: "Body background", group: "Body" },
  {
    key: "panelBg",
    label: "Panel background",
    group: "Body",
    hint: "Behind the header, composer and footer",
  },
  { key: "avatarBg", label: "Body icon background", group: "Body" },
  { key: "bubbleBg", label: "Chat bubble background", group: "Body" },
  { key: "bubbleFg", label: "Chat bubble colour", group: "Body" },

  { key: "inputBg", label: "Input background", group: "Composer" },
  { key: "inputFg", label: "Input colour", group: "Composer" },
];

/** The order groups appear in the customizer. */
export const THEME_GROUPS = [
  "Chat window",
  "Launcher",
  "Header",
  "Body",
  "Composer",
];

const HEX = /^#[0-9a-f]{6}$/i;

/** Normalises loose input (a 3-digit hex, a missing `#`) to `#rrggbb`. */
export function toHex(value) {
  if (typeof value !== "string") return null;
  let hex = value.trim().toLowerCase();
  if (!hex.startsWith("#")) hex = `#${hex}`;
  if (/^#[0-9a-f]{3}$/.test(hex)) {
    hex = `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
  }
  return HEX.test(hex) ? hex : null;
}

/**
 * The digits WhatsApp wants: no `+`, no spaces, country code included.
 *
 * Returns "" for anything outside the E.164 length bounds rather than a
 * best-effort guess — a half-typed number must not produce a live link to
 * whoever happens to own that prefix.
 */
export function phoneDigits(value) {
  const digits = String(value ?? "").replace(/\D/g, "");
  return digits.length >= 8 && digits.length <= 15 ? digits : "";
}

export function isValidPhone(value) {
  return phoneDigits(value) !== "";
}

/**
 * The `wa.me` deep link for a message, or null when no usable number is set —
 * callers stay inert in that case rather than opening a broken tab.
 */
export function whatsappHref(theme, text) {
  const digits = phoneDigits(theme?.phone);
  if (!digits) return null;
  const body = String(text ?? "").trim();
  return body
    ? `https://wa.me/${digits}?text=${encodeURIComponent(body)}`
    : `https://wa.me/${digits}`;
}

/** WCAG relative luminance of an `#rrggbb` colour. */
function relativeLuminance(hex) {
  const safe = toHex(hex) ?? "#000000";
  const channel = (offset) => {
    const c = parseInt(safe.slice(offset, offset + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(1) + 0.7152 * channel(3) + 0.0722 * channel(5);
}

/** WCAG contrast ratio between two colours, 1 (identical) to 21 (black/white). */
export function contrastRatio(a, b) {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

// Pure, not the near-black/near-white of the page tokens. At the crossover
// between them the best available ratio is sqrt(21) = 4.58:1 with pure ends,
// but only 4.50:1 with #0a0a0a/#fafafa — just under the AA floor.
const INK = "#000000";
const PAPER = "#ffffff";

/**
 * Picks near-black or near-white for text sitting on `hex` — so a brand colour
 * can never be applied in a way that makes the header unreadable.
 *
 * Measures both rather than thresholding luminance: a single cut-off picks the
 * wrong side for mid-greys, where the darker option can win by a full point.
 */
export function readableTextOn(hex) {
  return contrastRatio(INK, hex) >= contrastRatio(PAPER, hex) ? INK : PAPER;
}

/**
 * The foreground/background pairs a reader actually has to resolve.
 *
 * `min` is the WCAG AA floor: 4.5 for body text, 3 for the launcher glyph,
 * which is a graphic rather than text.
 */
export const THEME_CONTRAST_PAIRS = [
  { fg: "headerFg", bg: "headerBg", label: "Header title", min: 4.5 },
  { fg: "launcherIcon", bg: "launcherBg", label: "Launcher icon", min: 3 },
  { fg: "bubbleFg", bg: "bubbleBg", label: "Chat bubble text", min: 4.5 },
  { fg: "inputFg", bg: "inputBg", label: "Input text", min: 4.5 },
  { fg: "launcherBg", bg: "bubbleBg", label: "Quick-reply chips", min: 4.5 },
];

/** The pairs currently below their AA floor, worst first. */
export function failingContrast(theme) {
  const t = normalizeTheme(theme);
  return THEME_CONTRAST_PAIRS.map((pair) => ({
    ...pair,
    ratio: contrastRatio(t[pair.fg], t[pair.bg]),
  }))
    .filter((pair) => pair.ratio < pair.min)
    .sort((a, b) => a.ratio - b.ratio);
}

/**
 * The single colour the preset row and hex field edit.
 *
 * There is no separate "brand" field to keep in sync — picking a brand colour
 * is a bulk edit of the granular ones, so the eleven pickers stay the only
 * source of truth and precedence never comes into question.
 */
export function brandColorOf(theme) {
  return normalizeTheme(theme).launcherBg;
}

/** The granular values a brand colour writes. */
export function brandColorPatch(hex) {
  const brand = toHex(hex);
  if (!brand) return null;
  const onBrand = readableTextOn(brand);
  return {
    launcherBg: brand,
    launcherIcon: onBrand,
    headerBg: brand,
    headerFg: onBrand,
  };
}

function normalizeSuggestions(value) {
  if (!Array.isArray(value)) return DEFAULT_THEME.suggestedMessages;
  // Both caps are enforced here, not just in the editor: a pasted config is an
  // equally real way to arrive at nine chips of paragraph-length text.
  return value
    .filter((item) => item && typeof item.text === "string")
    .slice(0, MAX_MESSAGES)
    .map((item, index) => ({
      id: typeof item.id === "string" ? item.id : `msg-${index}`,
      text: item.text.slice(0, MAX_SUGGESTION_LENGTH),
    }));
}

/**
 * Fills in anything a stored theme is missing, so an older saved blob can never
 * hand a component an `undefined` custom property or a malformed list.
 */
export function normalizeTheme(theme) {
  const merged = { ...DEFAULT_THEME, ...(theme ?? {}) };
  merged.suggestedMessages = normalizeSuggestions(merged.suggestedMessages);

  merged.welcomeMessage = String(merged.welcomeMessage ?? "").slice(
    0,
    MAX_WELCOME_LENGTH,
  );
  merged.phone = String(merged.phone ?? "")
    .trim()
    .slice(0, MAX_PHONE_LENGTH);
  merged.askVisitorPhone = merged.askVisitorPhone === true;

  if (!["light", "dark", "auto"].includes(merged.scheme)) {
    merged.scheme = DEFAULT_THEME.scheme;
  }
  if (merged.side !== "left" && merged.side !== "right") {
    merged.side = DEFAULT_THEME.side;
  }
  merged.offsetX = clampOffset(merged.offsetX, DEFAULT_THEME.offsetX);
  merged.offsetY = clampOffset(merged.offsetY, DEFAULT_THEME.offsetY);

  return merged;
}

/** The furthest either offset can push the launcher from its corner. */
export const MAX_OFFSET = 200;

/** Offsets come from a number input, so guard against blanks and silly values. */
function clampOffset(value, fallback) {
  if (value === "" || value === null || value === undefined) return fallback;
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(MAX_OFFSET, Math.max(0, Math.round(n)));
}

/**
 * Dark surfaces, derived rather than configured.
 *
 * A second full palette would double every control for a case most customers
 * never touch. Instead the neutral surfaces map onto a dark ramp carrying a
 * trace of the brand colour, and the brand itself is left alone — it is chosen
 * to stand out against a page, which is exactly what it must do here.
 */
function darkSurfaces(t) {
  const tint = (base, pct) => `color-mix(in srgb, ${t.launcherBg} ${pct}%, ${base})`;
  const fg = "#ededed";

  return {
    panelBg: tint("#0f0f0f", 4),
    bodyBg: tint("#151515", 5),
    bubbleBg: tint("#202020", 6),
    avatarBg: tint("#202020", 6),
    inputBg: tint("#191919", 5),
    bubbleFg: fg,
    inputFg: fg,
    bubbleMuted: `color-mix(in srgb, ${fg}, transparent 35%)`,
    panelMuted: `color-mix(in srgb, ${fg}, transparent 45%)`,
    border: "color-mix(in srgb, #ffffff, transparent 88%)",
  };
}

/**
 * Turns a theme into the inline style applied at the widget root.
 *
 * A few values aren't picked directly — hover states, muted text and hairline
 * borders are mixed from the ones that are, so the widget stays self-consistent
 * at any palette instead of leaning on the page's light/dark tokens.
 */
export function themeToCssVars(theme, { dark = false } = {}) {
  const t = normalizeTheme(theme);

  const surface = dark
    ? darkSurfaces(t)
    : {
        panelBg: t.panelBg,
        bodyBg: t.bodyBg,
        bubbleBg: t.bubbleBg,
        avatarBg: t.avatarBg,
        inputBg: t.inputBg,
        bubbleFg: t.bubbleFg,
        inputFg: t.inputFg,
        bubbleMuted: `color-mix(in srgb, ${t.bubbleFg}, transparent 35%)`,
        panelMuted: `color-mix(in srgb, ${t.inputFg}, transparent 45%)`,
        border: `color-mix(in srgb, ${t.inputFg}, transparent 88%)`,
      };

  return {
    // Placement. One side is `auto` so the other wins.
    "--wp-left": t.side === "left" ? `${t.offsetX}px` : "auto",
    "--wp-right": t.side === "left" ? "auto" : `${t.offsetX}px`,
    "--wp-offset-y": `${t.offsetY}px`,
    // The panel clears the 56px launcher plus a gap.
    "--wp-panel-offset-y": `${t.offsetY + 72}px`,

    "--wp-launcher-bg": t.launcherBg,
    "--wp-launcher-bg-hover": `color-mix(in oklab, ${t.launcherBg}, black 10%)`,
    "--wp-launcher-icon": t.launcherIcon,

    "--wp-header-bg": t.headerBg,
    "--wp-header-fg": t.headerFg,
    "--wp-header-muted": `color-mix(in srgb, ${t.headerFg}, transparent 25%)`,

    "--wp-body-bg": surface.bodyBg,
    "--wp-avatar-bg": surface.avatarBg,
    "--wp-bubble-bg": surface.bubbleBg,
    "--wp-bubble-fg": surface.bubbleFg,
    "--wp-bubble-muted": surface.bubbleMuted,

    "--wp-panel-bg": surface.panelBg,
    "--wp-panel-fg": surface.inputFg,
    "--wp-panel-muted": surface.panelMuted,
    "--wp-border": surface.border,

    "--wp-input-bg": surface.inputBg,
    "--wp-input-fg": surface.inputFg,
  };
}
