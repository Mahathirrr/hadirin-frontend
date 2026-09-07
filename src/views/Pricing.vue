<script setup lang="ts">
import { Clock, Headphones, Rocket, Shield, Users, Zap } from 'lucide-vue-next'
import type { Component } from 'vue'

import BaseLayout from '@/components/layouts/base-layout.vue'
import PricingPlans from '@/components/pricing-plans.vue'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface Feature {
  id: number
  name: string
  description: string
  icon: string
}

interface FAQ {
  id: number
  question: string
  answer: string
}

const iconMap: Record<string, Component> = { Rocket, Shield, Zap, Users, Headphones, Clock }

const featuresData: Feature[] = [
  { id: 1, name: 'Fast Performance', description: 'Lightning-fast response times and optimized performance for all your business needs.', icon: 'Rocket' },
  { id: 2, name: 'Enterprise Security', description: 'Bank-level security with end-to-end encryption and advanced threat protection.', icon: 'Shield' },
  { id: 3, name: 'Instant Setup', description: 'Get up and running in minutes with our streamlined onboarding process.', icon: 'Zap' },
  { id: 4, name: 'Team Collaboration', description: 'Seamless collaboration tools to keep your team connected and productive.', icon: 'Users' },
  { id: 5, name: '24/7 Support', description: 'Round-the-clock expert support whenever you need help or have questions.', icon: 'Headphones' },
  { id: 6, name: 'Real-time Analytics', description: 'Monitor your business performance with real-time insights and detailed analytics.', icon: 'Clock' },
]

const faqsData: FAQ[] = [
  { id: 1, question: 'Can I change my plan anytime?', answer: "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle, and you'll be charged or credited accordingly." },
  { id: 2, question: 'Is there a free trial available?', answer: 'Yes, all plans come with a 14-day free trial. No credit card is required to start your trial, and you can explore all features during this period.' },
  { id: 3, question: 'What payment methods do you accept?', answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for enterprise customers. All payments are processed securely.' },
  { id: 4, question: 'Do you offer discounts for annual plans?', answer: 'Yes, save 20% when you choose annual billing on any plan. You can switch to annual billing from your account settings at any time.' },
  { id: 5, question: 'What happens if I exceed my plan limits?', answer: "If you exceed your plan limits, we'll notify you in advance. You can either upgrade your plan or purchase additional resources as needed." },
  { id: 6, question: 'Can I cancel my subscription anytime?', answer: "Yes, you can cancel your subscription at any time from your account settings. You'll continue to have access to all features until the end of your current billing period." },
]
</script>

<template>
  <BaseLayout title="Pricing Plans" description="Choose the perfect plan for your team">
    <div class="px-4 lg:px-6">
      <!-- Pricing Cards -->
      <section id="pricing" class="pb-12">
        <PricingPlans mode="pricing" />
      </section>

      <!-- Features Section -->
      <Card>
        <CardHeader class="text-center">
          <CardTitle class="text-2xl">All Plans Include</CardTitle>
          <CardDescription>Every plan comes with these essential features to help your team succeed</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="mx-auto mt-6 sm:mt-8 lg:mt-12">
            <dl class="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3 lg:gap-y-16">
              <div v-for="feature in featuresData" :key="feature.name" class="relative pl-16">
                <div class="text-base leading-7 font-semibold">
                  <div class="bg-accent absolute start-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg">
                    <component :is="iconMap[feature.icon]" class="text-foreground size-6" aria-hidden="true" />
                  </div>
                  <span class="text-lg">{{ feature.name }}</span>
                </div>
                <p class="text-muted-foreground mt-2 text-base leading-relaxed">{{ feature.description }}</p>
              </div>
            </dl>
          </div>
        </CardContent>
      </Card>

      <!-- FAQ Section -->
      <Card class="mt-6 sm:mt-8 lg:mt-12">
        <CardHeader class="text-center">
          <CardTitle class="text-2xl">Frequently Asked Questions</CardTitle>
          <CardDescription>Get answers to the most common questions about our pricing and plans</CardDescription>
        </CardHeader>
        <CardContent class="mt-6 sm:mt-8">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-x-6">
            <!-- Left Column -->
            <div class="space-y-4">
              <Accordion type="multiple">
                <AccordionItem v-for="item in faqsData.slice(0, 3)" :key="item.id" :value="`item-${item.id}`" class="rounded-md !border my-3">
                  <AccordionTrigger class="cursor-pointer px-4">{{ item.question }}</AccordionTrigger>
                  <AccordionContent class="text-muted-foreground px-4">{{ item.answer }}</AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            <!-- Right Column -->
            <div class="space-y-4">
              <Accordion type="multiple">
                <AccordionItem v-for="item in faqsData.slice(3, 6)" :key="item.id" :value="`item-${item.id}`" class="rounded-md !border my-3">
                  <AccordionTrigger class="cursor-pointer px-4">{{ item.question }}</AccordionTrigger>
                  <AccordionContent class="text-muted-foreground px-4">{{ item.answer }}</AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </BaseLayout>
</template>
