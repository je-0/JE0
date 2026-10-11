<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { Portrait } from '@/three/Portrait.js'
import { publicUrl } from '@/utils/publicUrl.js'

const heroModelUrl = publicUrl('hero-model.png')

const props = defineProps({
  introReady: { type: Boolean, default: false },
})

const emit = defineEmits(['shown'])

const wrap = ref(null)
const canvas = ref(null)
const active = ref(false)
const useFallback = ref(false)

let portrait = null

const begin = () => {
  if (!props.introReady || active.value) return
  if (portrait?.ready) {
    active.value = true
    requestAnimationFrame(() => {
      portrait?.startReveal()
      window.setTimeout(() => {
        if (!portrait?.revealedOnce) emit('shown')
      }, 2200)
    })
    return
  }
  if (useFallback.value) {
    active.value = true
    window.setTimeout(() => emit('shown'), 920)
  }
}

watch(
  () => props.introReady,
  (ready) => {
    if (ready) begin()
  },
)

const onTap = () => {
  portrait?.pulse()
  portrait?.hop()
}

onMounted(() => {
  const el = canvas.value
  if (!el) {
    useFallback.value = true
    begin()
    return
  }

  try {
    portrait = new Portrait(el)
    portrait.onRevealed = () => emit('shown')
    const revealTimer = window.setInterval(() => {
      if (portrait?.ready) {
        window.clearInterval(revealTimer)
        begin()
      }
    }, 40)
    window.setTimeout(() => {
      window.clearInterval(revealTimer)
      if (!portrait?.ready) useFallback.value = true
      begin()
    }, 8000)
  } catch (error) {
    console.error('[HeroCharacter] WebGL init failed', error)
    useFallback.value = true
    begin()
  }
})

onUnmounted(() => {
  portrait?.dispose()
  portrait = null
})
</script>

<template>
  <div ref="wrap" class="figure" :class="{ active }">
    <canvas
      ref="canvas"
      class="gl"
      :class="{ hidden: useFallback }"
      aria-hidden="true"
    />
    <button
      type="button"
      class="figure-hit"
      aria-label="Character"
      @click="onTap"
    />
    <img
      v-if="useFallback"
      class="render fallback"
      :src="heroModelUrl"
      width="432"
      height="578"
      alt="Developer character"
      decoding="async"
      draggable="false"
    />
  </div>
</template>

<style lang="scss" scoped>
.figure {
  position: relative;
  width: 100%;
  height: min(62vh, 1040px);
  background: transparent;
  overflow: visible;
  user-select: none;
}

.figure-hit {
  position: absolute;
  inset: 0;
  z-index: 1;
  margin: 0;
  padding: 0;
  border: none;
  background: transparent;
  cursor: default;
  pointer-events: auto;
}

.gl {
  display: block;
  width: 100%;
  height: 100%;
}

.gl.hidden {
  display: none;
}

.render.fallback {
  position: absolute;
  left: 50%;
  bottom: 0;
  width: 118%;
  height: 118%;
  max-width: none;
  transform: translateX(-50%);
  object-fit: cover;
  object-position: center bottom;
  pointer-events: none;
  filter: drop-shadow(0 20px 28px rgba(18, 22, 40, 0.16));
  opacity: 0;
  transition: opacity 0.9s ease;
}

.figure.active .render.fallback {
  opacity: 1;
}
</style>
