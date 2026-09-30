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
    <p class="label">{{ site.find }}</p>
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
  font-size: 0.68rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--fg-dim);
}

.brand:hover,
.note-btn:hover {
  color: var(--fg);
}

.counter {
  font-family: var(--font-display);
  font-size: 0.78rem;
  letter-spacing: 0.18em;
  color: var(--fg);
}

.slash {
  margin: 0 0.45rem;
  color: var(--fg-faint);
}

.insights {
  position: fixed;
  right: var(--pad);
  top: 50%;
  z-index: 30;
  transform: translateY(-50%);
  display: grid;
  gap: 1.15rem;
  justify-items: end;
}

.label {
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  font-size: 0.64rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--fg-faint);
}

ol {
  display: grid;
  gap: 0.2rem;
}

button {
  width: 1.4rem;
  height: 1.4rem;
  color: var(--fg-faint);
  font-size: 0.72rem;
}

button.is-active,
button:hover {
  color: var(--fg);
}

@media (max-width: 720px) {
  .insights {
    display: none;
  }
}
</style>
