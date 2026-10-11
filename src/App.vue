<script setup>
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SiteHeader from '@/components/SiteHeader.vue'
import HeroShowcase from '@/components/HeroShowcase.vue'
import WorksBlock from '@/components/WorksBlock.vue'
import ContactBand from '@/components/ContactBand.vue'
import SiteFooter from '@/components/SiteFooter.vue'
import { useI18n } from '@/i18n'
import { createLenis } from '@/composables/useLenis'

const { t } = useI18n()
const menuOpen = ref(false)
let lenisApi = null

const jump = async (id) => {
  menuOpen.value = false
  await nextTick()

  const target = document.getElementById(id)
  if (!target) return

  const header = document.querySelector('.top-bar')
  const offset = -((header?.offsetHeight ?? 0) + 4)

  requestAnimationFrame(() => {
    if (lenisApi?.lenis) {
      lenisApi.lenis.start()
      lenisApi.lenis.scrollTo(target, { offset, lock: false })
      ScrollTrigger.update()
    } else {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  })
}

const onKeydown = (event) => {
  if (event.key === 'Escape') menuOpen.value = false
}

watch(menuOpen, (open) => {
  if (!lenisApi) return
  if (open) lenisApi.lenis.stop()
  else lenisApi.lenis.start()
})

onMounted(() => {
  document.body.classList.remove('is-locked')
  window.addEventListener('keydown', onKeydown)
  lenisApi = createLenis()
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  lenisApi?.destroy()
})
</script>

<template>
  <div class="app">
    <div v-if="menuOpen" class="menu" role="dialog" :aria-label="t('nav.menu')">
      <button class="close" type="button" @click="menuOpen = false">{{ t('nav.close') }}</button>
      <button v-for="item in t('nav.items')" :key="item.id" type="button" @click="jump(item.id)">
        {{ item.label }}
      </button>
    </div>
    <header class="top-bar bleed">
      <div class="shell">
        <SiteHeader :open="menuOpen" @jump="jump" @toggle="menuOpen = !menuOpen" />
      </div>
    </header>
    <main>
      <HeroShowcase @talk="jump('contact')" @book="jump('contact')" />
      <WorksBlock />
      <ContactBand />
    </main>
    <SiteFooter />
  </div>
</template>

<style lang="scss" scoped>
.top-bar {
  position: sticky;
  top: 0;
  z-index: 20;
  background: color-mix(in srgb, var(--bg) 92%, transparent);
  backdrop-filter: blur(10px);
}

.menu {
  position: fixed;
  inset: 0;
  z-index: 30;
  display: grid;
  align-content: center;
  gap: rem(14);
  padding: max(8vh, env(safe-area-inset-top, 0px)) max(8vw, env(safe-area-inset-right, 0px))
    max(8vh, env(safe-area-inset-bottom, 0px)) max(8vw, env(safe-area-inset-left, 0px));
  background: var(--night);
}

.menu button {
  justify-self: start;
  color: var(--cream);
  font-family: var(--font-poster);
  font-size: clamp(#{rem(38)}, 6vw, #{rem(70)});
  font-weight: 400;
  line-height: 0.95;
}

.close {
  font-family: var(--font-body) !important;
  font-size: rem(14) !important;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  margin-bottom: rem(16);
}
</style>
