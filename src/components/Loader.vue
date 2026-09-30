<script setup>
import { site } from '@/data/content'

defineProps({
  progress: { type: Number, default: 0 },
  ready: { type: Boolean, default: false },
})

const emit = defineEmits(['enter'])
</script>

<template>
  <div class="loader">
    <p class="kicker">{{ site.brand }}</p>
    <div class="loader-center">
      <p class="loader-count">{{ String(progress).padStart(2, '0') }}</p>
      <button
        class="enter"
        type="button"
        :disabled="!ready"
        :class="{ 'is-ready': ready }"
        @click="emit('enter')"
      >
        Enter Site
      </button>
    </div>
    <div class="loader-bar" aria-hidden="true">
      <span :style="{ width: `${progress}%` }" />
    </div>
  </div>
</template>

<style scoped>
.loader {
  position: fixed;
  inset: 0;
  z-index: 40;
  display: grid;
  place-items: center;
  background: rgba(11, 10, 9, 0.78);
  backdrop-filter: blur(10px);
}

.kicker {
  position: absolute;
  top: var(--pad);
  left: var(--pad);
}

.loader-center {
  display: grid;
  justify-items: center;
  gap: 1.4rem;
}

.loader-count {
  font-family: var(--font-display);
  font-size: clamp(5rem, 16vw, 12rem);
  font-weight: 800;
  letter-spacing: -0.08em;
  line-height: 0.8;
}

.enter {
  min-width: 11rem;
  padding: 0.95rem 1.6rem;
  border: 1px solid var(--line-strong);
  border-radius: 999px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  font-size: 0.74rem;
  opacity: 0.35;
  pointer-events: none;
  transition: opacity 0.4s var(--ease), background 0.4s var(--ease), color 0.4s var(--ease);
}

.enter.is-ready {
  opacity: 1;
  pointer-events: auto;
}

.enter.is-ready:hover {
  background: var(--accent);
  border-color: var(--accent);
  color: var(--bg);
}

.loader-bar {
  position: absolute;
  left: var(--pad);
  right: var(--pad);
  bottom: var(--pad);
  height: 1px;
  background: var(--line);
}

.loader-bar span {
  display: block;
  height: 100%;
  background: var(--accent);
  transition: width 0.12s linear;
}
</style>
