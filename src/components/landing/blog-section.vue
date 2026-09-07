<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

interface Blog {
  id: number
  image: string
  category: string
  title: string
  description: string
}

const blogs: Blog[] = [
  { id: 1, image: 'https://ui.shadcn.com/placeholder.svg', category: 'Technology', title: 'AI Development Catalysts', description: 'Exploring how AI-driven tools are transforming software development workflows and accelerating innovation.' },
  { id: 2, image: 'https://ui.shadcn.com/placeholder.svg', category: 'Lifestyle', title: 'Minimalist Living Guide', description: 'Minimalist living approaches that can help reduce stress and create more meaningful daily experiences.' },
  { id: 3, image: 'https://ui.shadcn.com/placeholder.svg', category: 'Design', title: 'Accessible UI Trends', description: 'How modern UI trends are embracing accessibility while maintaining sleek, intuitive user experiences.' },
]
</script>

<template>
  <section id="blog" class="bg-muted/50 py-24 sm:py-32">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="mx-auto mb-16 max-w-2xl text-center">
        <Badge variant="outline" class="mb-4">Latest Insights</Badge>
        <h2 class="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">From our blog</h2>
        <p class="text-lg text-muted-foreground">
          Stay updated with the latest trends, best practices, and insights from our team of experts.
        </p>
      </div>

      <!-- Blog Grid -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card v-for="blog in blogs" :key="blog.id" class="overflow-hidden py-0">
          <CardContent class="px-0">
            <div class="aspect-video">
              <img :src="blog.image" :alt="blog.title" class="size-full object-cover dark:invert dark:brightness-[0.95]" loading="lazy" decoding="async" />
            </div>
            <div class="space-y-3 p-6">
              <p class="text-xs uppercase tracking-widest text-muted-foreground">{{ blog.category }}</p>
              <a href="#" @click.prevent class="cursor-pointer">
                <h3 class="text-xl font-bold transition-colors hover:text-primary">{{ blog.title }}</h3>
              </a>
              <p class="text-muted-foreground">{{ blog.description }}</p>
              <a href="#" @click.prevent class="inline-flex cursor-pointer items-center gap-2 text-primary hover:underline">
                Learn More
                <ArrowRight class="size-4" />
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </section>
</template>
