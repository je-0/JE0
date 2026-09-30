<script setup>
import { chapters, site } from '@/data/content'

defineProps({
  chapter: { type: Number, default: 0 },
  total: { type: Number, default: 6 },
})

const emit = defineEmits(['open-note', 'jump'])

const display = (value) => String(value).padStart(2, '0')
</script>

<template>
  <header class="hud">
    <button class="brand" type="button" @click="emit('jump', 0)">{{ site.brand }}</button>
    <p class="counter">
      <span>{{ display(chapter) }}</span>
      <span class="slash">/</span>
      <span>{{ display(total) }}</span>
    </p>
    <button class="note-btn" type="button" @click="emit('open-note')">THE NOTE</button>
  </header>

  <nav class="insights" aria-label="Chapters">
    <p class="kicker">{{ site.find }}</p>
    <ol>
      <li v-for="item in chapters" :key="item.id">
        <button
          type="button"
          :class="{ 'is-active': chapter === item.id }"
          :aria-label="item.title"
          @click="emit('jump', item.id)"
        >
          {{ item.id }}
        </button>
      </li>
    </ol>
  </nav>
</template>

<style scoped>
.hud {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 30;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--pad);
  pointer-events: none;
}

.hud > * {
  pointer-events: auto;
}

.brand,
.note-btn {
  font-size: 0.72rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.brand:hover,
.note-btn:hover {
  color: var(--accent);
}

.counter {
  font-family: var(--font-display);
  font-size: 0.92rem;
  letter-spacing: 0.12em;
}

.slash {
  margin: 0 0.4rem;
  color: var(--fg-faint);
}

.insights {
  position: fixed;
  right: var(--pad);
  top: 50%;
  z-index: 30;
  transform: translateY(-50%);
  display: grid;
  gap: 1rem;
  justify-items: end;
}

.insights .kicker {
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  color: var(--fg-dim);
  max-height: 14rem;
}

ol {
  display: grid;
  gap: 0.45rem;
}

button {
  width: 1.7rem;
  height: 1.7rem;
  border: 1px solid transparent;
  color: var(--fg-dim);
  font-size: 0.74rem;
}

button.is-active,
button:hover {
  color: var(--fg);
  border-color: var(--accent);
}

@media (max-width: 720px) {
  .insights {
    display: none;
  }
}
</style>
