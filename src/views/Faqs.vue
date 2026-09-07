<script setup lang="ts">
import { ArrowRight, Clock, Search, Shield, Sparkles, Truck } from 'lucide-vue-next'
import type { Component } from 'vue'
import { computed, ref } from 'vue'

import BaseLayout from '@/components/layouts/base-layout.vue'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

interface FAQ {
  id: number
  question: string
  answer: string
  category: string
}

const categories = [
  { name: 'All', count: 46 },
  { name: 'General', count: 8 },
  { name: 'Account', count: 6 },
  { name: 'Billing', count: 8 },
  { name: 'Technical', count: 9 },
  { name: 'Privacy', count: 5 },
  { name: 'Security', count: 4 },
  { name: 'Support', count: 6 },
]

const featuresData = [
  { id: 1, title: 'Premium Quality', description: 'Handcrafted with premium materials and meticulous attention to detail.', icon: 'Sparkles' },
  { id: 2, title: 'Secure Shopping', description: '100% secure payment processing with end-to-end encryption.', icon: 'Shield' },
  { id: 3, title: 'Fast Delivery', description: 'Free worldwide shipping and hassle-free returns within 30 days.', icon: 'Truck' },
  { id: 4, title: '24/7 Support', description: 'Round-the-clock customer support to assist you anytime.', icon: 'Clock' },
]

