<script setup>
import { note } from '@/data/content'

defineProps({
  open: { type: Boolean, default: false },
})

const emit = defineEmits(['close'])
</script>

<template>
  <div class="note" :class="{ 'is-open': open }" :aria-hidden="!open">
    <div class="note-panel">
      <div class="note-top">
        <p class="kicker">{{ note.label }}</p>
        <button class="close" type="button" @click="emit('close')">Close</button>
      </div>
      <div class="note-grid">
        <div>
          <p class="note-heading serif">{{ note.heading }}</p>
          <div class="credits">
            <p v-for="item in note.credits" :key="item.label">
              <span>{{ item.label }}</span>
              <strong>{{ item.value }}</strong>
            </p>
          </div>
        </div>
        <div class="note-body">
          <p v-for="(paragraph, index) in note.body" :key="index">{{ paragraph }}</p>
          <p class="sign serif">{{ note.sign }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.note {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: grid;
  place-items: center;
  padding: var(--pad);
  background: rgba(7, 8, 12, 0.72);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.5s var(--ease);
}

.note.is-open {
  opacity: 1;
  pointer-events: auto;
}

.note-panel {
  width: min(1080px, 100%);
  max-height: calc(100dvh - 2 * var(--pad));
  overflow: auto;
  padding: clamp(1.6rem, 4vw, 3.4rem);
}

.note-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.6rem;
}

.close {
  letter-spacing: 0.16em;
  text-transform: uppercase;
  font-size: 0.68rem;
  color: var(--fg-dim);
}

.close:hover {
  color: var(--fg);
}

.note-grid {
  display: grid;
  gap: 2.4rem;
}

.note-heading {
  font-size: clamp(2.2rem, 5vw, 3.8rem);
  font-style: italic;
  line-height: 1.05;
}

.credits {
  margin-top: 2rem;
  font-size: 0.68rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--fg-dim);
}

.credits strong {
  display: block;
  margin-top: 0.35rem;
  color: var(--fg);
  font-weight: 500;
}

.note-body {
  display: grid;
  gap: 1.15rem;
  color: var(--fg-dim);
  font-size: 1.02rem;
  line-height: 1.7;
  max-width: 38rem;
}

.sign {
  margin-top: 0.7rem;
  color: var(--fg);
  font-size: 1.45rem;
  font-style: italic;
}

@media (min-width: 860px) {
  .note-grid {
    grid-template-columns: 0.9fr 1.1fr;
    gap: 4.5rem;
  }
}
</style>
