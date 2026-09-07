<script setup lang="ts">
import { Code, Crown, Github, Layout, Palette } from 'lucide-vue-next'
import type { Component } from 'vue'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CardDecorator } from '@/components/ui/card-decorator'

interface Value {
  icon: Component
  title: string
  description: string
}

const values: Value[] = [
  {
    icon: Code,
    title: 'Developer First',
    description: 'Every component is built with the developer experience in mind, ensuring clean code and easy integration.',
  },
  {
    icon: Palette,
    title: 'Design Excellence',
    description: 'We maintain the highest design standards, following shadcn/ui principles and modern UI patterns.',
  },
  {
    icon: Layout,
    title: 'Production Ready',
    description: 'Battle-tested components used in real applications with proven performance and reliability across different environments.',
  },
  {
    icon: Crown,
    title: 'Premium Quality',
    description: 'Hand-crafted with attention to detail and performance optimization, ensuring exceptional user experience and accessibility.',
  },
]
</script>

<template>
  <section id="about" class="py-24 sm:py-32">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="mx-auto mb-16 max-w-4xl text-center">
        <Badge variant="outline" class="mb-4">About ShadcnStore</Badge>
        <h2 class="mb-6 text-3xl font-bold tracking-tight sm:text-4xl">
          Built for developers, by developers
        </h2>
        <p class="mb-8 text-lg text-muted-foreground">
          We're passionate about creating the best marketplace for shadcn/ui components and templates.
          Our mission is to accelerate development and help developers build beautiful admin interfaces faster.
        </p>
      </div>

      <!-- Modern Values Grid with Enhanced Design -->
      <div class="mb-12 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 xl:grid-cols-4">
        <Card v-for="(value, index) in values" :key="index" class="group py-2 shadow-xs">
          <CardContent class="p-8">
            <div class="flex flex-col items-center text-center">
              <CardDecorator>
                <component :is="value.icon" class="h-6 w-6" />
              </CardDecorator>
              <h3 class="mt-6 font-medium text-balance">{{ value.title }}</h3>
              <p class="mt-3 text-sm text-muted-foreground">{{ value.description }}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Call to Action -->
      <div class="mt-16 text-center">
        <div class="mb-6 flex items-center justify-center gap-2">
          <span class="text-muted-foreground">❤️ Made with love for the developer community</span>
        </div>
        <div class="flex flex-col justify-center gap-4 sm:flex-row">
          <Button size="lg" class="cursor-pointer" as-child>
            <a href="https://github.com/silicondeck/shadcn-dashboard-landing-template" target="_blank" rel="noopener noreferrer">
              <Github class="mr-2 h-4 w-4" />
              Star on GitHub
            </a>
          </Button>
          <Button size="lg" variant="outline" class="cursor-pointer" as-child>
            <a href="https://discord.com/invite/XEQhPc9a6p" target="_blank" rel="noopener noreferrer">
              Join Discord Community
            </a>
          </Button>
        </div>
      </div>
    </div>
  </section>
</template>
