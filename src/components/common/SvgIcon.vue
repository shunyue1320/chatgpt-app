<script setup lang='ts'>
import { computed, useAttrs } from 'vue'
import { Icon } from '@iconify/vue'

interface IconProps {
  icon: string
}

defineProps<IconProps>()

const attrs = useAttrs()
const bindAttrs = computed<{ class: string; style: string }>(() => ({
  class: (attrs.class as string) || '',
  style: (attrs.style as string) || '',
}))
</script>

<template>
  <Icon :icon="icon" v-bind="bindAttrs" />
</template>
