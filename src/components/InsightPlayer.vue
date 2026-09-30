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
    <div>
      <p class="kicker">{{ display.id }} · THE NOTE</p>
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
  align-items: center;
  gap: 1rem;
  max-width: min(28rem, calc(100vw - 2 * var(--pad)));
}

.play {
  flex: 0 0 auto;
  padding: 0.7rem 0.95rem;
  border: 1px solid var(--line-strong);
  border-radius: 999px;
  font-size: 0.68rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.play:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.line {
  margin-top: 0.2rem;
  font-size: 0.98rem;
  line-height: 1.3;
}

@media (max-width: 720px) {
  .player {
    display: none;
  }
}
</style>
