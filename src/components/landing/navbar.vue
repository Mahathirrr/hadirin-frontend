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
  <header class="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
    <div class="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
      <div class="flex items-center space-x-2">
        <RouterLink to="/" class="flex cursor-pointer items-center space-x-2">
          <Logo :size="28" class="text-foreground" />
          <span class="font-bold">Hadirin.id</span>
        </RouterLink>
      </div>

      <NavigationMenu class="hidden xl:flex">
        <NavigationMenuList>
          <NavigationMenuItem v-for="item in navigationItems" :key="item.name">
            <NavigationMenuLink
              class="group inline-flex h-10 w-max cursor-pointer items-center justify-center px-4 py-2 text-sm font-medium transition-colors hover:text-primary focus:outline-none focus:text-primary"
              @click="handleDesktopLink($event, item.href)"
            >
              {{ item.name }}
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <div class="hidden items-center space-x-2 xl:flex">
        <ModeToggle variant="ghost" />
        <Button variant="ghost" class="cursor-pointer" as-child>
          <RouterLink to="/auth/sign-in">Masuk</RouterLink>
        </Button>
        <Button class="cursor-pointer" as-child>
          <RouterLink to="/auth/sign-up">Mulai Sekarang</RouterLink>
        </Button>
      </div>

      <Sheet :open="isOpen" @update:open="(v: boolean) => (isOpen = v)">
        <SheetTrigger class="xl:hidden" as-child>
          <Button variant="ghost" size="icon" class="cursor-pointer">
            <Menu class="h-5 w-5" />
            <span class="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" class="flex h-full w-full flex-col gap-0 overflow-hidden p-0 sm:w-[400px] [&>button]:hidden">
          <div class="flex h-full flex-col">
            <SheetHeader class="space-y-0 p-4 pb-2">
              <div class="flex items-center gap-2">
                <Logo :size="20" class="text-foreground" />
                <SheetTitle class="text-lg font-semibold">Hadirin.id</SheetTitle>
                <div class="ml-auto flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    class="h-8 w-8 cursor-pointer"
                    @click="ctx.setTheme(ctx.theme === 'light' ? 'dark' : 'light')"
                  >
                    <Moon class="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Sun class="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  </Button>
                  <Button variant="ghost" size="icon" class="h-8 w-8 cursor-pointer" @click="isOpen = false">
                    <X class="h-4 w-4" />
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
                  class="flex cursor-pointer items-center rounded-lg px-4 py-3 text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                  @click="handleMobileLink($event, item.href)"
                >
                  {{ item.name }}
                </a>
              </nav>
            </div>

            <div class="space-y-4 p-6">
              <div class="grid grid-cols-2 gap-3">
                <Button variant="outline" size="lg" class="cursor-pointer" as-child>
                  <RouterLink to="/auth/sign-in">Masuk</RouterLink>
                </Button>
                <Button class="cursor-pointer" size="lg" as-child>
                  <RouterLink to="/auth/sign-up">Mulai</RouterLink>
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  </header>
</template>
