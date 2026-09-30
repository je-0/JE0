<script setup>
import { computed, onUnmounted, ref } from 'vue'
import { insightTracks } from '@/data/content'
import { createInsightAudio } from '@/composables/useInsightAudio'

const props = defineProps({
  chapter: { type: Number, default: 0 },
})

const playing = ref(false)
const audio = createInsightAudio()
const display = computed(() => {
  const index = Math.max(0, props.chapter - 1)
  return insightTracks[index] ?? insightTracks[0]
})

const toggle = async () => {
  playing.value = await audio.toggle()
}

onUnmounted(() => {
  audio.dispose()
})
</script>

<template>
  <aside class="player">
    <button type="button" class="play" @click="toggle">
      {{ playing ? 'Pause insight' : 'Play insight' }}
    </button>
    <div class="meta">
      <p class="time">
        <span>{{ playing ? '00:08' : '00:00' }}</span>
        <span class="slash">/</span>
        <span>00:24</span>
      </p>
      <p class="serif line">{{ display.title }}</p>
    </div>
  </aside>
</template>

<style scoped>
.player {
  position: fixed;
  left: var(--pad);
  bottom: var(--pad);
  z-index: 30;
  display: flex;
  align-items: flex-end;
  gap: 1.1rem;
  max-width: min(26rem, calc(100vw - 2 * var(--pad)));
}

.play {
  font-size: 0.68rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--fg);
}

.play:hover {
  color: var(--accent);
}

.time {
  font-size: 0.64rem;
  letter-spacing: 0.16em;
  color: var(--fg-dim);
}

.slash {
  margin: 0 0.35rem;
  color: var(--fg-faint);
}

.line {
  margin-top: 0.25rem;
  font-size: 1.05rem;
  font-style: italic;
  line-height: 1.25;
  color: var(--fg);
}

@media (max-width: 720px) {
  .player {
    display: none;
  }
}
</style>
