const TEXTURE_URL = '/hero-model.png'

/** Matches Portrait.js — full hero-model.png */
function portraitSourceRect(imgW, imgH) {
  return { sx: 0, sy: 0, sw: imgW, sh: imgH }
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`Image load failed: ${src}`))
    img.src = src
  })
}

function alphaAt(data, w, h, x, y) {
  if (x < 0 || y < 0 || x >= w || y >= h) return 0
  return data[(y * w + x) * 4 + 3]
}

function blurAlphaChannel(data, w, h, radius = 1) {
  const out = new Uint8Array(w * h)
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let sum = 0
      let n = 0
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          sum += alphaAt(data, w, h, x + dx, y + dy)
          n++
        }
      }
      out[y * w + x] = sum / n
    }
  }
  return out
}

function luminanceAt(data, w, x, y) {
  const i = (y * w + x) * 4
  const r = data[i]
  const g = data[i + 1]
  const b = data[i + 2]
  return 0.299 * r + 0.587 * g + 0.114 * b
}

function lerp(a, b, t) {
  return a + (b - a) * t
}

function interpEdge(v0, v1, x0, y0, x1, y1, threshold) {
  if (Math.abs(v0 - v1) < 0.001) return { x: (x0 + x1) / 2, y: (y0 + y1) / 2 }
  const t = (threshold - v0) / (v1 - v0)
  return { x: lerp(x0, x1, t), y: lerp(y0, y1, t) }
}

const MS_EDGES = [
  [],
  [[3, 0]],
  [[0, 1]],
  [[3, 1]],
  [[1, 2]],
  [
    [3, 0],
    [1, 2],
  ],
  [[0, 2]],
  [[3, 2]],
  [[2, 3]],
  [[2, 0]],
  [
    [0, 1],
    [2, 3],
  ],
  [[2, 1]],
  [[1, 3]],
  [[1, 0]],
  [[2, 0]],
  [],
]

function marchingSquaresContours(alpha, w, h, threshold) {
  const segments = []

  for (let py = 0; py < h - 1; py++) {
    for (let px = 0; px < w - 1; px++) {
      const v0 = alpha[py * w + px]
      const v1 = alpha[py * w + px + 1]
      const v2 = alpha[(py + 1) * w + px + 1]
      const v3 = alpha[(py + 1) * w + px]

      const b0 = v0 >= threshold ? 1 : 0
      const b1 = v1 >= threshold ? 1 : 0
      const b2 = v2 >= threshold ? 1 : 0
      const b3 = v3 >= threshold ? 1 : 0
      const idx = b0 | (b1 << 1) | (b2 << 2) | (b3 << 3)
      const edges = MS_EDGES[idx]
      if (!edges.length) continue

      const top = interpEdge(v0, v1, px, py, px + 1, py, threshold)
      const right = interpEdge(v1, v2, px + 1, py, px + 1, py + 1, threshold)
      const bottom = interpEdge(v3, v2, px, py + 1, px + 1, py + 1, threshold)
      const left = interpEdge(v0, v3, px, py, px, py + 1, threshold)
      const mids = [top, right, bottom, left]

      for (const [a, b] of edges) {
        segments.push([mids[a], mids[b]])
      }
    }
  }

  return linkSegments(segments)
}

function ptKey(p) {
  return `${p.x.toFixed(3)},${p.y.toFixed(3)}`
}

function linkSegments(segments) {
  const adj = new Map()

  const add = (from, to) => {
    const k = ptKey(from)
    if (!adj.has(k)) adj.set(k, [])
    adj.get(k).push({ to, from })
  }

  for (const [a, b] of segments) {
    add(a, b)
    add(b, a)
  }

  const used = new Set()
  const contours = []

  for (const [a, b] of segments) {
    const startKey = ptKey(a)
    if (used.has(`${startKey}|${ptKey(b)}`)) continue

    const path = [a]
    let prev = a
    let cur = b
    used.add(`${ptKey(prev)}|${ptKey(cur)}`)

    for (let guard = 0; guard < segments.length * 4; guard++) {
      path.push(cur)
      const nextOpts = adj.get(ptKey(cur)) || []
      const next = nextOpts.find(
        (o) =>
          ptKey(o.to) !== ptKey(prev) &&
          !used.has(`${ptKey(cur)}|${ptKey(o.to)}`),
      )
      if (!next) break
      used.add(`${ptKey(cur)}|${ptKey(next.to)}`)
      prev = cur
      cur = next.to
      if (ptKey(cur) === ptKey(path[0]) && path.length > 3) break
    }

    if (path.length >= 4) contours.push(path)
  }

  return contours
}

