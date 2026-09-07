<script setup lang="ts">
import PricingPlans from '@/components/pricing-plans.vue'
import BaseLayout from '@/components/layouts/base-layout.vue'
import BillingHistoryCard from '@/components/settings/BillingHistoryCard.vue'
import CurrentPlanCard from '@/components/settings/CurrentPlanCard.vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const currentPlanData = {
  planName: 'Professional Plan',
  price: '$79/month',
  nextBilling: 'Aug 15, 2025',
  status: 'Current',
  daysUsed: 18,
  totalDays: 30,
  progressPercentage: 60,
  remainingDays: 12,
  needsAttention: true,
  attentionMessage: 'Your plan requires update',
}

const billingHistoryData = [
  { id: 1, month: 'December 2024', plan: 'Professional Plan', amount: '$79.00', status: 'Paid' },
  { id: 2, month: 'November 2024', plan: 'Professional Plan', amount: '$79.00', status: 'Paid' },
  { id: 3, month: 'October 2024', plan: 'Professional Plan', amount: '$79.00', status: 'Paid' },
]

function handlePlanSelect(planId: string) {
  // eslint-disable-next-line no-console
  console.log('Plan selected:', planId)
}
</script>

<template>
  <BaseLayout>
    <div class="space-y-6 px-4 lg:px-6">
      <div>
        <h1 class="text-3xl font-bold">Plans &amp; Billing</h1>
        <p class="text-muted-foreground">Manage your subscription and billing information.</p>
      </div>

      <div class="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <CurrentPlanCard :plan="currentPlanData" />
        <BillingHistoryCard :history="billingHistoryData" />
      </div>

      <div class="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Available Plans</CardTitle>
            <CardDescription>Choose a plan that works best for you.</CardDescription>
          </CardHeader>
          <CardContent>
            <PricingPlans mode="billing" current-plan-id="professional" :on-plan-select="handlePlanSelect" />
          </CardContent>
        </Card>
      </div>
    </div>
  </BaseLayout>
</template>
