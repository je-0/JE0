<script setup>
import { IntroSketch } from '@/three/IntroSketch.js'
import { roundedRectPath } from '@/three/pathSamples.js'
import { buildHeroStrokesFromText, measureHeroTextLayout } from '@/three/textStrokes.js'
import { nextTick, onMounted, onUnmounted, ref } from 'vue'

const props = defineProps({
  tagline: { type: String, required: true },
  developer: { type: String, required: true },
})

const emit = defineEmits(['reveal', 'character-start', 'complete'])

const root = ref(null)
const canvas = ref(null)
const phase = ref('draw')
const overlayOpacity = ref(1)

let sketch = null
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

function measureLayout() {
  const frame = root.value?.closest('.hero-frame')
  if (!frame) return null
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
    }
  }

  const guides = []
  const spec = pick('.spec')
  const pitch = pick('.pitch')
  const chat = pick('.chat')

  if (spec) {
    guides.push({
      id: 'spec-line',
      d: `M ${spec.x} ${spec.y + 10} H ${spec.x + 40}`,
      colorHex: 0x151518,
      opacity: 0.5,
    })
  }
  if (pitch) {
    guides.push({
      id: 'pitch-line',
      d: `M ${pitch.x + pitch.w - 52} ${pitch.y + 8} H ${pitch.x + pitch.w}`,
      colorHex: 0x151518,
      opacity: 0.45,
    })
  }
  if (chat) {
    guides.push({
      id: 'chat-box',
      d: roundedRectPath(chat.x, chat.y, chat.w, chat.h, chat.h / 2),
      colorHex: 0x2f4bff,
      opacity: 0.85,
    })
  }

  const showcase = root.value?.closest('.showcase')
  const textFrame =
    showcase?.querySelector('.headline-layer .hero-frame') ?? frame
  const textLayout = measureHeroTextLayout(textFrame)

  const figureEl = showcase?.querySelector('.character-stage .figure')
  let character = null
  if (figureEl) {
    const r = figureEl.getBoundingClientRect()
    const cs = getComputedStyle(figureEl)
    character = {
      x: r.left - fr.left,
      y: r.top - fr.top,
      w: r.width,
      h: r.height,
      fontSize: cs.fontSize,
    }
  }

  return {
    frameHeight: fr.height,
    tag: textLayout.tag,
    dev: textLayout.dev,
    character,
    guides,
  }
}

function wait(ms) {
  return new Promise((r) => window.setTimeout(r, ms))
}

function revealAll() {
  emit('reveal', 'tag')
  emit('reveal', 'dev')
  emit('reveal', 'spec')
  emit('reveal', 'pitch')
  emit('reveal', 'chat')
}

function finishIntro() {
  overlayOpacity.value = 0
  return sketch?.fadeOut().then(() => {
    phase.value = 'done'
    emit('complete')
  })
}

async function runSequence() {
  try {
    if (reduced) {
      revealAll()
      emit('character-start')
      emit('complete')
      return
    }

    await nextTick()
    await wait(80)
    await document.fonts?.ready
    const layout = measureLayout()
    const el = canvas.value
    if (!layout || !el) {
      revealAll()
      emit('character-start')
      emit('complete')
      return
    }

    sketch = new IntroSketch(el)
    const strokes = await buildHeroStrokesFromText({
      layout,
      tagline: props.tagline,
      developer: props.developer,
    })
    if (!strokes.length) {
      console.warn('[HeroIntro] No sketch strokes — check fonts and layout.')
    }
    sketch.setStrokes(strokes)

    phase.value = 'draw'
    await sketch.drawAll()

    await wait(50)
    revealAll()
    emit('character-start')
    await wait(70)
    await finishIntro()
  } catch (error) {
    console.error('[HeroIntro]', error)
    revealAll()
    emit('character-start')
    emit('complete')
  }
}

onMounted(() => {
  requestAnimationFrame(() => {
    requestAnimationFrame(runSequence)
  })
})

onUnmounted(() => {
  sketch?.dispose()
  sketch = null
})
</script>

<template>
  <div
    v-if="phase !== 'done'"
    ref="root"
    class="intro-overlay"
    :style="{ opacity: overlayOpacity }"
    aria-hidden="true"
  >
    <canvas ref="canvas" class="intro-gl" />
  </div>
</template>

<style lang="scss" scoped>
.intro-overlay {
  position: absolute;
  inset: 0;
  z-index: 30;
  width: 100%;
  height: 100%;
  pointer-events: none;
  transition: opacity 0.42s ease;
}

.intro-gl {
  display: block;
  width: 100%;
  height: 100%;
}

@media (prefers-reduced-motion: reduce) {
  .intro-overlay {
    display: none;
  }
}
</style>
