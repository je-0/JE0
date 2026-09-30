<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { lerp } from '@/utils/math'

const dot = ref(null)
const ring = ref(null)
let raf = 0
let current = { x: 0, y: 0 }
let target = { x: 0, y: 0 }
let hover = false

const onMove = (event) => {
  target.x = event.clientX
  target.y = event.clientY
}

const onOver = (event) => {
  hover = Boolean(event.target.closest('a, button'))
}

const tick = () => {
  current.x = lerp(current.x, target.x, 0.18)
  current.y = lerp(current.y, target.y, 0.18)
  if (dot.value) {
    dot.value.style.transform = `translate3d(${target.x}px, ${target.y}px, 0)`
  }
  if (ring.value) {
    ring.value.style.transform = `translate3d(${current.x}px, ${current.y}px, 0) scale(${hover ? 1.55 : 1})`
    ring.value.classList.toggle('is-hover', hover)
  }
  raf = requestAnimationFrame(tick)
}

onMounted(() => {
  window.addEventListener('pointermove', onMove)
  window.addEventListener('mouseover', onOver)
  raf = requestAnimationFrame(tick)
})

onUnmounted(() => {
  window.removeEventListener('pointermove', onMove)
  window.removeEventListener('mouseover', onOver)
  cancelAnimationFrame(raf)
})
</script>

<template>
  <div class="cursor-dot" ref="dot" />
  <div class="cursor-ring" ref="ring" />
</template>

<style scoped>
.cursor-dot,
.cursor-ring {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 90;
  pointer-events: none;
  border-radius: 50%;
}

.cursor-dot {
  width: 5px;
  height: 5px;
  margin: -2.5px 0 0 -2.5px;
  background: var(--accent);
}

.cursor-ring {
  width: 28px;
  height: 28px;
  margin: -14px 0 0 -14px;
  border: 1px solid rgba(227, 106, 58, 0.7);
  transition: border-color 0.3s var(--ease);
}

.cursor-ring.is-hover {
  border-color: var(--fg);
}
</style>
