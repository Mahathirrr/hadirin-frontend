<script setup lang="ts">
import { computed } from 'vue'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'

export interface PricingPlan {
  id: string
  name: string
  description: string
  price: string
  frequency: string
  features: string[]
  popular?: boolean
  current?: boolean
}

interface Props {
  plans?: PricingPlan[]
  mode?: 'pricing' | 'billing'
  currentPlanId?: string
  onPlanSelect?: (planId: string) => void
}

const defaultPlans: PricingPlan[] = [
  {
    id: 'basic',
    name: 'Basic',
    description: 'Perfect for small online stores',
    price: '$19',
    frequency: '/month',
    features: ['Up to 10 products', 'Basic inventory tracking', 'Email support', 'Mobile-responsive themes'],
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Ideal for growing businesses',
    price: '$79',
    frequency: '/month',
    features: [
      'Up to 100 products',
      'Advanced analytics',
      'Priority email & chat support',
      'API access',
      'Custom domain',
      'Abandoned cart recovery',
    ],
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For high-volume stores',
    price: '$199',
    frequency: '/month',
    features: [
      'Unlimited products',
      'Advanced reporting',
      '24/7 priority support',
      'Custom integrations',
      'Dedicated account manager',
      'Advanced security features',
    ],
  },
]

const props = defineProps<Props>()

const effectivePlans = computed(
  () => (props.plans && props.plans.length ? props.plans : defaultPlans),
)

function getButtonText(plan: PricingPlan): string {
  if (props.mode === 'billing') {
    if (props.currentPlanId === plan.id) return 'Current Plan'
    const currentIndex = effectivePlans.value.findIndex((p) => p.id === props.currentPlanId)
    const planIndex = effectivePlans.value.findIndex((p) => p.id === plan.id)
    if (planIndex > currentIndex) return 'Upgrade Plan'
    if (planIndex < currentIndex) return 'Downgrade Plan'
  }
  return 'Get Started'
}

function getButtonVariant(plan: PricingPlan) {
  if (props.mode === 'billing' && props.currentPlanId === plan.id) return 'outline'
  return plan.popular ? 'default' : 'outline'
}

function isButtonDisabled(plan: PricingPlan): boolean {
  return props.mode === 'billing' && props.currentPlanId === plan.id
}

function handleSelect(plan: PricingPlan) {
  props.onPlanSelect?.(plan.id)
}
</script>

<template>
  <div class="grid gap-8 lg:grid-cols-3">
    <Card
      v-for="tier in effectivePlans"
      :key="tier.id"
      :class="cn('flex flex-col pt-0', {
        'border-primary relative shadow-lg': tier.popular,
        'border-primary': props.currentPlanId === tier.id && props.mode === 'billing',
      })"
      :aria-labelledby="`${tier.id}-title`"
    >
      <div v-if="tier.popular" class="absolute start-0 -top-3 w-full">
        <Badge class="mx-auto flex w-fit gap-1.5 rounded-full font-medium">
          <Sparkles class="size-4!" />
          <span v-if="props.mode === 'pricing'">Most Popular</span>
          <span v-if="props.currentPlanId === tier.id && props.mode === 'billing'">Current Plan</span>
        </Badge>
      </div>
      <CardHeader class="space-y-2 pt-8 text-center">
        <CardTitle :id="`${tier.id}-title`" class="text-2xl">
          {{ tier.name }}
        </CardTitle>
        <p class="text-muted-foreground text-sm text-balance">{{ tier.description }}</p>
      </CardHeader>
      <CardContent class="flex flex-1 flex-col space-y-6">
        <div class="flex items-baseline justify-center">
          <span class="text-4xl font-bold">{{ tier.price }}</span>
          <span class="text-muted-foreground text-sm">{{ tier.frequency }}</span>
        </div>
        <div class="space-y-2">
          <div v-for="feature in tier.features" :key="feature" class="flex items-center gap-2">
            <div class="bg-muted rounded-full p-1">
              <Check class="size-3.5" />
            </div>
            <span class="text-sm">{{ feature }}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          class="w-full cursor-pointer"
          size="lg"
          :variant="getButtonVariant(tier)"
          :disabled="isButtonDisabled(tier)"
          :aria-label="`${getButtonText(tier)} - ${tier.name} plan`"
          @click="handleSelect(tier)"
        >
          {{ getButtonText(tier) }}
        </Button>
      </CardFooter>
    </Card>
  </div>
</template>
