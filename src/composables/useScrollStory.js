import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { splitWords } from '@/utils/split'

gsap.registerPlugin(ScrollTrigger)

export function bindScrollStory({ onChapter, onProgress }) {
  const triggers = []
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const progressTrigger = ScrollTrigger.create({
    trigger: '.experience',
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => onProgress?.(self.progress),
  })
  triggers.push(progressTrigger)

  document.querySelectorAll('[data-chapter]').forEach((section) => {
    const id = Number(section.dataset.chapter)
    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top 55%',
      end: 'bottom 45%',
      onEnter: () => onChapter?.(id),
      onEnterBack: () => onChapter?.(id),
    })
    triggers.push(trigger)
  })

  if (!reduced) {
    const hero = document.querySelector('.hero .titles')
    if (hero) {
      const heroTween = gsap.to(hero, {
        y: -70,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 0.9,
        },
      })
      if (heroTween.scrollTrigger) triggers.push(heroTween.scrollTrigger)
    }

    document.querySelectorAll('[data-reveal]').forEach((el) => {
      const type = el.dataset.reveal
      if (type === 'words') splitWords(el)

      const target = type === 'words' ? el.querySelectorAll('.word-inner') : el
      gsap.set(target, {
        yPercent: type === 'words' ? 110 : 24,
        opacity: type === 'fade' ? 0 : 1,
        rotate: type === 'tilt' ? 4 : 0,
      })

      const tween = gsap.to(target, {
        yPercent: 0,
        opacity: 1,
        rotate: 0,
        duration: type === 'words' ? 1.25 : 1.35,
        ease: 'power4.out',
        stagger: type === 'words' ? 0.05 : 0,
        scrollTrigger: {
          trigger: el,
          start: 'top 82%',
        },
      })
      if (tween.scrollTrigger) triggers.push(tween.scrollTrigger)
    })

    document.querySelectorAll('[data-marquee]').forEach((track) => {
      const tween = gsap.to(track, {
        xPercent: -50,
        ease: 'none',
        scrollTrigger: {
          trigger: track,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.6,
        },
      })
      if (tween.scrollTrigger) triggers.push(tween.scrollTrigger)
    })
  }

  const refresh = () => ScrollTrigger.refresh()
  requestAnimationFrame(refresh)

  return () => {
    triggers.forEach((trigger) => trigger.kill())
  }
}
