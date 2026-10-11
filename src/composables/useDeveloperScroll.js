import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { isMobileViewport } from '@/composables/useScrollBreakpoints.js'

gsap.registerPlugin(ScrollTrigger)

function scrollConfig() {
  const mobile = isMobileViewport()
  return {
    trigger: '#hero .needs-panel',
    start: 'top bottom',
    end: mobile ? 'top 48%' : 'top 22%',
  }
}

export function bindDeveloperScroll(developerEl, { taglineEl, characterEl } = {}) {
  if (!developerEl) return () => {}

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced) return () => {}

  const mobile = isMobileViewport()
  const SCROLL = scrollConfig()

  gsap.set(developerEl, { transformOrigin: '50% 40%' })

  const tween = gsap.fromTo(
    developerEl,
    { scale: 1, y: 0 },
    {
      scale: mobile ? 1.72 : 2.05,
      y: mobile ? 112 : 168,
      ease: 'none',
      scrollTrigger: {
        ...SCROLL,
        scrub: mobile ? 0.42 : 0.55,
        invalidateOnRefresh: true,
      },
    },
  )

  let tagTween = null
  if (taglineEl) {
    tagTween = gsap.fromTo(
      taglineEl,
      { opacity: 1, y: 0 },
      {
        opacity: 0,
        y: mobile ? -32 : -48,
        ease: 'none',
        scrollTrigger: {
          ...SCROLL,
          end: mobile ? 'top 58%' : 'top 55%',
          scrub: mobile ? 0.38 : 0.45,
        },
      },
    )
  }

  let charTween = null
  if (characterEl) {
    gsap.set(characterEl, { transformOrigin: '50% 88%' })
    charTween = gsap.fromTo(
      characterEl,
      { y: 0 },
      {
        y: mobile ? -140 : -210,
        ease: 'none',
        scrollTrigger: {
          ...SCROLL,
          scrub: mobile ? 0.42 : 0.55,
          invalidateOnRefresh: true,
        },
      },
    )
  }

  return () => {
    tween.scrollTrigger?.kill()
    tween.kill()
    tagTween?.scrollTrigger?.kill()
    tagTween?.kill()
    charTween?.scrollTrigger?.kill()
    charTween?.kill()
    gsap.set(developerEl, { clearProps: 'scale,y' })
    if (taglineEl) gsap.set(taglineEl, { clearProps: 'opacity,y' })
    if (characterEl) gsap.set(characterEl, { clearProps: 'y' })
  }
}
