<script setup lang='ts'>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { NAutoComplete, NButton, NInput } from 'naive-ui'
import { useChat } from './hooks/useChat'
import { Message } from './components'
import { SvgIcon } from '@/components/common'
import { t } from '@/locales'
import { useChatStore } from '@/store'

let controller: AbortController

const chatStore = useChatStore()

const prompt = ref<string>('')
const route = useRoute()
const { addChat } = useChat()

const { uuid } = route.params as { uuid: string }

const dataSources = computed(() => chatStore.getChatByUuid(Number(uuid)))

function handleSubmit() {
  onConversation()
}
async function onConversation() {
  const message = prompt.value
  if (!message || message.trim() === '')
    return

  controller = new AbortController()

  addChat(Number(uuid), {
    dateTime: new Date().toLocaleString(),
    inversion: true,
    text: message,
    error: false,
    conversationOptions: null,
    requestOptions: { prompt: message, options: null },
  })

  // scrollToBottom()
}

function handleEnter(event: KeyboardEvent) {
  if (event.key === 'Enter' && event.ctrlKey) {
    event.preventDefault()
    handleSubmit()
  }
}

const placeholder = t('chat.placeholder')
</script>

<template>
  <div class="flex flex-col w-full h-full">
    <mian class="flex-1 overflow-hidden">
      <div class="h-full overflow-hidden overflow-y-auto">
        <div class="w-full p-2">
          <template v-if="dataSources.length">
            <Message
              v-for="(item, index) of dataSources"
              :key="index"
              :inversion="item.inversion"
              :date-time="item.dateTime"
              :text="item.text"
              :error="item.error"
              :loading="item.loading"
            />
          </template>
          <template v-else>
            <div class="flex items-center justify-center h-full text-gray-300">
              <SvgIcon icon="ri:bubble-chart-fill" class="text-3xl mr-2" />
              <span>没有内容～</span>
            </div>
          </template>
        </div>
      </div>
    </mian>
    <footer class="p-4">
      <div class="w-full m-auto">
        <div class="flex items-center justify-between space-x-2">
          <NAutoComplete v-model:value="prompt">
            <template #default="{ handleInput, handleBlur, handleFocus }">
              <NInput
                v-model:value="prompt"
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
                <SvgIcon icon="ri:send-plane-fill" />
              </span>
            </template>
          </NButton>
        </div>
      </div>
    </footer>
  </div>
</template>
