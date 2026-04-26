/**
 * Lightweight class name combiner. Filters falsy values.
 * Drop-in for clsx without the extra dependency.
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
