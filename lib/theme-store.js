import {
  brandColorPatch,
  DEFAULT_THEME,
  normalizeTheme,
} from "./widget-theme";

const STORAGE_KEY = "wp-support-theme";

/**
 * The saved theme, modelled as an external store.
 *
 * `localStorage` genuinely is one, so `useSyncExternalStore` fits: the server
 * and the hydrating render both see `DEFAULT_THEME`, React swaps in the stored
 * value immediately after, and writes happen where the change is made rather
 * than in a trailing effect.
 */
const listeners = new Set();

let snapshot = DEFAULT_THEME;
let hasReadStorage = false;
/** Set when a write is rejected for size, so the UI can say why. */
let lastError = null;

function readStorage() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved ? normalizeTheme(JSON.parse(saved)) : DEFAULT_THEME;
  } catch {
    // Unreadable, disabled or corrupt storage — the defaults are a fine answer.
    return DEFAULT_THEME;
  }
}

function emit() {
  for (const listener of listeners) listener();
}

function commit(next) {
  snapshot = next;
  hasReadStorage = true;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    lastError = null;
  } catch (error) {
    // Quota is the realistic failure here: uploaded art is stored inline as a
    // data URL. The theme still applies for this session, it just won't be
    // remembered — say so rather than failing silently.
    lastError =
      error?.name === "QuotaExceededError"
        ? "Too large to remember — this will be lost on reload. Try a smaller image."
        : null;
  }
  emit();
}

export function subscribeToTheme(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getThemeSnapshot() {
  if (!hasReadStorage) {
    snapshot = readStorage();
    hasReadStorage = true;
  }
  return snapshot;
}

export function getThemeServerSnapshot() {
  return DEFAULT_THEME;
}

export function getThemeError() {
  return lastError;
}

/** Changes one field and persists the result. */
export function setThemeValue(key, value) {
  commit({ ...getThemeSnapshot(), [key]: value });
}

/** Applies a brand colour across the launcher and header in one edit. */
export function setBrandColor(hex) {
  const patch = brandColorPatch(hex);
  if (!patch) return;
  commit({ ...getThemeSnapshot(), ...patch });
}

/**
 * Replaces the whole theme from pasted JSON.
 *
 * Returns an error string rather than throwing — the caller is a textarea, and
 * a bad paste is an ordinary outcome there, not an exception.
 */
export function importTheme(json) {
  let parsed;
  try {
    parsed = JSON.parse(json);
  } catch {
    return "That isn't valid JSON.";
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return "Expected a JSON object of theme settings.";
  }

  // Unknown keys are dropped and missing ones filled, so a config from an older
  // or newer build still lands somewhere sensible.
  commit(normalizeTheme(parsed));
  return null;
}

/** Drops every override, including the stored copy. */
export function resetTheme() {
  snapshot = DEFAULT_THEME;
  hasReadStorage = true;
  lastError = null;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing was stored to begin with.
  }
  emit();
}