const faqs: FAQ[] = [
  { id: 1, question: 'What is ShadcnStore Admin?', answer: 'ShadcnStore Admin is a comprehensive admin dashboard template built with React, TypeScript, and shadcn/ui components. It provides a complete solution for managing your e-commerce store or business operations.', category: 'General' },
  { id: 2, question: 'How do I get started?', answer: 'You can get started by signing up for an account, choosing a plan that fits your needs, and following our quick setup guide to configure your dashboard.', category: 'General' },
  { id: 3, question: 'Do you offer a free trial?', answer: 'Yes, we offer a 14-day free trial for all new users. No credit card is required to start the trial, and you can explore all features during this period.', category: 'General' },
  { id: 4, question: 'What browsers are supported?', answer: 'We support all modern browsers including Chrome, Firefox, Safari, and Edge. For the best experience, we recommend using the latest version of your preferred browser.', category: 'General' },
  { id: 5, question: 'How do I contact support?', answer: 'You can contact our support team through the support page, by email at support@shadcnstore.com, or through the live chat feature available 24/7.', category: 'General' },
  { id: 6, question: 'Is there a mobile app available?', answer: 'Currently, we offer a responsive web application that works great on mobile devices. A dedicated mobile app is planned for future release.', category: 'General' },
  { id: 7, question: 'Can I customize the dashboard?', answer: 'Yes, the dashboard is highly customizable. You can modify themes, layouts, add custom components, and configure various settings to match your brand.', category: 'General' },
  { id: 8, question: 'What integrations are available?', answer: 'We offer integrations with popular services like Stripe, PayPal, Shopify, WooCommerce, Google Analytics, and many more through our API.', category: 'General' },
  { id: 9, question: 'How do I reset my password?', answer: "You can reset your password by clicking on the 'Forgot Password' link on the login page. Enter your email address, and we'll send you instructions to reset your password.", category: 'Account' },
  { id: 10, question: 'How do I change my email address?', answer: "You can change your email address in your account settings under the 'User Settings' section. You'll need to verify the new email address before the change takes effect.", category: 'Account' },
  { id: 11, question: 'Can I have multiple team members?', answer: 'Yes, depending on your plan, you can invite team members and assign different roles and permissions to manage your store collaboratively.', category: 'Account' },
  { id: 12, question: 'How do I delete my account?', answer: "To delete your account, go to your account settings and select 'Delete Account'. Please note that this action is irreversible and all data will be permanently removed.", category: 'Account' },
  { id: 13, question: 'Can I change my username?', answer: 'Yes, you can change your username in the account settings. Keep in mind that some features might reference your old username temporarily.', category: 'Account' },
  { id: 14, question: 'How do I enable two-factor authentication?', answer: 'You can enable two-factor authentication in your account security settings. We support both SMS and authenticator app methods for added security.', category: 'Account' },
  { id: 15, question: 'What payment methods do you accept?', answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for enterprise customers. All payments are processed securely.', category: 'Billing' },
  { id: 16, question: 'How can I upgrade my plan?', answer: "You can upgrade your plan at any time from your account settings. Go to 'Plans & Billing' and select the plan that best fits your needs. Changes take effect immediately.", category: 'Billing' },
  { id: 17, question: 'Can I downgrade my plan?', answer: 'Yes, you can downgrade your plan at any time. The change will take effect at the start of your next billing cycle to ensure you don\'t lose access to premium features.', category: 'Billing' },
  { id: 18, question: 'Do you offer refunds?', answer: "We offer a 30-day money-back guarantee for all plans. If you're not satisfied, contact our support team for a full refund within 30 days of purchase.", category: 'Billing' },
  { id: 19, question: 'How does billing work?', answer: 'Billing is processed monthly or annually depending on your chosen plan. You\'ll receive an invoice before each billing cycle, and payment is automatically charged to your selected method.', category: 'Billing' },
  { id: 20, question: 'Can I change my billing cycle?', answer: 'Yes, you can switch between monthly and annual billing at any time. Annual billing offers significant savings compared to monthly billing.', category: 'Billing' },
  { id: 21, question: 'What happens if payment fails?', answer: "If a payment fails, we'll attempt to charge your card again after 3 days. You'll receive email notifications, and your account will remain active during this grace period.", category: 'Billing' },
  { id: 22, question: 'How do I view my billing history?', answer: "You can view your complete billing history in the 'Plans & Billing' section of your account settings. All invoices and receipts are available for download.", category: 'Billing' },
  { id: 23, question: 'Can I export my data?', answer: 'Yes, you can export your data at any time from your account settings. We provide exports in multiple formats including CSV, JSON, and PDF for different data types.', category: 'Technical' },
  { id: 24, question: 'What APIs do you provide?', answer: 'We provide comprehensive REST APIs for all major features including product management, order processing, customer data, and analytics. Full documentation is available.', category: 'Technical' },
  { id: 25, question: 'How do I backup my data?', answer: 'We automatically backup all your data daily. You can also create manual backups anytime from your settings, and restore from any backup point within the last 30 days.', category: 'Technical' },
  { id: 26, question: 'Is there a rate limit on API calls?', answer: 'Yes, API rate limits vary by plan. Basic plans have 1000 calls/hour, Professional plans have 10,000 calls/hour, and Enterprise plans have unlimited calls.', category: 'Technical' },
  { id: 27, question: 'How do I set up webhooks?', answer: "Webhooks can be configured in the 'Connections' section of your settings. You can set up webhooks for various events like new orders, payment confirmations, and inventory updates.", category: 'Technical' },
  { id: 28, question: 'What about system maintenance?', answer: 'We perform maintenance during low-traffic hours (typically Sunday 2-4 AM UTC). You\'ll be notified at least 48 hours in advance of any scheduled maintenance.', category: 'Technical' },
  { id: 29, question: 'How do I troubleshoot connection issues?', answer: 'First, check your internet connection and try refreshing the page. If issues persist, check our status page or contact support with specific error messages.', category: 'Technical' },
  { id: 30, question: 'Can I use custom domains?', answer: 'Yes, Professional and Enterprise plans support custom domains. You can configure your custom domain in the \'Connections\' section of your account settings.', category: 'Technical' },
  { id: 31, question: 'What databases do you support?', answer: 'We support integration with MySQL, PostgreSQL, MongoDB, and other popular databases through our Database Sync feature available in higher-tier plans.', category: 'Technical' },
  { id: 32, question: 'How do you handle my personal data?', answer: 'We follow strict data protection policies and comply with GDPR, CCPA, and other privacy regulations. Your personal data is never shared with third parties without your consent.', category: 'Privacy' },
  { id: 33, question: 'Can I request my data?', answer: "Yes, you can request a complete copy of your personal data at any time. We'll provide it in a machine-readable format within 30 days of your request.", category: 'Privacy' },
  { id: 34, question: 'How long do you retain data?', answer: 'We retain your data as long as your account is active. After account deletion, personal data is removed within 30 days, though some anonymized analytics may be retained.', category: 'Privacy' },
  { id: 35, question: 'Do you use cookies?', answer: 'Yes, we use essential cookies for functionality and optional cookies for analytics and personalization. You can manage your cookie preferences in your account settings.', category: 'Privacy' },
  { id: 36, question: 'Is my data encrypted?', answer: 'Yes, all data is encrypted both in transit (using TLS 1.3) and at rest (using AES-256 encryption). We use industry-standard security practices to protect your information.', category: 'Privacy' },
  { id: 37, question: 'How secure is my data?', answer: 'We implement bank-level security with end-to-end encryption, regular security audits, and compliance with SOC 2 Type II standards. Your data security is our top priority.', category: 'Security' },
  { id: 38, question: 'Do you support SSO?', answer: 'Yes, Enterprise plans include Single Sign-On (SSO) support with popular providers like Google, Microsoft Azure AD, and Okta for seamless team access.', category: 'Security' },
  { id: 39, question: 'What about password requirements?', answer: 'We require strong passwords with at least 8 characters, including uppercase, lowercase, numbers, and special characters. We also highly recommend enabling two-factor authentication.', category: 'Security' },
  { id: 40, question: 'How do you handle security incidents?', answer: 'We have a comprehensive incident response plan. In case of any security issues, we immediately investigate, contain the issue, and notify affected users within 24 hours.', category: 'Security' },
  { id: 41, question: 'What support channels are available?', answer: 'We offer email support, live chat, and phone support (for Enterprise customers). Our knowledge base and community forums are also available 24/7.', category: 'Support' },
  { id: 42, question: 'What are your support hours?', answer: 'Email and chat support are available 24/7. Phone support for Enterprise customers is available Monday-Friday, 9 AM-6 PM in your local timezone.', category: 'Support' },
  { id: 43, question: 'How quickly will I get a response?', answer: 'Response times vary by plan: Basic (24 hours), Professional (12 hours), Enterprise (2 hours). Critical issues are prioritized and responded to immediately.', category: 'Support' },
  { id: 44, question: 'Do you offer training?', answer: 'Yes, we provide comprehensive onboarding for all plans, video tutorials, documentation, and personalized training sessions for Enterprise customers.', category: 'Support' },
  { id: 45, question: 'Can you help with custom implementations?', answer: 'Enterprise customers get access to our professional services team for custom implementations, integrations, and consulting services.', category: 'Support' },
  { id: 46, question: 'Is there a community forum?', answer: 'Yes, we have an active community forum where users share tips, ask questions, and get help from both our team and other community members.', category: 'Support' },
]

const selectedCategory = ref('All')
const searchQuery = ref('')

const filteredFaqs = computed(() =>
  faqs.filter((faq) => {
    const matchesCategory = selectedCategory.value === 'All' || faq.category === selectedCategory.value
    const q = searchQuery.value.toLowerCase()
    const matchesSearch =
      q === '' ||
      faq.question.toLowerCase().includes(q) ||
      faq.answer.toLowerCase().includes(q)
    return matchesCategory && matchesSearch
  }),
)

const featureIconMap: Record<string, Component> = { Sparkles, Shield, Truck, Clock }
</script>

<template>
  <BaseLayout title="Frequently Asked Questions" description="Everything you need to know about our different services.">
    <div class="px-4 lg:px-6">
      <div class="grid grid-cols-1 lg:grid-cols-6 xl:grid-cols-4 gap-6">
        <!-- Categories Sidebar -->
        <Card class="lg:col-span-2 xl:col-span-1">
          <CardHeader>
            <CardTitle class="text-lg">Categories</CardTitle>
            <div class="relative">
              <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input v-model="searchQuery" placeholder="Search FAQs..." class="pl-10 cursor-pointer" />
            </div>
          </CardHeader>
          <CardContent class="space-y-2">
            <div
              v-for="category in categories"
              :key="category.name"
              :class="cn(
                'flex items-center justify-between px-3 py-2 rounded-lg hover:bg-muted cursor-pointer transition-colors group',
                selectedCategory === category.name && 'bg-muted',
              )"
              @click="selectedCategory = category.name"
            >
              <span class="font-medium">{{ category.name }}</span>
              <Badge
                variant="secondary"
                :class="cn('transition-colors', selectedCategory === category.name && 'bg-background')"
              >
                {{ category.name === 'All' ? faqs.length : category.count }}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <!-- FAQs List -->
        <div class="lg:col-span-4 xl:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle class="text-lg">
                {{ selectedCategory === 'All' ? 'All FAQs' : `${selectedCategory} FAQs` }}
                <span class="text-sm font-normal text-muted-foreground ml-2">
                  ({{ filteredFaqs.length }} {{ filteredFaqs.length === 1 ? 'question' : 'questions' }})
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea class="h-[570px] pr-4">
                <div v-if="filteredFaqs.length === 0" class="text-center py-8 text-muted-foreground">
                  <p>No FAQs found matching your search criteria.</p>
                </div>
                <Accordion v-else type="single" default-value="item-1" class="space-y-4">
                  <AccordionItem
                    v-for="item in filteredFaqs"
                    :key="item.id"
                    :value="`item-${item.id}`"
                    class="rounded-md !border"
                  >
                    <AccordionTrigger class="cursor-pointer px-4 hover:no-underline">
                      <div class="flex items-start text-left">
                        <span>{{ item.question }}</span>
                        <Badge variant="outline" class="ms-3 mt-0.5 shrink-0 text-xs">{{ item.category }}</Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent class="text-muted-foreground px-4">{{ item.answer }}</AccordionContent>
                  </AccordionItem>
                </Accordion>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      <!-- Features Grid -->
      <div class="grid gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4 mt-8">
        <article v-for="feature in featuresData" :key="feature.id" class="group">
          <Card class="relative h-full overflow-hidden transition-all hover:shadow-md">
            <CardContent class="px-6">
              <Badge variant="secondary" class="mb-4 inline-flex size-12 items-center justify-center">
                <component :is="featureIconMap[feature.icon]" class="!size-5" aria-hidden="true" />
              </Badge>
              <h3 class="mb-2 text-lg font-semibold">{{ feature.title }}</h3>
              <p class="text-muted-foreground mb-4 text-sm">{{ feature.description }}</p>
              <Button variant="link" size="sm" class="text-muted-foreground hover:text-foreground h-auto cursor-pointer !p-0 text-sm">
                Learn more
                <ArrowRight class="ms-1.5 size-4" />
              </Button>
            </CardContent>
          </Card>
        </article>
      </div>
    </div>
  </BaseLayout>
</template>
