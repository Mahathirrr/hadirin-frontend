<script setup lang="ts">
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

interface BillingHistoryItem {
  id: number
  month: string
  plan: string
  amount: string
  status: string
}

interface Props {
  history: BillingHistoryItem[]
}

const props = defineProps<Props>()
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Billing History</CardTitle>
      <CardDescription>
        View your past invoices and payments.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div class="space-y-4">
        <div v-for="(item, index) in props.history" :key="item.id">
          <div class="flex items-center justify-between py-2">
            <div>
              <div class="font-medium">{{ item.month }}</div>
              <div class="text-sm text-muted-foreground">{{ item.plan }}</div>
            </div>
            <div class="text-right">
              <div class="font-medium">{{ item.amount }}</div>
              <Badge variant="secondary">{{ item.status }}</Badge>
            </div>
          </div>
          <Separator v-if="index < props.history.length - 1" />
        </div>
      </div>
    </CardContent>
  </Card>
</template>
