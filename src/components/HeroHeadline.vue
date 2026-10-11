<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

const props = defineProps({
  tagline: { type: String, required: true },
  developer: { type: String, required: true },
  visible: { type: Boolean, default: false },
})

const layer = ref(null)
const developerEl = ref(null)
const taglineEl = ref(null)
const motion = ref({ x: 0, y: 0 })
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

const onPointerMove = (event) => {
  if (!props.visible || reduced) return
  const frame = layer.value?.closest('.hero-frame')
  if (!frame) return
  const rect = frame.getBoundingClientRect()
  const nx = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)
  const ny = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)
  motion.value = {
    x: Math.max(-1, Math.min(1, nx)),
    y: Math.max(-1, Math.min(1, ny)),
  }
}

const taglineStyle = computed(() => {
  if (!props.visible || reduced) {
    return { transform: 'translate3d(0, 0, 0)' }
  }
  const { x, y } = motion.value
  return {
    transform: [
      'perspective(1200px)',
      `rotateX(${y * -2.2}deg)`,
      `rotateY(${x * 3.2}deg)`,
      `translate3d(${x * 14}px, ${y * 10}px, 0)`,
    ].join(' '),
  }
})

watch(
  () => props.visible,
  (show) => {
    if (!show) motion.value = { x: 0, y: 0 }
  },
)

onMounted(() => {
  window.addEventListener('pointermove', onPointerMove, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('pointermove', onPointerMove)
})

defineExpose({
  get developerEl() {
    return developerEl.value
  },
  get taglineEl() {
    return taglineEl.value
  },
})
</script>

<template>
  <div ref="layer" class="hero-headline" :class="{ visible }">
    <p ref="taglineEl" class="tagline" :style="taglineStyle">{{ tagline }}</p>
    <p ref="developerEl" class="developer">{{ developer }}</p>
  </div>
</template>

<style lang="scss" scoped>
.hero-headline {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.55s ease;
}

.hero-headline.visible {
  opacity: 1;
}

.tagline {
  position: absolute;
  z-index: 2;
  isolation: isolate;
  left: 0;
  right: 0;
  top: clamp(#{rem(60)}, 14vh, #{rem(92)});
  padding-inline: rem(12);
  text-align: center;
  font-family: var(--font-serif);
  font-style: italic;
  font-weight: 400;
  font-size: clamp(#{rem(46)}, 8cqi, #{rem(100)});
  line-height: 0.95;
  color: var(--ink);
  transform-style: preserve-3d;
  will-change: transform, opacity;
}

.developer {
  position: absolute;
  z-index: 0;
  left: 0;
  right: 0;
  top: clamp(#{rem(112)}, 28vh, #{rem(168)});
  padding-inline: rem(12);
  text-align: center;
  font-family: var(--font-poster);
  font-size: clamp(#{rem(72)}, 16cqi, #{rem(192)});
  line-height: 0.84;
  letter-spacing: 0.015em;
  color: var(--blue);
  white-space: nowrap;
  max-width: 100%;
  overflow: hidden;
  text-overflow: clip;
  will-change: transform;
  transform-origin: 50% 40%;
}

@include tablet {
  .tagline {
    top: clamp(#{rem(48)}, 12vh, #{rem(92)});
    font-size: clamp(#{rem(28)}, 10vw, #{rem(52)});
  }

  .developer {
    top: clamp(#{rem(96)}, 24vh, #{rem(128)});
    font-size: clamp(#{rem(32)}, 14vw, #{rem(80)});
    letter-spacing: 0.01em;
  }
}

@include mobile {
  .tagline {
    top: clamp(#{rem(44)}, 12vh, #{rem(64)});
    font-size: clamp(#{rem(32)}, 10vw, #{rem(52)});
  }

  .developer {
    top: clamp(#{rem(88)}, 24vh, #{rem(120)});
    font-size: clamp(#{rem(44)}, 16vw, #{rem(80)});
    letter-spacing: 0.012em;
  }
}
</style>
