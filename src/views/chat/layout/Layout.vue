<script setup lang='ts'>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import PermissionModel from './PermissionModel.vue'
import { useAuthStore } from '@/store'

const router = useRouter()
router.replace({ name: 'Chat', params: { uuid: 3011 } })

const authStore = useAuthStore()

const needPermission = computed(() => !!authStore.session?.auth && !authStore.token)
</script>

<template>
  <RouterView v-slot="{ Component, route }">
    <component :is="Component" :key="route.fullPath" />
  </RouterView>
  <PermissionModel :visible="needPermission" />
</template>
