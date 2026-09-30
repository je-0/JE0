<script setup>
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { gsap } from 'gsap'
import CursorDot from '@/components/CursorDot.vue'
import SceneCanvas from '@/components/SceneCanvas.vue'
import Loader from '@/components/Loader.vue'
import TheNote from '@/components/TheNote.vue'
import ExperienceHud from '@/components/ExperienceHud.vue'
import InsightPlayer from '@/components/InsightPlayer.vue'
import HeroSection from '@/components/sections/HeroSection.vue'
import Chapter01 from '@/components/sections/Chapter01.vue'
import Chapter02 from '@/components/sections/Chapter02.vue'
import Chapter03 from '@/components/sections/Chapter03.vue'
import Chapter04 from '@/components/sections/Chapter04.vue'
import Chapter05 from '@/components/sections/Chapter05.vue'
import Chapter06 from '@/components/sections/Chapter06.vue'
import Chapter07 from '@/components/sections/Chapter07.vue'
import FooterSection from '@/components/sections/FooterSection.vue'
import { useExperience } from '@/composables/useExperience'
import { createLenis } from '@/composables/useLenis'
import { bindScrollStory } from '@/composables/useScrollStory'
import { easeOutCubic } from '@/utils/math'

const { setExperience, experience } = useExperience()
const entered = ref(false)
const noteOpen = ref(false)
const sceneReady = ref(false)
const loadProgress = ref(0)
const chapter = ref(0)

let lenisApi = null
let unbindStory = null
let loadFrame = 0

const onSceneReady = (instance) => {
  setExperience(instance)
  sceneReady.value = true
}

const enter = async () => {
  if (!sceneReady.value || loadProgress.value < 100 || entered.value) return
  entered.value = true
  document.body.classList.remove('is-locked')
  await nextTick()

  lenisApi = createLenis()
  unbindStory = bindScrollStory({
    onChapter: (id) => {
      chapter.value = id
    },
    onProgress: (progress) => {
      experience.value?.setProgress(progress)
    },
  })

  gsap.fromTo(
    '.experience',
    { opacity: 0 },
    { opacity: 1, duration: 1.05, ease: 'power3.out' },
  )
}

const jump = (id) => {
  const target = document.getElementById(`chapter-${id}`)
  if (!target || !lenisApi) return
  noteOpen.value = false
  lenisApi.lenis.scrollTo(target, { offset: 0 })
}

const onKeydown = (event) => {
  if (event.key === 'Escape') noteOpen.value = false
}

watch(noteOpen, (open) => {
  if (!lenisApi) return
  if (open) lenisApi.lenis.stop()
  else lenisApi.lenis.start()
})

onMounted(() => {
  document.body.classList.add('is-locked')
  window.addEventListener('keydown', onKeydown)
  const started = performance.now()
  const duration = 2400

  const tick = (now) => {
    const t = Math.min(1, (now - started) / duration)
    loadProgress.value = Math.round(easeOutCubic(t) * 100)
    if (t < 1) loadFrame = requestAnimationFrame(tick)
  }

  loadFrame = requestAnimationFrame(tick)
})

onUnmounted(() => {
  cancelAnimationFrame(loadFrame)
  window.removeEventListener('keydown', onKeydown)
  unbindStory?.()
  lenisApi?.destroy()
  document.body.classList.remove('is-locked')
})
</script>

<template>
  <div class="app" :class="{ 'is-entered': entered, 'is-note': noteOpen }">
    <CursorDot />
    <SceneCanvas @ready="onSceneReady" />

    <Loader
      v-if="!entered"
      :progress="loadProgress"
      :ready="sceneReady && loadProgress >= 100"
      @enter="enter"
    />

    <TheNote :open="noteOpen" @close="noteOpen = false" />

    <template v-if="entered">
      <ExperienceHud :chapter="chapter" :total="6" @open-note="noteOpen = true" @jump="jump" />
      <InsightPlayer :chapter="chapter" />
    </template>

    <main class="experience" :class="{ 'is-locked': !entered }">
      <HeroSection />
      <Chapter01 />
      <Chapter02 />
      <Chapter03 />
      <Chapter04 />
      <Chapter05 />
      <Chapter06 />
      <Chapter07 />
      <FooterSection />
    </main>
  </div>
</template>