function rdp(points, epsilon) {
  if (points.length < 3) return points

  const sq = (n) => n * n
  const distToSeg = (p, a, b) => {
    const dx = b.px - a.px
    const dy = b.py - a.py
    if (dx === 0 && dy === 0) return Math.hypot(p.px - a.px, p.py - a.py)
    const t = Math.max(0, Math.min(1, ((p.px - a.px) * dx + (p.py - a.py) * dy) / (sq(dx) + sq(dy))))
    return Math.hypot(p.px - (a.px + t * dx), p.py - (a.py + t * dy))
  }

  let maxD = 0
  let idx = 0
  const end = points.length - 1
  for (let i = 1; i < end; i++) {
    const d = distToSeg(points[i], points[0], points[end])
    if (d > maxD) {
      maxD = d
      idx = i
    }
  }

  if (maxD <= epsilon) return [points[0], points[end]]
  const left = rdp(points.slice(0, idx + 1), epsilon)
  const right = rdp(points.slice(idx), epsilon)
  return left.slice(0, -1).concat(right)
}

function resamplePolyline(points, step) {
  if (points.length < 2) return points
  const out = [points[0]]
  let carry = 0

  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1]
    const b = points[i]
    const segLen = Math.hypot(b.px - a.px, b.py - a.py)
    if (segLen < 0.001) continue
    let t = (step - carry) / segLen
    while (t <= 1) {
      out.push({
        px: lerp(a.px, b.px, t),
        py: lerp(a.py, b.py, t),
      })
      t += step / segLen
    }
    carry = (carry + segLen) % step
  }
  const last = points[points.length - 1]
  if (out[out.length - 1].px !== last.px || out[out.length - 1].py !== last.py) {
    out.push(last)
  }
  return out
}

function splitAtCorners(points, angleDeg = 48) {
  if (points.length < 4) return [points]
  const chunks = []
  let start = 0

  for (let i = 1; i < points.length - 1; i++) {
    const a = points[i - 1]
    const b = points[i]
    const c = points[i + 1]
    const v1x = b.px - a.px
    const v1y = b.py - a.py
    const v2x = c.px - b.px
    const v2y = c.py - b.py
    const m1 = Math.hypot(v1x, v1y)
    const m2 = Math.hypot(v2x, v2y)
    if (m1 < 0.01 || m2 < 0.01) continue
    const dot = (v1x * v2x + v1y * v2y) / (m1 * m2)
    const ang = (Math.acos(Math.max(-1, Math.min(1, dot))) * 180) / Math.PI
    if (ang > angleDeg) {
      chunks.push(points.slice(start, i + 1))
      start = i
    }
  }
  chunks.push(points.slice(start))
  return chunks.filter((c) => c.length >= 2)
}

function contourToStrokes(
  contour,
  mapX,
  mapY,
  idBase,
  color,
  opacity,
  zBase,
  durationScale,
  options = {},
) {
  const { epsilon, step, cornerDeg } = options
  const raw = contour.map((p) => ({ px: p.x, py: p.y }))
  const simplified = rdp(raw, epsilon ?? 0.38)
  const dense = resamplePolyline(simplified, step ?? 0.52)
  const parts = options.singleStroke
    ? [dense.length >= 2 ? dense : simplified]
    : splitAtCorners(dense, cornerDeg ?? 40)
  const strokes = []

  parts.forEach((part, i) => {
    const points = part.map((p, j) => ({
      x: mapX(p.px),
      y: mapY(p.py),
      z: zBase + Math.sin(j * 0.35) * 0.035 + (i % 3) * 0.008,
    }))
    if (points.length < 2) return
    strokes.push({
      id: `${idBase}-${i}`,
      color,
      opacity,
      points,
      durationMs: Math.min(
        options.maxDuration ?? 72,
        Math.max(14, points.length * durationScale),
      ),
      fast: options.fast ?? points.length < 12,
    })
  })

  return strokes
}

