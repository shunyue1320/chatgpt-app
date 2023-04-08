<script setup lang="ts">
import { ref } from 'vue'
import { fetchVerify } from '@/api'
import { useAuthStore } from '@/store'

interface Props {
  visible: boolean
}

defineProps<Props>()

const authStore = useAuthStore()

const token = ref('')
const loading = ref(false)

async function handleVerify() {
  const secretKey = token.value.trim()

  if (!secretKey)
    return

  try {
    loading.value = true
    await fetchVerify(secretKey)
    authStore.setToken(secretKey)
    window.location.reload()
  }
  catch (error: any) {
    authStore.removeToken()
    token.value = ''
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <div v-if="visible" id="crypto-modal" tabindex="-1" aria-hidden="true" class="fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] md:h-full">
    <div class="relative w-full h-full flex items-center justify-center">
      <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
        <div class="p-4 border-b rounded-t dark:border-gray-600">
          <h3 class="text-base font-semibold text-gray-900 lg:text-xl dark:text-white">
            {{ $t('common.verify') }}
          </h3>
        </div>
        <div class="p-4">
          <div class="mb-6">
            <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{{ $t('common.unauthorizedTips') }}</label>
            <input v-model="token" type="password" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="•••••••••" required>
          </div>
          <button class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" @click="handleVerify">
            {{ $t('common.verify') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
