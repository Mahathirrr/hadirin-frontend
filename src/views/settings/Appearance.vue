<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'

import BaseLayout from '@/components/layouts/base-layout.vue'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const appearanceFormSchema = z.object({
  theme: z.string(),
  fontFamily: z.string().optional(),
  fontSize: z.string().optional(),
  sidebarWidth: z.string().optional(),
  contentWidth: z.string().optional(),
})

const schema = toTypedSchema(appearanceFormSchema)

function onSubmit(data: unknown) {
  // eslint-disable-next-line no-console
  console.log('Form submitted:', data)
}
</script>

<template>
  <BaseLayout>
    <div class="space-y-6 px-4 lg:px-6">
      <div>
        <h1 class="text-3xl font-bold">Appearance</h1>
        <p class="text-muted-foreground">Customize the appearance of the application.</p>
      </div>

      <Form :validation-schema="schema" class="space-y-6" @submit="onSubmit">
        <!-- Theme Section -->
        <h3 class="text-lg font-medium mb-2">Theme</h3>
        <FormField v-slot="{ field }" name="theme">
          <FormItem class="space-y-3">
            <FormControl>
              <RadioGroup
                class="flex gap-4"
                :model-value="field.value"
                @update:model-value="field.onChange"
              >
                <FormItem>
                  <FormLabel class="[&:has([data-state=checked])>div]:border-primary cursor-pointer">
                    <FormControl>
                      <RadioGroupItem value="light" class="sr-only" />
                    </FormControl>
                    <div class="rounded-md border-2 border-muted p-4 hover:border-accent transition-colors">
                      <div class="space-y-2">
                        <div class="w-20 h-20 bg-white border rounded-md p-3">
                          <div class="space-y-2">
                            <div class="h-2 bg-gray-200 rounded w-3/4"></div>
                            <div class="h-2 bg-gray-200 rounded w-1/2"></div>
                            <div class="flex space-x-2">
                              <div class="h-2 w-2 bg-gray-300 rounded-full"></div>
                              <div class="h-2 bg-gray-200 rounded flex-1"></div>
                            </div>
                            <div class="flex space-x-2">
                              <div class="h-2 w-2 bg-gray-300 rounded-full"></div>
                              <div class="h-2 bg-gray-200 rounded flex-1"></div>
                            </div>
                          </div>
                        </div>
                        <span class="text-sm font-medium">Light</span>
                      </div>
                    </div>
                  </FormLabel>
                </FormItem>
                <FormItem>
                  <FormLabel class="[&:has([data-state=checked])>div]:border-primary cursor-pointer">
                    <FormControl>
                      <RadioGroupItem value="dark" class="sr-only" />
                    </FormControl>
                    <div class="rounded-md border-2 border-muted p-4 hover:border-accent transition-colors">
                      <div class="space-y-2">
                        <div class="w-20 h-20 bg-gray-900 border border-gray-700 rounded-md p-3">
                          <div class="space-y-2">
                            <div class="h-2 bg-gray-600 rounded w-3/4"></div>
                            <div class="h-2 bg-gray-600 rounded w-1/2"></div>
                            <div class="flex space-x-2">
                              <div class="h-2 w-2 bg-gray-500 rounded-full"></div>
                              <div class="h-2 bg-gray-600 rounded flex-1"></div>
                            </div>
                            <div class="flex space-x-2">
                              <div class="h-2 w-2 bg-gray-500 rounded-full"></div>
                              <div class="h-2 bg-gray-600 rounded flex-1"></div>
                            </div>
                          </div>
                        </div>
                        <span class="text-sm font-medium">Dark</span>
                      </div>
                    </div>
                  </FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ field }" name="fontFamily">
          <FormItem>
            <FormLabel>Font Family</FormLabel>
            <Select :model-value="field.value" @update:model-value="field.onChange">
              <FormControl>
                <SelectTrigger class="cursor-pointer">
                  <SelectValue placeholder="Select a font" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="inter">Inter</SelectItem>
                <SelectItem value="roboto">Roboto</SelectItem>
                <SelectItem value="system">System Default</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ field }" name="fontSize">
          <FormItem>
            <FormLabel>Font Size</FormLabel>
            <Select :model-value="field.value" @update:model-value="field.onChange">
              <FormControl>
                <SelectTrigger class="cursor-pointer">
                  <SelectValue placeholder="Select font size" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        </FormField>

        <!-- Layout Section -->
        <FormField v-slot="{ field }" name="sidebarWidth">
          <FormItem>
            <FormLabel>Sidebar Width</FormLabel>
            <Select :model-value="field.value" @update:model-value="field.onChange">
              <FormControl>
                <SelectTrigger class="cursor-pointer">
                  <SelectValue placeholder="Select sidebar width" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="compact">Compact</SelectItem>
                <SelectItem value="comfortable">Comfortable</SelectItem>
                <SelectItem value="spacious">Spacious</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ field }" name="contentWidth">
          <FormItem>
            <FormLabel>Content Width</FormLabel>
            <Select :model-value="field.value" @update:model-value="field.onChange">
              <FormControl>
                <SelectTrigger class="cursor-pointer">
                  <SelectValue placeholder="Select content width" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="fixed">Fixed</SelectItem>
                <SelectItem value="fluid">Fluid</SelectItem>
                <SelectItem value="container">Container</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        </FormField>

        <div class="flex space-x-2 mt-12">
          <Button type="submit" class="cursor-pointer">Save Preferences</Button>
          <Button variant="outline" type="button" class="cursor-pointer">Cancel</Button>
        </div>
      </Form>
    </div>
  </BaseLayout>
</template>
