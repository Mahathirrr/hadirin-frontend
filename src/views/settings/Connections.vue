<script setup lang="ts">
import {
  Apple,
  Chrome,
  Database,
  Dribbble,
  Facebook,
  Github,
  Globe,
  Instagram,
  Slack,
  Twitter,
  Zap,
} from 'lucide-vue-next'
import { ref } from 'vue'

import BaseLayout from '@/components/layouts/base-layout.vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'

const appleConnected = ref(true)
const googleConnected = ref(false)
const githubConnected = ref(true)
const slackConnected = ref(false)
const zapierConnected = ref(true)
const webhooksConnected = ref(false)
const dbConnected = ref(true)
</script>

<template>
  <BaseLayout>
    <div class="space-y-6 px-4 lg:px-6">
      <div>
        <h1 class="text-3xl font-bold">Connections</h1>
        <p class="text-muted-foreground">Connect your account with third-party services and integrations.</p>
      </div>

      <div class="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Connected Accounts</CardTitle>
            <CardDescription>Display content from your connected accounts on your site</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-6">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <Apple class="h-8 w-8" />
                  <div>
                    <div class="font-medium">Apple</div>
                    <div class="text-sm text-muted-foreground">Calendar and contacts</div>
                  </div>
                </div>
                <Switch class="cursor-pointer" :checked="appleConnected" @update:checked="appleConnected = $event" />
              </div>
              <Separator />
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <Chrome class="h-8 w-8" />
                  <div>
                    <div class="font-medium">Google</div>
                    <div class="text-sm text-muted-foreground">Calendar and contacts</div>
                  </div>
                </div>
                <Switch class="cursor-pointer" :checked="googleConnected" @update:checked="googleConnected = $event" />
              </div>
              <Separator />
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <Github class="h-8 w-8" />
                  <div>
                    <div class="font-medium">Github</div>
                    <div class="text-sm text-muted-foreground">Manage your Git repositories</div>
                  </div>
                </div>
                <Switch class="cursor-pointer" :checked="githubConnected" @update:checked="githubConnected = $event" />
              </div>
              <Separator />
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <Slack class="h-8 w-8" />
                  <div>
                    <div class="font-medium">Slack</div>
                    <div class="text-sm text-muted-foreground">Communication</div>
                  </div>
                </div>
                <Switch class="cursor-pointer" :checked="slackConnected" @update:checked="slackConnected = $event" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Social Accounts</CardTitle>
            <CardDescription>Display content from your connected accounts on your site</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-6">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <Facebook class="h-8 w-8" />
                  <div>
                    <div class="font-medium">
                      Facebook
                      <Badge variant="outline" class="ml-2">Not Connected</Badge>
                    </div>
                    <div class="text-sm text-muted-foreground">Share updates on Facebook</div>
                  </div>
                </div>
                <Button variant="outline" size="icon" class="cursor-pointer"><Globe class="h-4 w-4" /></Button>
              </div>
              <Separator />
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <Twitter class="h-8 w-8" />
                  <div>
                    <div class="font-medium">
                      Twitter
                      <Badge variant="secondary" class="ml-2">connected</Badge>
                    </div>
                    <div class="text-sm text-muted-foreground">Share updates on Twitter</div>
                  </div>
                </div>
                <Button variant="outline" size="icon" class="cursor-pointer text-destructive"><Globe class="h-4 w-4" /></Button>
              </div>
              <Separator />
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <Instagram class="h-8 w-8" />
                  <div>
                    <div class="font-medium">
                      Instagram
                      <Badge variant="secondary" class="ml-2">connected</Badge>
                    </div>
                    <div class="text-sm text-muted-foreground">Stay connected at Instagram</div>
                  </div>
                </div>
                <Button variant="outline" size="icon" class="cursor-pointer text-destructive"><Globe class="h-4 w-4" /></Button>
              </div>
              <Separator />
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <Dribbble class="h-8 w-8" />
                  <div>
                    <div class="font-medium">
                      Dribbble
                      <Badge variant="outline" class="ml-2">Not Connected</Badge>
                    </div>
                    <div class="text-sm text-muted-foreground">Stay connected at Dribbble</div>
                  </div>
                </div>
                <Button variant="outline" size="icon" class="cursor-pointer"><Globe class="h-4 w-4" /></Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div class="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>API Integrations</CardTitle>
            <CardDescription>Configure API connections and webhooks.</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-6">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <Zap class="h-8 w-8" />
                  <div>
                    <div class="font-medium">Zapier</div>
                    <div class="text-sm text-muted-foreground">Automate workflows with Zapier</div>
                  </div>
                </div>
                <Switch class="cursor-pointer" :checked="zapierConnected" @update:checked="zapierConnected = $event" />
              </div>
              <Separator />
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <Globe class="h-8 w-8" />
                  <div>
                    <div class="font-medium">Webhooks</div>
                    <div class="text-sm text-muted-foreground">Configure custom webhook endpoints</div>
                  </div>
                </div>
                <Switch class="cursor-pointer" :checked="webhooksConnected" @update:checked="webhooksConnected = $event" />
              </div>
              <Separator />
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <Database class="h-8 w-8" />
                  <div>
                    <div class="font-medium">Database Sync</div>
                    <div class="text-sm text-muted-foreground">Sync data with external databases</div>
                  </div>
                </div>
                <Switch class="cursor-pointer" :checked="dbConnected" @update:checked="dbConnected = $event" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>API Keys</CardTitle>
            <CardDescription>Manage your API keys and access tokens.</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <div class="font-medium">Production API Key</div>
                  <div class="text-sm text-muted-foreground font-mono">sk_live_••••••••••••••••••••••••4234</div>
                </div>
                <div class="flex space-x-2">
                  <Button variant="outline" size="sm" class="cursor-pointer">Regenerate</Button>
                  <Button variant="outline" size="sm" class="cursor-pointer">Copy</Button>
                </div>
              </div>
              <Separator />
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <div class="font-medium">Development API Key</div>
                  <div class="text-sm text-muted-foreground font-mono">sk_test_••••••••••••••••••••••••5678</div>
                </div>
                <div class="flex space-x-2">
                  <Button variant="outline" size="sm" class="cursor-pointer">Regenerate</Button>
                  <Button variant="outline" size="sm" class="cursor-pointer">Copy</Button>
                </div>
              </div>
              <Separator />
              <div class="pt-4">
                <Button variant="outline" class="cursor-pointer">Add New API Key</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </BaseLayout>
</template>
