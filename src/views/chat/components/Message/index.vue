<script setup lang="ts">
import { ref } from 'vue'
import AvatarComponent from './Avatar.vue'
import TextComponent from './Text.vue'

interface MessageProps {
  dateTime?: string
  text?: string
  inversion?: boolean
  error?: boolean
  loading?: boolean
}
const props = defineProps<MessageProps>()

const asRawText = ref(props.inversion)
</script>

<template>
  <div class="flex w-full mb-6 overflow-hidden items-start" :class="[{ 'flex-row-reverse': inversion }]">
    <div
      class="flex items-center justify-center flex-shrink-0"
      :class="[inversion ? 'ml-2' : 'mr-2']"
    >
      <AvatarComponent :image="inversion" />
    </div>
    <div class="overflow-hidden text-sm" :class="[inversion ? 'items-end' : 'items-start']">
      <p class="text-xs text-gray-400" :class="[inversion ? 'text-right' : 'text-left']">
        {{ dateTime }}
      </p>
      <div
        class="flex items-end gap-1 mt-2"
        :class="[inversion ? 'flex-row-reverse' : 'flex-row']"
      >
        <TextComponent
          :inversion="inversion"
          :error="error"
          :text="text"
          :loading="loading"
          :as-raw-text="asRawText"
        />
      </div>
    </div>
  </div>
</template>
