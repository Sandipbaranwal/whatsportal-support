/**
 * Joins truthy class names. Small on purpose — the widget has no dependency
 * on a class-merging library, so keep conditional classes non-overlapping.
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}
