/** Public folder asset URL (respects Vite `base`, e.g. `/JE0/` on GitHub Pages). */
export function publicUrl(path) {
  const file = path.replace(/^\//, '')
  const base = import.meta.env.BASE_URL || '/'
  return `${base}${file}`
}
