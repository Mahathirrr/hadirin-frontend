<script setup lang="ts">
import {
  FileText,
  Image as ImageIcon,
  Mic,
  MoreHorizontal,
  Paperclip,
  Send,
  Smile,
} from 'lucide-vue-next'
import { ref } from 'vue'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface Props {
  sendMessage: (content: string) => void
  disabled?: boolean
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  placeholder: 'Type a message...',
})

const message = ref('')
const isTyping = ref(false)
const textareaEl = ref<HTMLTextAreaElement | null>(null)

function handleSendMessage() {
  const trimmed = message.value.trim()
  if (trimmed && !props.disabled) {
    props.sendMessage(trimmed)
    message.value = ''
    isTyping.value = false
    if (textareaEl.value) {
      textareaEl.value.style.height = 'auto'
    }
  }
}

function handleKeyPress(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    handleSendMessage()
  }
}

function handleInput(event: Event) {
  const el = event.target as HTMLTextAreaElement
  message.value = el.value
  if (textareaEl.value) {
    textareaEl.value.style.height = 'auto'
    textareaEl.value.style.height = `${Math.min(textareaEl.value.scrollHeight, 120)}px`
  }
  // Handle typing indicator
  if (message.value.trim() && !isTyping.value) {
    isTyping.value = true
  } else if (!message.value.trim() && isTyping.value) {
    isTyping.value = false
  }
}

function handleFileUpload(type: 'image' | 'file') {
  // In a real app, this would open a file picker
  // eslint-disable-next-line no-console
  console.log(`Upload ${type}`)
}
</script>

<template>
  <div class="border-t p-4">
    <div class="flex items-end gap-2">
      <!-- Attachment button -->
      <TooltipProvider>
        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger as-child>
              <DropdownMenuTrigger as-child>
                <Button
                  variant="ghost"
                  size="icon"
                  :disabled="props.disabled"
                  class="cursor-pointer disabled:cursor-not-allowed"
                >
                  <Paperclip class="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Attach file</p>
            </TooltipContent>
          </Tooltip>
          <DropdownMenuContent side="top" align="start">
            <DropdownMenuItem
              class="cursor-pointer"
              @click="handleFileUpload('image')"
            >
              <ImageIcon class="mr-2 h-4 w-4" />
              Photo or video
            </DropdownMenuItem>
            <DropdownMenuItem
              class="cursor-pointer"
              @click="handleFileUpload('file')"
            >
              <FileText class="mr-2 h-4 w-4" />
              Document
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TooltipProvider>

      <!-- Message input -->
      <div class="relative flex-1">
        <textarea
          ref="textareaEl"
          :value="message"
          :placeholder="props.placeholder"
          :disabled="props.disabled"
          rows="1"
          :class="cn(
            'min-h-[40px] max-h-[120px] resize-none cursor-text disabled:cursor-not-allowed pr-20',
            'border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 dark:bg-input/30 flex w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 md:text-sm',
          )"
          @input="handleInput"
          @keydown="handleKeyPress"
        />

        <!-- Input action buttons -->
        <div class="absolute right-2 bottom-2 flex items-center gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger as-child>
                <Button
                  variant="ghost"
                  size="sm"
                  :disabled="props.disabled"
                  class="h-6 w-6 cursor-pointer p-0 disabled:cursor-not-allowed"
                >
                  <Smile class="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add emoji</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger as-child>
                <Button
                  variant="ghost"
                  size="sm"
                  :disabled="props.disabled"
                  class="h-6 w-6 cursor-pointer p-0 disabled:cursor-not-allowed"
                >
                  <MoreHorizontal class="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>More options</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <!-- Voice message or send button -->
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger as-child>
            <Button
              v-if="message.trim()"
              :disabled="props.disabled"
              class="cursor-pointer disabled:cursor-not-allowed"
              @click="handleSendMessage"
            >
              <Send class="h-4 w-4" />
            </Button>
            <Button
              v-else
              variant="ghost"
              size="icon"
              :disabled="props.disabled"
              class="cursor-pointer disabled:cursor-not-allowed"
            >
              <Mic class="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{{ message.trim() ? 'Send message' : 'Voice message' }}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>

    <!-- Typing indicator -->
    <div v-if="isTyping" class="text-muted-foreground mt-2 text-xs">
      You are typing...
    </div>
  </div>
</template>
