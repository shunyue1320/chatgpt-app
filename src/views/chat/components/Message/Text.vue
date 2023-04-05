<script lang="ts" setup>
import { computed } from 'vue'

interface Props {
  inversion?: boolean
  error?: boolean
  text?: string
  loading?: boolean
  asRawText?: boolean
}
const props = defineProps<Props>()

const wrapClass = computed(() => {
  return [
    'text-wrap', 'min-w-[20px]', 'rounded-md', 'p-2',
    props.inversion
      ? ['bg-[#d2f9d1]', 'dark:bg-[#a1dc95]', 'message-request']
      : ['bg-[#f4f6f8]', 'dark:bg-[#1e1e20]', 'message-reply'],
    { 'text-red-500': props.error },
  ]
})
</script>

<template>
  <div class="text-black" :class="wrapClass">
    <div class="leading-relaxed break-words">
      <div v-if="!inversion" class="flex items-end">
        <div v-if="asRawText" class="w-full whitespace-pre-wrap" v-text="text" />
        <div v-else class="w-full markdown-body" v-html="text" />
        <span v-if="loading" class="dark:text-white w-[4px] h-[20px] block animate-blink" />
      </div>
      <div v-else class="w-full" v-text="text" />
    </div>
  </div>
</template>

<style lang="less">
@import url(./text.less);
</style>
