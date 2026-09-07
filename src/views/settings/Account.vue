<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'

import BaseLayout from '@/components/layouts/base-layout.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

const accountFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  currentPassword: z.string().optional(),
  newPassword: z.string().optional(),
  confirmPassword: z.string().optional(),
})

const schema = toTypedSchema(accountFormSchema)

function onSubmit(data: unknown) {
  // eslint-disable-next-line no-console
  console.log('Form submitted:', data)
}
</script>

<template>
  <BaseLayout>
    <div class="space-y-6 px-4 lg:px-6">
      <div>
        <h1 class="text-3xl font-bold">Account Settings</h1>
        <p class="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <Form :validation-schema="schema" class="space-y-6" @submit="onSubmit">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Update your personal information that will be displayed on your profile.
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
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
            </div>
            <FormField v-slot="{ componentField }" name="email">
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input v-bind="componentField" type="email" placeholder="Enter your email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="username">
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input v-bind="componentField" placeholder="Enter your username" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>
              Update your password to keep your account secure.
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <FormField v-slot="{ componentField }" name="currentPassword">
              <FormItem>
                <FormLabel>Current Password</FormLabel>
                <FormControl>
                  <Input v-bind="componentField" type="password" placeholder="Enter current password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="newPassword">
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input v-bind="componentField" type="password" placeholder="Enter new password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="confirmPassword">
              <FormItem>
                <FormLabel>Confirm New Password</FormLabel>
                <FormControl>
                  <Input v-bind="componentField" type="password" placeholder="Confirm new password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Danger Zone</CardTitle>
            <CardDescription>
              Irreversible and destructive actions.
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <Separator />
            <div class="flex flex-wrap gap-2 items-center justify-between">
              <div>
                <h4 class="font-semibold">Delete Account</h4>
                <p class="text-sm text-muted-foreground">
                  Permanently delete your account and all associated data.
                </p>
              </div>
              <Button variant="destructive" type="button" class="cursor-pointer">
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>

        <div class="flex space-x-2">
          <Button type="submit" class="cursor-pointer">Save Changes</Button>
          <Button variant="outline" type="reset" class="cursor-pointer">Cancel</Button>
        </div>
      </Form>
    </div>
  </BaseLayout>
</template>