function internalDetailStrokes(alpha, w, h, threshold, mapX, mapY, idBase, opts = {}) {
  const candidates = []
  const grid = opts.grid ?? 1
  const minMag = opts.minMag ?? 58
  const pyMax = opts.pyMax ?? h - 2

  for (let py = 2; py < pyMax; py += grid) {
    for (let px = 2; px < w - 2; px += grid) {
      const c = alpha[py * w + px]
      if (c < threshold) continue
      const l = alpha[py * w + px - 1]
      const r = alpha[py * w + px + 1]
      const u = alpha[(py - 1) * w + px]
      const d = alpha[(py + 1) * w + px]
      if (l < threshold || r < threshold || u < threshold || d < threshold) continue

      const gx = r - l
      const gy = d - u
      const mag = Math.hypot(gx, gy)
      if (mag < minMag) continue

      candidates.push({ px, py, gx, gy, mag })
    }
  }

  candidates.sort((a, b) => b.mag - a.mag)
  const cap = opts.cap ?? 160
  const strokes = []

  candidates.slice(0, cap).forEach((c, n) => {
    const len = (opts.lineLen ?? 2.1) / c.mag
    const nx = c.gx * len
    const ny = c.gy * len
    const z = 0.08 + (c.py / h) * 0.1
    strokes.push({
      id: `${idBase}-g-${n}`,
      color: opts.color ?? 0x252530,
      opacity: opts.opacity ?? 0.48,
      points: [
        { x: mapX(c.px - nx), y: mapY(c.py - ny), z },
        { x: mapX(c.px + nx), y: mapY(c.py + ny), z: z + 0.015 },
      ],
      durationMs: 22,
      fast: true,
    })
  })

  return strokes
}

function luminanceDetailStrokes(data, alpha, w, h, alphaThreshold, mapX, mapY, idBase, opts = {}) {
  const candidates = []
  const pyMax = opts.pyMax ?? h - 3
  const pyMin = opts.pyMin ?? 3
  const minMag = opts.minMag ?? 14

  for (let py = pyMin; py < pyMax; py++) {
    for (let px = 3; px < w - 3; px++) {
      if (alpha[py * w + px] < alphaThreshold) continue
      const gx =
        luminanceAt(data, w, px + 1, py) - luminanceAt(data, w, px - 1, py)
      const gy =
        luminanceAt(data, w, px, py + 1) - luminanceAt(data, w, px, py - 1)
      const mag = Math.hypot(gx, gy)
      if (mag < minMag) continue
      candidates.push({ px, py, gx, gy, mag })
    }
  }

  candidates.sort((a, b) => b.mag - a.mag)
  const strokes = []
  const cap = opts.cap ?? 120
  const lineLen = opts.lineLen ?? 2.6

  candidates.slice(0, cap).forEach((c, n) => {
    const len = lineLen / c.mag
    const nx = c.gx * len
    const ny = c.gy * len
    const z = 0.09 + (c.py / h) * 0.08
    strokes.push({
      id: `${idBase}-lum-${n}`,
      color: opts.color ?? 0x3a3a48,
      opacity: opts.opacity ?? 0.38,
      points: [
        { x: mapX(c.px - nx), y: mapY(c.py - ny), z },
        { x: mapX(c.px + nx), y: mapY(c.py + ny), z: z + 0.012 },
      ],
      durationMs: opts.strokeMs ?? 20,
      fast: true,
    })
  })

  return strokes
}

/** After full silhouette: quick eyes / nose / mouth only */
function faceFeatureStrokes(data, alpha, w, h, fillThreshold, mapX, mapY) {
  const headH = Math.floor(h * 0.46)
  const strokes = []
  const dark = new Uint8Array(w * h)
  const fastOpts = {
    epsilon: 0.55,
    step: 0.85,
    singleStroke: true,
    maxDuration: 11,
    fast: true,
  }

  for (let py = 0; py < headH; py++) {
    for (let px = 0; px < w; px++) {
      const a = alpha[py * w + px]
      if (a < fillThreshold) continue
      const lum = luminanceAt(data, w, px, py)
      dark[py * w + px] = lum < 94 ? 255 : 0
    }
  }

  const darkContours = marchingSquaresContours(dark, w, h, 127)
  darkContours.sort((a, b) => b.length - a.length)

  for (let i = 0; i < Math.min(darkContours.length, 4); i++) {
    const c = darkContours[i]
    if (c.length < 4) continue
    const avgPy = c.reduce((s, p) => s + p.y, 0) / c.length
    if (avgPy > headH * 1.05) continue
    strokes.push(
      ...contourToStrokes(
        c,
        mapX,
        mapY,
        `face-feat-${i}`,
        0x151518,
        0.72,
        0.13,
        0.75,
        fastOpts,
      ),
    )
  }

  strokes.push(
    ...luminanceDetailStrokes(data, alpha, w, h, fillThreshold, mapX, mapY, 'face-lum', {
      pyMax: headH + 1,
      pyMin: Math.floor(headH * 0.15),
      minMag: 12,
      cap: 14,
      lineLen: 2.2,
      color: 0x22222c,
      opacity: 0.48,
      strokeMs: 9,
    }),
  )

  return strokes
}

