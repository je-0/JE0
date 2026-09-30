<script setup>
defineProps({
  progress: { type: Number, default: 0 },
  ready: { type: Boolean, default: false },
})

const emit = defineEmits(['enter'])
</script>

<template>
  <div class="loader">
    <p class="count">{{ String(progress).padStart(2, '0') }}</p>
    <button
      v-if="ready"
      class="enter"
      type="button"
      @click="emit('enter')"
    >
      Enter Site
    </button>
    <p v-else class="enter is-wait">Loading</p>
  </div>
</template>

<style scoped>
.loader {
  position: fixed;
  inset: 0;
  z-index: 40;
  display: grid;
  place-items: center;
  background: rgba(7, 8, 12, 0.28);
}

.count {
  position: absolute;
  top: var(--pad);
  left: var(--pad);
  font-size: 0.68rem;
  letter-spacing: 0.22em;
  color: var(--fg-dim);
}

.enter {
  font-family: var(--font-display);
  font-size: clamp(1.1rem, 2.4vw, 1.5rem);
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: none;
  color: var(--fg);
}

.enter.is-wait {
  opacity: 0.55;
}

.enter:not(.is-wait):hover {
  color: var(--accent);
}
</style>
