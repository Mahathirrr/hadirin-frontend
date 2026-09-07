<script setup lang="ts">
import { Menu, Moon, Sun, X } from 'lucide-vue-next'
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

import Logo from '@/components/logo.vue'
import ModeToggle from '@/components/mode-toggle.vue'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useTheme } from '@/hooks/useTheme'

interface NavItem {
  name: string
  href: string
}

const navigationItems: NavItem[] = [
  { name: 'Fitur', href: '#features' },
  { name: 'Integrasi', href: '#integrations' },
  { name: 'Solusi', href: '#use-cases' },
  { name: 'Harga', href: '#pricing' },
  { name: 'FAQ', href: '#faq' },
]

function smoothScrollTo(targetId: string) {
  if (!targetId.startsWith('#')) return
  const element = document.querySelector(targetId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

function handleDesktopLink(e: MouseEvent, href?: string) {
  e.preventDefault()
  if (href) smoothScrollTo(href)
}

function handleMobileLink(e: MouseEvent, href?: string) {
  isOpen.value = false
  if (!href?.startsWith('#')) return
  e.preventDefault()
  setTimeout(() => smoothScrollTo(href), 100)
}

const isOpen = ref(false)
const ctx = useTheme()
</script>

<template>
  <header class="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
    <div class="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
      <div class="flex items-center space-x-2">
        <RouterLink to="/" class="flex cursor-pointer items-center space-x-2.5">
          <Logo :size="32" class="shrink-0" />
          <span class="font-bold text-lg tracking-tight text-foreground">Hadirin</span>
        </RouterLink>
      </div>

      <NavigationMenu class="hidden lg:flex">
        <NavigationMenuList class="gap-1">
          <NavigationMenuItem v-for="item in navigationItems" :key="item.name">
            <NavigationMenuLink
              class="group inline-flex h-9 w-max cursor-pointer items-center justify-center rounded-lg px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-muted/60 focus:outline-none"
              @click="handleDesktopLink($event, item.href)"
            >
              {{ item.name }}
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <div class="hidden items-center space-x-2.5 lg:flex">
        <ModeToggle variant="ghost" />
        <Button variant="ghost" size="sm" class="cursor-pointer text-sm font-medium" as-child>
          <RouterLink to="/auth/sign-in">Masuk</RouterLink>
        </Button>
        <Button size="sm" class="cursor-pointer text-sm font-semibold shadow-sm" as-child>
          <RouterLink to="/auth/sign-up">Mulai Gratis</RouterLink>
        </Button>
      </div>

      <div class="flex items-center gap-2 lg:hidden">
        <ModeToggle variant="ghost" />
        <Sheet :open="isOpen" @update:open="(v: boolean) => (isOpen = v)">
          <SheetTrigger as-child>
            <Button variant="ghost" size="icon" class="cursor-pointer">
              <Menu class="size-5" />
              <span class="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" class="flex h-full w-full flex-col gap-0 overflow-hidden p-0 sm:w-[400px] [&>button]:hidden">
            <div class="flex h-full flex-col">
              <SheetHeader class="space-y-0 p-4 pb-2 border-b border-border/40">
                <div class="flex items-center gap-2">
                  <Logo :size="26" class="shrink-0" />
                  <SheetTitle class="text-base font-bold">Hadirin</SheetTitle>
                  <div class="ml-auto flex items-center gap-2">
                    <Button variant="ghost" size="icon" class="size-8 cursor-pointer" @click="isOpen = false">
                      <X class="size-4" />
                    </Button>
                  </div>
                </div>
              </SheetHeader>

              <div class="flex-1 overflow-y-auto">
                <nav class="space-y-1 p-6">
                  <a
                    v-for="item in navigationItems"
                    :key="item.name"
                    :href="item.href"
                    class="flex cursor-pointer items-center rounded-xl px-4 py-3 text-base font-medium text-foreground transition-colors hover:bg-muted"
                    @click="handleMobileLink($event, item.href)"
                  >
                    {{ item.name }}
                  </a>
                </nav>
              </div>

              <div class="space-y-3 p-6 border-t border-border/40">
                <div class="grid grid-cols-2 gap-3">
                  <Button variant="outline" size="lg" class="cursor-pointer font-medium" as-child>
                    <RouterLink to="/auth/sign-in">Masuk</RouterLink>
                  </Button>
                  <Button class="cursor-pointer font-semibold" size="lg" as-child>
                    <RouterLink to="/auth/sign-up">Mulai</RouterLink>
                  </Button>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  </header>
</template>
