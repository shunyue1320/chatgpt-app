import { defineStore } from 'pinia'
import type { UserState } from './storage'
import { getLocalState } from './storage'

export const useUserStore = defineStore('user-store', {
  state: (): UserState => getLocalState(),
})
