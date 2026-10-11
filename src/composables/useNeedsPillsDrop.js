import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { isMobileViewport } from '@/composables/useScrollBreakpoints.js'

gsap.registerPlugin(ScrollTrigger)

export function bindNeedsPillsDrop(pills, rotations = []) {
  if (!pills?.length) return () => {}

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced) {
    gsap.set(pills, { opacity: 1, y: 0 })
    pills.forEach((el) => el.classList.add('is-settled'))
    return () => {}
  }

  const mobile = isMobileViewport()

  pills.forEach((el, i) => {
    const rot = rotations[i] ?? 0
    gsap.set(el, {
      y: mobile ? -220 - i * 12 : -320 - i * 16,
      opacity: 0,
      rotation: rot,
      force3D: true,
    })
  })

  let played = false
  let trigger = null

  const playDrop = () => {
    if (played) return
    played = true
    gsap.to(pills, {
      y: 0,
      opacity: 1,
      duration: mobile ? 0.78 : 0.92,
      stagger: { each: mobile ? 0.055 : 0.075, from: 'start' },
      ease: 'power2.out',
      onComplete: () => {
        pills.forEach((el) => el.classList.add('is-settled'))
      },
    })
  }

  const mountTrigger = () => {
    if (trigger) return
    trigger = ScrollTrigger.create({
      trigger: '#needs',
      start: mobile ? 'top 88%' : '26% 44%',
      once: true,
      onEnter: playDrop,
      invalidateOnRefresh: true,
    })
    ScrollTrigger.refresh()
  }

  const onFirstScroll = () => {
    window.removeEventListener('scroll', onFirstScroll)
    mountTrigger()
  }

  if (mobile) {
    mountTrigger()
  } else if (window.scrollY > 48) {
    mountTrigger()
  } else {
    window.addEventListener('scroll', onFirstScroll, { passive: true })
  }

  return () => {
    window.removeEventListener('scroll', onFirstScroll)
    trigger?.kill()
    gsap.set(pills, { clearProps: 'y,opacity,rotation' })
    pills.forEach((el) => el.classList.remove('is-settled'))
  }
}
