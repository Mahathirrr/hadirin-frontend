<script setup lang="ts">
import { BarChart3, Building2, Crown, Database, Layout, Package, Palette, Rocket, Settings, Shield, Zap } from 'lucide-vue-next'
import type { Component } from 'vue'

interface MenuItem {
  title: string
  description: string
  icon: Component
  href: string
}

interface MenuSection {
  title: string
  items: MenuItem[]
}

const menuSections: MenuSection[] = [
  {
    title: 'Browse Products',
    items: [
      { title: 'Free Blocks', description: 'Essential UI components and sections', icon: Package, href: '#free-blocks' },
      { title: 'Premium Templates', description: 'Complete page templates and layouts', icon: Crown, href: '#premium-templates' },
      { title: 'Admin Dashboards', description: 'Full-featured dashboard solutions', icon: BarChart3, href: '#admin-dashboards' },
      { title: 'Landing Pages', description: 'Marketing and product landing templates', icon: Layout, href: '#landing-pages' },
    ],
  },
  {
    title: 'Categories',
    items: [
      { title: 'E-commerce', description: 'Online store admin panels and components', icon: Building2, href: '#ecommerce' },
      { title: 'SaaS Dashboards', description: 'Application admin interfaces', icon: Rocket, href: '#saas-dashboards' },
      { title: 'Analytics', description: 'Data visualization and reporting templates', icon: BarChart3, href: '#analytics' },
      { title: 'Authentication', description: 'Login, signup, and user management pages', icon: Shield, href: '#authentication' },
    ],
  },
  {
    title: 'Resources',
    items: [
      { title: 'Documentation', description: 'Integration guides and setup instructions', icon: Database, href: '#docs' },
      { title: 'Component Showcase', description: 'Interactive preview of all components', icon: Palette, href: '#showcase' },
      { title: 'GitHub Repository', description: 'Open source foundation and community', icon: Settings, href: '#github' },
      { title: 'Design System', description: 'shadcn/ui standards and customization', icon: Zap, href: '#design-system' },
    ],
  },
]
</script>

<template>
  <div class="w-[700px] max-w-[95vw] bg-background p-4 sm:p-6 lg:p-8">
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3 lg:gap-12">
      <template v-for="section in menuSections" :key="section.title">
        <div class="space-y-4 lg:space-y-6">
          <!-- Section Header -->
          <h3 class="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            {{ section.title }}
          </h3>

          <!-- Section Links -->
          <div class="space-y-3 lg:space-y-4">
            <a
              v-for="item in section.items"
              :key="item.title"
              :href="item.href"
              class="group my-0 block space-y-1 rounded-md p-2 transition-colors hover:bg-accent lg:-mx-3 lg:space-y-2 lg:p-3"
            >
              <div class="flex items-center gap-2 lg:gap-3">
                <component
                  :is="item.icon"
                  class="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary"
                />
                <span class="text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                  {{ item.title }}
                </span>
              </div>
              <p class="ml-6 text-xs leading-relaxed text-muted-foreground lg:ml-7">
                {{ item.description }}
              </p>
            </a>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
