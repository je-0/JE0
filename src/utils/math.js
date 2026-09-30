export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

export function lerp(start, end, amount) {
  return start + (end - start) * amount
}

export function mapRange(value, inMin, inMax, outMin, outMax) {
  const t = (value - inMin) / (inMax - inMin)
  return outMin + (outMax - outMin) * t
}

export function easeOutCubic(t) {
  return 1 - (1 - t) ** 3
}
