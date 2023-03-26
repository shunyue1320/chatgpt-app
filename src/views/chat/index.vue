<script setup lang='ts'>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
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
}
</script>

<template>
  <footer>
    <div class="col-span-full">
      <div class="mt-2 flex items-center gap-x-3">
        <input v-model="prompt" type="textarea" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
        <button class="rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" @click="handleSubmit">
          Send
        </button>
      </div>
    </div>
  </footer>
</template>
