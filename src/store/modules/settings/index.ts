import { defineStore } from 'pinia'
import { getLocalState } from './storage'
import type { SettingsState } from './storage'

export const useSettingStore = defineStore('setting-store', {
  state: (): SettingsState => getLocalState(),
})
