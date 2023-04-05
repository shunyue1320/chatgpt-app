<script setup lang="ts">
import AvatarComponent from './Avatar.vue'

interface MessageProps {
  dateTime?: string
  text?: string
  inversion?: boolean
  error?: boolean
  loading?: boolean
}

const props = defineProps<MessageProps>()
// export default Vue.extend({
// })
</script>

<template>
  <div class="flex w-full mb-6 overflow-hidden" :class="[{ 'flex-row-reverse': inversion }]">
    <div class="flex items-center justify-center flex-shrink-0">
      <AvatarComponent :image="inversion" />
    </div>
    <div class="overflow-hidden text-sm" :class="[inversion ? 'items-end' : 'items-start']">
      <p class="text-xs text-gray-400" :class="[inversion ? 'text-right' : 'text-left']">
        {{ dateTime }}
      </p>
      <div class="flex items-end gap-1 mt-2">
        1111
      </div>
    </div>
  </div>
</template>
