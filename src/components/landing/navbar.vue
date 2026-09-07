<script setup lang="ts">
import { Menu, X } from 'lucide-vue-next'
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
</script>

<template>
  <header class="sticky top-0 z-50 w-full border-b border-border/50 bg-background/90 backdrop-blur-xl supports-[backdrop-filter]:bg-background/75">
    <div class="container mx-auto flex h-[4.5rem] items-center justify-between px-4 sm:px-6 lg:px-8">
      <RouterLink to="/" class="group flex cursor-pointer items-center gap-3.5">
        <Logo :size="44" class="shrink-0 transition-transform group-hover:scale-[1.02]" />
        <div class="flex flex-col leading-none">
          <span class="text-xl font-bold tracking-tight text-foreground sm:text-2xl">Hadirin</span>
          <span class="hidden text-[11px] font-medium text-muted-foreground sm:block">Presensi & Operasional</span>
        </div>
      </RouterLink>

      <NavigationMenu class="hidden lg:flex">
        <NavigationMenuList class="gap-0.5 rounded-full border border-border/60 bg-muted/40 p-1">
          <NavigationMenuItem v-for="item in navigationItems" :key="item.name">
            <NavigationMenuLink
              class="inline-flex h-10 cursor-pointer items-center justify-center rounded-full px-4 text-[15px] font-medium text-muted-foreground transition-colors hover:bg-background hover:text-foreground focus:outline-none"
              @click="handleDesktopLink($event, item.href)"
            >
              {{ item.name }}
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <div class="hidden items-center gap-3 lg:flex">
        <ModeToggle variant="ghost" />
        <Button variant="ghost" class="h-10 px-4 text-[15px] font-medium cursor-pointer" as-child>
          <RouterLink to="/auth/sign-in">Masuk</RouterLink>
        </Button>
        <Button class="h-10 px-5 text-[15px] font-semibold cursor-pointer" as-child>
          <RouterLink to="/auth/sign-up">Mulai Gratis</RouterLink>
        </Button>
      </div>

      <div class="flex items-center gap-2 lg:hidden">
        <ModeToggle variant="ghost" />
        <Sheet :open="isOpen" @update:open="(v: boolean) => (isOpen = v)">
          <SheetTrigger as-child>
            <Button variant="ghost" size="icon" class="size-10 cursor-pointer">
              <Menu class="size-5" />
              <span class="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" class="flex h-full w-full flex-col gap-0 overflow-hidden p-0 sm:w-[400px] [&>button]:hidden">
            <div class="flex h-full flex-col">
              <SheetHeader class="space-y-0 border-b border-border/40 p-5 pb-4">
                <div class="flex items-center gap-3">
                  <Logo :size="36" class="shrink-0" />
                  <SheetTitle class="text-lg font-bold">Hadirin</SheetTitle>
                  <Button variant="ghost" size="icon" class="ml-auto size-9 cursor-pointer" @click="isOpen = false">
                    <X class="size-4" />
                  </Button>
                </div>
              </SheetHeader>

              <div class="flex-1 overflow-y-auto">
                <nav class="space-y-1 p-5">
                  <a
                    v-for="item in navigationItems"
                    :key="item.name"
                    :href="item.href"
                    class="flex cursor-pointer items-center rounded-xl px-4 py-3.5 text-base font-medium text-foreground transition-colors hover:bg-muted"
                    @click="handleMobileLink($event, item.href)"
                  >
                    {{ item.name }}
                  </a>
                </nav>
              </div>

              <div class="space-y-3 border-t border-border/40 p-5">
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
