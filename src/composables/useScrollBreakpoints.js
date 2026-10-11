/** Matches SCSS `$screen-mobile-max` (639px). */
export function isMobileViewport() {
  return window.matchMedia('(max-width: 639px)').matches
}
