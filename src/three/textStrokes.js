import opentype from 'opentype.js'
import { buildCharacterSketchStrokes } from '@/three/characterSketch.js'
import { samplePathD } from '@/three/pathSamples.js'
import { publicUrl } from '@/utils/publicUrl.js'

const FONT_URLS = {
  poster: publicUrl('fonts/Anton-Regular.ttf'),
  serifItalic: publicUrl('fonts/InstrumentSerif-Italic.ttf'),
}

const fontCache = new Map()

async function loadFont(key) {
  if (fontCache.has(key)) return fontCache.get(key)
  const url = FONT_URLS[key]
  const promise = fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error(`Font load failed (${key}): ${res.status}`)
      return res.arrayBuffer()
    })
    .then((buffer) => {
      const font = opentype.parse(buffer)
      if (!font?.charToGlyph) throw new Error(`Font parse failed (${key})`)
      return font
    })
  fontCache.set(key, promise)
  return promise
}

function splitPathData(d) {
  if (!d) return []
  return d
    .split(/(?=M)/i)
    .map((s) => s.trim())
    .filter((s) => s.length > 1)
}

function dToPoints(d, zBase, steps, baselineY) {
  return samplePathD(d, steps).map((p, i) => ({
    x: p.x,
    y: 2 * baselineY - p.y,
    z: zBase + Math.sin(i * 0.22) * 0.035 + (i % 7) * 0.004,
  }))
}

function pathToStrokes(path, idBase, color, zBase, baselineY, steps = 52) {
  const contours = splitPathData(path.toPathData(2))
  const strokes = []
  contours.forEach((contour, j) => {
    const points = dToPoints(contour, zBase + j * 0.018, steps, baselineY)
    if (points.length < 2) return
    strokes.push({
      id: `${idBase}-c${j}`,
      color,
      points,
      durationMs: Math.min(78, Math.max(28, points.length * 1.05)),
    })
  })
  return strokes
}

function charBoxesFromEl(el, frameRect) {
  if (!el?.firstChild || el.firstChild.nodeType !== Node.TEXT_NODE) return []
  const node = el.firstChild
  const text = node.textContent ?? ''
  const boxes = []
  for (let i = 0; i < text.length; i++) {
    const range = document.createRange()
    range.setStart(node, i)
    range.setEnd(node, i + 1)
    const r = range.getBoundingClientRect()
    if (r.width < 0.5 && text[i] !== ' ') continue
    boxes.push({
      char: text[i],
      index: i,
      x: r.left - frameRect.left,
      y: r.top - frameRect.top,
      w: r.width,
      h: r.height,
    })
  }
  return boxes
}

function layoutGlyphs(text, font, fontSize, charBoxes, fallbackBox) {
  const glyphs = []
  const baselineY = (box) => box.y + box.h * 0.82

  if (charBoxes.length) {
    for (const box of charBoxes) {
      if (box.char === ' ') continue
      const glyph = font.charToGlyph(box.char)
      const base = baselineY(box)
      const path = glyph.getPath(box.x, base, fontSize)
      glyphs.push({ char: box.char, index: box.index, path, baselineY: base })
    }
    return glyphs
  }

  const box = fallbackBox
  const width = font.getAdvanceWidth(text, fontSize)
  let penX = box.x + box.w / 2 - width / 2
  const baseY = baselineY(box)

  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    if (char === ' ') {
      penX += font.getAdvanceWidth(char, fontSize)
      continue
    }
    const glyph = font.charToGlyph(char)
    glyphs.push({
      char,
      index: i,
      path: glyph.getPath(penX, baseY, fontSize),
      baselineY: baseY,
    })
    penX += font.getAdvanceWidth(char, fontSize)
  }

  return glyphs
}

function glyphsToStrokes(glyphs, prefix, color, zBase) {
  const strokes = []
  for (const g of glyphs) {
    strokes.push(
      ...pathToStrokes(
        g.path,
        `${prefix}-${g.index}-${g.char}`,
        color,
        zBase + g.index * 0.01,
        g.baselineY,
      ),
    )
  }
  return strokes
}

export function measureHeroTextLayout(frame) {
  const fr = frame.getBoundingClientRect()
  const pick = (sel) => {
    const el = frame.querySelector(sel)
    if (!el) return null
    const r = el.getBoundingClientRect()
    const cs = getComputedStyle(el)
    return {
      x: r.left - fr.left,
      y: r.top - fr.top,
      w: r.width,
      h: r.height,
      fontSize: cs.fontSize,
      el,
    }
  }

  const tag = pick('.tagline')
  const dev = pick('.developer')

  return {
    tag: tag
      ? {
          ...tag,
          chars: charBoxesFromEl(tag.el, fr),
        }
      : null,
    dev: dev
      ? {
          ...dev,
          chars: charBoxesFromEl(dev.el, fr),
        }
      : null,
  }
}

export async function buildHeroStrokesFromText({ layout, tagline, developer }) {
  const strokes = []

  const [fontSerif, fontPoster] = await Promise.all([
    loadFont('serifItalic'),
    loadFont('poster'),
  ])

  if (layout.tag && tagline) {
    const tagSize = parseFloat(layout.tag.fontSize) || 48
    const tagGlyphs = layoutGlyphs(
      tagline,
      fontSerif,
      tagSize,
      layout.tag.chars ?? [],
      layout.tag,
    )
    strokes.push(...glyphsToStrokes(tagGlyphs, 'tag', 0x151518, 0.06))
  }

  if (layout.dev && developer) {
    const devSize = parseFloat(layout.dev.fontSize) || 96
    const devGlyphs = layoutGlyphs(
      developer,
      fontPoster,
      devSize,
      layout.dev.chars ?? [],
      layout.dev,
    )
    strokes.push(...glyphsToStrokes(devGlyphs, 'dev', 0x2f4bff, 0.02))
  }

  if (layout.character) {
    strokes.push(
      ...(await buildCharacterSketchStrokes(layout.character, layout.frameHeight)),
    )
  }

  for (const guide of layout.guides ?? []) {
    strokes.push({
      id: guide.id,
      color: guide.colorHex ?? 0x151518,
      opacity: guide.opacity ?? 0.7,
      points: samplePathD(guide.d, 44).map((p, i) => ({
        x: p.x,
        y: p.y,
        z: 0.03 + (i % 3) * 0.02,
      })),
      durationMs: 38,
      fast: true,
    })
  }

  return strokes
}
