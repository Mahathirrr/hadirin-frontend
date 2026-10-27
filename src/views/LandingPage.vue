<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

import CTASection from '@/components/landing/cta-section.vue'
import FaqSection from '@/components/landing/faq-section.vue'
import FeaturesSection from '@/components/landing/features-section.vue'
import LandingFooter from '@/components/landing/footer.vue'
import HeroSection from '@/components/landing/hero-section.vue'
import LandingNavbar from '@/components/landing/navbar.vue'
import PricingSection from '@/components/landing/pricing-section.vue'
import UseCasesSection from '@/components/landing/use-cases-section.vue'
import { useLandingScroll } from '@/composables/useLandingScroll'

const { init, destroy } = useLandingScroll()

onMounted(() => {
  init()
})

onUnmounted(() => {
  destroy()
})
</script>

<template>
  <div class="min-h-screen overflow-x-clip bg-background">
    <LandingNavbar />

    <main>
      <HeroSection />
      <FeaturesSection />
      <UseCasesSection />
      <PricingSection />
      <FaqSection />
      <CTASection />
    </main>

    <LandingFooter />
  </div>
</template>
