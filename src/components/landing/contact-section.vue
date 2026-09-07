<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { BookOpen, Github, Mail, MessageCircle } from 'lucide-vue-next'
import { ref } from 'vue'
import { z } from 'zod'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

const schema = toTypedSchema(
  z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters.'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters.'),
    email: z.string().email('Please enter a valid email address.'),
    subject: z.string().min(5, 'Subject must be at least 5 characters.'),
    message: z.string().min(10, 'Message must be at least 10 characters.'),
  }),
)

const formRef = ref()

function onSubmit(values: Record<string, unknown>) {
  console.log(values)
  formRef.value?.resetForm()
}
</script>

<template>
  <section id="contact" class="py-24 sm:py-32">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mx-auto mb-16 max-w-2xl text-center">
        <Badge variant="outline" class="mb-4">Get In Touch</Badge>
        <h2 class="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">Need help or have questions?</h2>
        <p class="text-lg text-muted-foreground">
          Our team is here to help you get the most out of ShadcnStore. Choose the best way to reach out to us.
        </p>
      </div>

      <div class="grid gap-8 lg:grid-cols-3">
        <!-- Contact Options -->
        <div class="order-2 space-y-6 lg:order-1">
          <Card class="cursor-pointer transition-shadow hover:shadow-md">
            <CardHeader>
              <CardTitle class="flex items-center gap-2">
                <MessageCircle class="h-5 w-5 text-primary" />
                Discord Community
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p class="mb-3 text-muted-foreground">Join our active community for quick help and discussions with other developers.</p>
              <Button variant="outline" size="sm" class="cursor-pointer" as-child>
                <a href="https://discord.com/invite/XEQhPc9a6p" target="_blank" rel="noopener noreferrer">Join Discord</a>
              </Button>
            </CardContent>
          </Card>

          <Card class="cursor-pointer transition-shadow hover:shadow-md">
            <CardHeader>
              <CardTitle class="flex items-center gap-2">
                <Github class="h-5 w-5 text-primary" />
                GitHub Issues
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p class="mb-3 text-muted-foreground">Report bugs, request features, or contribute to our open source repository.</p>
              <Button variant="outline" size="sm" class="cursor-pointer" as-child>
                <a href="https://github.com/silicondeck/shadcn-dashboard-landing-template/issues" target="_blank" rel="noopener noreferrer">View on GitHub</a>
              </Button>
            </CardContent>
          </Card>

          <Card class="cursor-pointer transition-shadow hover:shadow-md">
            <CardHeader>
              <CardTitle class="flex items-center gap-2">
                <BookOpen class="h-5 w-5 text-primary" />
                Documentation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p class="mb-3 text-muted-foreground">Browse our comprehensive guides, tutorials, and component documentation.</p>
              <Button variant="outline" size="sm" class="cursor-pointer" as-child>
                <a href="#">View Docs</a>
              </Button>
            </CardContent>
          </Card>
        </div>

        <!-- Contact Form -->
        <div class="order-1 lg:order-2 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle class="flex items-center gap-2">
                <Mail class="h-5 w-5" />
                Send us a message
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form
                ref="formRef"
                :validation-schema="schema"
                class="space-y-6"
                @submit="onSubmit"
              >
                <div class="grid gap-4 sm:grid-cols-2">
                  <FormField v-slot="{ componentField }" name="firstName">
                    <FormItem>
                      <FormLabel>First name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" v-bind="componentField" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                  <FormField v-slot="{ componentField }" name="lastName">
                    <FormItem>
                      <FormLabel>Last name</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" v-bind="componentField" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                </div>
                <FormField v-slot="{ componentField }" name="email">
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john@example.com" v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <FormField v-slot="{ componentField }" name="subject">
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                      <Input placeholder="Component request, bug report, general inquiry..." v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <FormField v-slot="{ componentField }" name="message">
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us how we can help you with ShadcnStore components..."
                        rows="10"
                        class="min-h-50"
                        v-bind="componentField"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <Button type="submit" class="w-full cursor-pointer">Send Message</Button>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </section>
</template>
