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
    lenisInstance.scrollTo(element as HTMLElement, {
      offset,
      duration: 0.75,
      easing: (t) => 1 - Math.pow(1 - t, 3),
    })
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

    // Wheel smoothness pakai lerp (bukan duration). duration di constructor membuat scroll terasa lambat.
    lenisInstance = new Lenis({
      lerp: 0.12,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.05,
      infinite: false,
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
