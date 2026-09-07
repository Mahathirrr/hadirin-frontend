import AOS from 'aos'
import Lenis from 'lenis'

import 'aos/dist/aos.css'
import 'lenis/dist/lenis.css'

let lenisInstance: Lenis | null = null
let rafId = 0

export function scrollToAnchor(targetId: string, offset = -76) {
  if (!targetId.startsWith('#')) return
  const element = document.querySelector(targetId)
  if (!element) return

  if (lenisInstance) {
    lenisInstance.scrollTo(element as HTMLElement, { offset, duration: 1.35 })
    return
  }

  element.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export function useLandingScroll() {
  function init() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      AOS.init({ disable: true })
      return
    }

    lenisInstance = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.9,
    })

    const raf = (time: number) => {
      lenisInstance?.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    AOS.init({
      duration: 680,
      easing: 'ease-out-cubic',
      once: true,
      offset: 72,
      anchorPlacement: 'top-bottom',
    })

    lenisInstance.on('scroll', AOS.refresh)
  }

  function destroy() {
    cancelAnimationFrame(rafId)
    lenisInstance?.destroy()
    lenisInstance = null
  }

  return { init, destroy }
}
