<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const emit = defineEmits(['ready'])
const canvas = ref(null)
let experience = null

onMounted(async () => {
  const { Experience } = await import('@/three/Experience')
  if (!canvas.value) return
  experience = new Experience(canvas.value)
  emit('ready', experience)
})

onUnmounted(() => {
  experience?.dispose()
  experience = null
})
</script>

<template>
  <canvas ref="canvas" class="scene" aria-hidden="true" />
</template>

<style scoped>
.scene {
  position: fixed;
  inset: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>