function midToneContourStrokes(alpha, w, h, thresholds, mapX, mapY, idBase, pyMax = h) {
  const strokes = []
  thresholds.forEach((t, ti) => {
    const contours = marchingSquaresContours(alpha, w, h, t)
    contours.sort((a, b) => b.length - a.length)
    for (let i = 0; i < Math.min(contours.length, 2); i++) {
      const c = contours[i]
      if (c.length < 14) continue
      const avgPy = c.reduce((s, p) => s + p.y, 0) / c.length
      if (idBase.startsWith('face-') && avgPy > pyMax) continue
      strokes.push(
        ...contourToStrokes(
          c,
          mapX,
          mapY,
          `${idBase}-iso-${t}-${i}`,
          ti % 2 === 0 ? 0x22222c : 0x2a2a36,
          0.32 + ti * 0.04,
          0.06 + ti * 0.008,
          1.15,
          { epsilon: 0.42, step: 0.58, cornerDeg: 44 },
        ),
      )
    }
  })
  return strokes
}

export async function buildCharacterSketchStrokes(box, _frameHeight) {
  if (!box?.w || !box?.h) return []

  let img
  try {
    img = await loadImage(TEXTURE_URL)
  } catch {
    return []
  }

  const { sx, sy, sw, sh } = portraitSourceRect(img.naturalWidth, img.naturalHeight)
  const tw = 176
  const th = Math.max(48, Math.round((sh / sw) * tw))
  const canvas = document.createElement('canvas')
  canvas.width = tw
  canvas.height = th
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, tw, th)
  const { data } = ctx.getImageData(0, 0, tw, th)
  const alphaSharp = new Uint8Array(tw * th)
  for (let i = 0; i < tw * th; i++) alphaSharp[i] = data[i * 4 + 3]
  const alpha = blurAlphaChannel(data, tw, th, 1)

  const { x, y, w, h } = box
  const mapX = (px) => x + (px / tw) * w
  const mapY = (py) => y + (py / th) * h

  const outerThreshold = 54
  const fillThreshold = outerThreshold + 8

  const outerContours = marchingSquaresContours(alphaSharp, tw, th, outerThreshold)
  outerContours.sort((a, b) => b.length - a.length)

  const strokes = []
  const silOpts = {
    epsilon: 0.36,
    step: 0.58,
    cornerDeg: 46,
    maxDuration: 56,
    fast: false,
  }
  const formOpts = {
    epsilon: 0.44,
    step: 0.68,
    cornerDeg: 52,
    singleStroke: true,
    maxDuration: 44,
    fast: true,
  }

  const main = outerContours[0]
  if (main) {
    strokes.push(
      ...contourToStrokes(
        main,
        mapX,
        mapY,
        'char-sil',
        0x2f4bff,
        0.92,
        0.11,
        0.82,
        silOpts,
      ),
    )
  }

  const formContours = marchingSquaresContours(alpha, tw, th, 74)
  formContours.sort((a, b) => b.length - a.length)
  const formMain = formContours[0]
  if (formMain && formMain.length >= 12) {
    strokes.push(
      ...contourToStrokes(
        formMain,
        mapX,
        mapY,
        'char-form',
        0x2f4bff,
        0.58,
        0.1,
        0.72,
        formOpts,
      ),
    )
  }

  for (let i = 1; i < Math.min(outerContours.length, 3); i++) {
    const c = outerContours[i]
    if (c.length < 10) continue
    strokes.push(
      ...contourToStrokes(
        c,
        mapX,
        mapY,
        `char-hole-${i}`,
        0x2f4bff,
        0.72,
        0.09,
        0.62,
        { ...formOpts, maxDuration: 34 },
      ),
    )
  }

  strokes.push(
    ...faceFeatureStrokes(data, alpha, tw, th, fillThreshold, mapX, mapY),
  )

  return strokes
}
