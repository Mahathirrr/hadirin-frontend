<script setup lang="ts">
import { AlertTriangle, Crown } from 'lucide-vue-next'

import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

interface CurrentPlan {
  planName: string
  price: string
  nextBilling: string
  status: string
  daysUsed: number
  totalDays: number
  progressPercentage: number
  remainingDays: number
  needsAttention: boolean
  attentionMessage: string
}

interface Props {
  plan: CurrentPlan
}

const props = defineProps<Props>()
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Current Plan</CardTitle>
      <CardDescription>
        You are currently on the {{ props.plan.planName }}.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center space-x-2">
          <Crown class="h-5 w-5 text-yellow-500" />
          <span class="font-semibold">{{ props.plan.planName }}</span>
          <Badge variant="secondary">{{ props.plan.status }}</Badge>
        </div>
        <div class="text-right">
          <div class="text-2xl font-bold">{{ props.plan.price }}</div>
          <div class="text-sm text-muted-foreground">Next billing: {{ props.plan.nextBilling }}</div>
        </div>
      </div>

      <Card v-if="props.plan.needsAttention" class="border-neutral-200 bg-neutral-50 dark:border-neutral-600 dark:bg-neutral-800">
        <CardContent>
          <div class="flex items-start gap-3">
            <AlertTriangle class="h-5 w-5 text-neutral-600 mt-0.5 dark:text-neutral-400" />
            <div class="space-y-1">
              <p class="font-medium text-neutral-800 dark:text-neutral-400">We need your attention!</p>
              <p class="text-sm text-neutral-700 dark:text-neutral-400">{{ props.plan.attentionMessage }}</p>
            </div>
          </div>

          <!-- Progress Section -->
          <div class="mt-4 space-y-2">
            <div class="flex justify-between items-center">
              <span class="text-sm text-muted-foreground font-medium">Days</span>
              <span class="text-sm text-muted-foreground font-medium">{{ props.plan.daysUsed }} of {{ props.plan.totalDays }} Days</span>
            </div>
            <Progress :value="props.plan.progressPercentage" class="h-2" />
            <p class="text-xs text-muted-foreground">{{ props.plan.remainingDays }} days remaining until your plan requires update</p>
          </div>
        </CardContent>
      </Card>
    </CardContent>
  </Card>
</template>
