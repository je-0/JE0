<script setup>
import HeroCharacter from '@/components/HeroCharacter.vue'
import HeroIntro from '@/components/HeroIntro.vue'
import HeroHeadline from '@/components/HeroHeadline.vue'
import { bindDeveloperScroll } from '@/composables/useDeveloperScroll.js'
import { bindNeedsPillsDrop } from '@/composables/useNeedsPillsDrop.js'
import { useI18n } from '@/i18n'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { nextTick, onMounted, onUnmounted, reactive, ref, watch } from 'vue'

defineEmits(['talk', 'book'])
const { t } = useI18n()
const introDone = ref(false)
const headlineRef = ref(null)
const characterLayerRef = ref(null)
let unbindHeroScroll = null
let unbindPillsDrop = null
const pillsRoot = ref(null)
const characterIntroReady = ref(false)
const characterShown = ref(false)
const revealed = reactive({
  tag: false,
  dev: false,
  spec: false,
  pitch: false,
  chat: false,
})

const onReveal = (key) => {
  if (key in revealed) revealed[key] = true
}

const onCharacterStart = () => {
  characterIntroReady.value = true
}

const onCharacterShown = () => {
  characterShown.value = true
}

const onIntroComplete = () => {
  introDone.value = true
  revealed.tag = true
  revealed.dev = true
  revealed.spec = true
  revealed.pitch = true
  revealed.chat = true
}

const setupHeroScroll = async () => {
  unbindHeroScroll?.()
  unbindHeroScroll = null
  await nextTick()
  const headline = headlineRef.value
  const developer = headline?.developerEl
  if (!developer) return
  unbindHeroScroll = bindDeveloperScroll(developer, {
    taglineEl: headline.taglineEl,
    characterEl: characterLayerRef.value,
  })
  ScrollTrigger.refresh()
}

watch(introDone, (done) => {
  if (done) setupHeroScroll()
})

const setupPillsDrop = async () => {
  unbindPillsDrop?.()
  await nextTick()
  const pills = pillsRoot.value?.querySelectorAll('li')
  if (!pills?.length) return
  const rotations = pillSpots.map((s) => s.rotate)
  unbindPillsDrop = bindNeedsPillsDrop(pills, rotations)
}

onMounted(() => {
  setupPillsDrop()
})

onUnmounted(() => {
  unbindHeroScroll?.()
  unbindPillsDrop?.()
})

const pillSpots = [
  { top: '62%', left: '5%', rotate: -11 },
  { top: '74%', left: '18%', rotate: 7 },
  { top: '58%', left: '32%', rotate: -4 },
  { top: '76%', left: '46%', rotate: 5 },
  { top: '54%', left: '56%', rotate: -9 },
  { top: '72%', left: '68%', rotate: 11 },
  { top: '84%', left: '12%', rotate: 5 },
  { top: '88%', left: '40%', rotate: -3 },
  { top: '82%', left: '76%', rotate: -10 },
]

const pillStyle = (index) => {
  const spot = pillSpots[index] ?? { top: '70%', left: '10%', rotate: 0 }
  return {
    top: spot.top,
    left: spot.left,
    '--pill-rotate': `${spot.rotate}deg`,
  }
}
</script>

<template>
  <section id="hero" class="showcase bleed">
    <div class="hero-panel">
      <div class="shell hero-frame" :class="{ 'intro-done': introDone }">
        <HeroIntro
          :tagline="t('hero.tagline')"
          :developer="t('hero.developer')"
          @reveal="onReveal"
          @character-start="onCharacterStart"
          @complete="onIntroComplete"
        />
        <h1 class="sr-only">{{ t('hero.tagline') }} {{ t('hero.developer') }}</h1>
        <p class="spec hero-object" :class="{ loaded: revealed.spec || introDone }">
          <span class="rule" aria-hidden="true" />{{ t('hero.spec') }}
        </p>
        <p class="pitch hero-object" :class="{ loaded: revealed.pitch || introDone }">
          {{ t('hero.pitch') }}
        </p>

      </div>
    </div>

    <div class="headline-layer bleed">
      <div class="shell hero-frame headline-frame">
        <HeroHeadline
          ref="headlineRef"
          :tagline="t('hero.tagline')"
          :developer="t('hero.developer')"
          :visible="(revealed.tag && revealed.dev) || introDone"
        />
      </div>
    </div>

    <div class="character-stage bleed">
      <div class="shell hero-frame character-frame">
        <div
          class="character-layer preload"
          :class="{ visible: characterIntroReady, generated: characterShown }"
        >
          <div ref="characterLayerRef" class="character-scroll">
            <HeroCharacter :intro-ready="characterIntroReady" @shown="onCharacterShown" />
            <button
              class="chat hero-object"
              :class="{ loaded: revealed.chat || introDone }"
              type="button"
              @click="$emit('talk')"
            >
              {{ t('hero.chat') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div id="needs" class="needs-panel">
      <div class="shell needs-frame">
        <div class="needs-top">
          <h2>
            <span>{{ t('needs.lineA') }}</span>
            <em>{{ t('needs.lineB') }}</em>
          </h2>
          <div class="needs-side">
            <p>{{ t('needs.note') }}</p>
            <button type="button" @click="$emit('book')">{{ t('needs.book') }}</button>
          </div>
        </div>
        <ul ref="pillsRoot" class="pills">
          <li v-for="(label, index) in t('needs.pills')" :key="label" :style="pillStyle(index)">
            {{ label }}
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>
