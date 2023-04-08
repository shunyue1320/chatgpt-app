<script setup lang='ts'>
import { useRouter } from 'vue-router'
const router = useRouter()
router.replace({ name: 'Chat', params: { uuid: 3011 } })
</script>

<template>
  <RouterView v-slot="{ Component, route }">
    <component :is="Component" :key="route.fullPath" />
  </RouterView>
</template>
