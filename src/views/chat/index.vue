<script setup lang='ts'>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { NAutoComplete, NButton, NInput } from 'naive-ui'
import { useChat } from './hooks/useChat'

let controller: AbortController

const prompt = ref<string>('')
const route = useRoute()
const { addChat } = useChat()

const { uuid } = route.params as { uuid: string }

function handleSubmit() {
  onConversation()
}
async function onConversation() {
  const message = prompt.value
  if (!message || message.trim() === '')
    return

  controller = new AbortController()

  addChat(
    +uuid, {
      dateTime: new Date().toLocaleString(),
      text: message,
      error: false,
      conversationOptions: null,
      requestOptions: { prompt: message, options: null },
    },
  )

  // scrollToBottom()
}

function handleEnter(event: KeyboardEvent) {
  if (event.key === 'Enter' && event.ctrlKey) {
    event.preventDefault()
    handleSubmit()
  }
}

const placeholder = '输入问题'
</script>

<template>
  <footer class="p-4">
    <div class="w-full max-w-screen-xl m-auto">
      <div class="flex items-center justify-between space-x-2">
        <NAutoComplete v-model.value="prompt">
          <template #default="{ handleInput, handleBlur, handleFocus }">
            <NInput
              v-model.value="prompt"
              type="textarea"
              :placeholder="placeholder"
              :autosize="{ minRows: 1, maxRows: 8 }"
              @input="handleInput"
              @focus="handleFocus"
              @blur="handleBlur"
              @keypress="handleEnter"
            />
          </template>
        </NAutoComplete>
        <NButton type="primary" @click="handleSubmit">
          <template #icon>
            <span class="dark:text-black">
              发送
            </span>
          </template>
        </NButton>
      </div>
    </div>
  </footer>
</template>
