<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { Upload } from 'lucide-vue-next'
import { ref } from 'vue'
import { z } from 'zod'

import BaseLayout from '@/components/layouts/base-layout.vue'
import Logo from '@/components/logo.vue'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'

const userFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  website: z.string().optional(),
  location: z.string().optional(),
  role: z.string().optional(),
  bio: z.string().optional(),
  company: z.string().optional(),
  timezone: z.string().optional(),
  language: z.string().optional(),
})

const schema = toTypedSchema(userFormSchema)

const fileInputRef = ref<HTMLInputElement | null>(null)
const profileImage = ref<string | null>(null)
const useDefaultIcon = ref(true)

function onSubmit(data: unknown) {
  // eslint-disable-next-line no-console
  console.log('Form submitted:', data)
}

function handleFileUpload() {
  fileInputRef.value?.click()
}

function handleFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      profileImage.value = e.target?.result as string
      useDefaultIcon.value = false
    }
    reader.readAsDataURL(file)
  }
}

function handleReset() {
  profileImage.value = null
  useDefaultIcon.value = true
  if (fileInputRef.value) fileInputRef.value.value = ''
}
</script>

<template>
  <BaseLayout title="User Settings" description="Manage your personal information and preferences">
    <div class="px-4 lg:px-6">
      <Form :validation-schema="schema" @submit="onSubmit">
        <Card>
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
            <CardDescription>Update your personal information and preferences</CardDescription>
          </CardHeader>
          <CardContent class="space-y-6">
            <!-- Profile Picture Section -->
            <div class="flex items-center gap-6">
              <div v-if="useDefaultIcon" class="flex h-20 w-20 items-center justify-center rounded-lg">
                <Logo :size="56" />
              </div>
              <Avatar v-else class="h-20 w-20 rounded-lg">
                <AvatarImage :src="profileImage || ''" />
                <AvatarFallback>SS</AvatarFallback>
              </Avatar>
              <div class="flex flex-col gap-2">
                <div class="flex gap-2">
                  <Button variant="default" size="sm" class="cursor-pointer" @click="handleFileUpload">
                    <Upload class="mr-2 h-4 w-4" />
                    Upload new photo
                  </Button>
                  <Button variant="outline" size="sm" class="cursor-pointer" @click="handleReset">
                    Reset
                  </Button>
                </div>
                <p class="text-xs text-muted-foreground">
                  Allowed JPG, GIF or PNG. Max size of 800K
                </p>
              </div>
              <input
                ref="fileInputRef"
                type="file"
                accept="image/jpeg,image/gif,image/png"
                class="hidden"
                @change="handleFileChange"
              />
            </div>

            <Separator class="mb-10" />
            <!-- Form Fields -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField v-slot="{ componentField }" name="firstName">
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input v-bind="componentField" placeholder="Enter your first name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <FormField v-slot="{ componentField }" name="lastName">
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input v-bind="componentField" placeholder="Enter your last name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <FormField v-slot="{ componentField }" name="email">
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input v-bind="componentField" type="email" placeholder="Enter your email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <FormField v-slot="{ componentField }" name="company">
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <FormControl>
                    <Input v-bind="componentField" placeholder="Enter your company" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <FormField v-slot="{ componentField }" name="phone">
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input v-bind="componentField" type="tel" placeholder="Enter your phone number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <FormField v-slot="{ componentField }" name="location">
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input v-bind="componentField" placeholder="Enter your location" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <FormField v-slot="{ componentField }" name="website">
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input v-bind="componentField" type="url" placeholder="Enter your website" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <FormField v-slot="{ field }" name="language">
                <FormItem>
                  <FormLabel>Language</FormLabel>
                  <Select :model-value="field.value" @update:model-value="field.onChange">
                    <FormControl>
                      <SelectTrigger class="w-full">
                        <SelectValue placeholder="Select Language" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="spanish">Spanish</SelectItem>
                      <SelectItem value="french">French</SelectItem>
                      <SelectItem value="german">German</SelectItem>
                      <SelectItem value="italian">Italian</SelectItem>
                      <SelectItem value="portuguese">Portuguese</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              </FormField>

              <FormField v-slot="{ componentField }" name="role">
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <Input v-bind="componentField" placeholder="Enter your role" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <FormField v-slot="{ field }" name="timezone">
                <FormItem>
                  <FormLabel>Timezone</FormLabel>
                  <Select :model-value="field.value" @update:model-value="field.onChange">
                    <FormControl>
                      <SelectTrigger class="w-full">
                        <SelectValue placeholder="Select Timezone" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="pst">PST (Pacific Standard Time)</SelectItem>
                      <SelectItem value="est">EST (Eastern Standard Time)</SelectItem>
                      <SelectItem value="cst">CST (Central Standard Time)</SelectItem>
                      <SelectItem value="mst">MST (Mountain Standard Time)</SelectItem>
                      <SelectItem value="utc">UTC (Coordinated Universal Time)</SelectItem>
                      <SelectItem value="cet">CET (Central European Time)</SelectItem>
                      <SelectItem value="jst">JST (Japan Standard Time)</SelectItem>
                      <SelectItem value="aest">AEST (Australian Eastern Standard Time)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              </FormField>
            </div>

            <!-- Bio - Full Width -->
            <FormField v-slot="{ componentField }" name="bio">
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea v-bind="componentField" placeholder="Tell us a little about yourself..." class="min-h-[100px]" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <!-- Action Buttons -->
            <div class="flex justify-start gap-3">
              <Button type="submit" class="cursor-pointer">Save Changes</Button>
              <Button variant="outline" type="button" class="cursor-pointer">Cancel</Button>
            </div>
          </CardContent>
        </Card>
      </Form>
    </div>
  </BaseLayout>
</template>
