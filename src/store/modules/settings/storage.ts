import { ss } from '@/utils/storage'

const LOCAL_NAME = 'settingsStorage'

export interface SettingsState {
  systemMessage: string
}

export function defaultSetting(): SettingsState {
  return {
    systemMessage: 'You are ChatGPT, a large language model trained by OpenAI. Follow the user\'s instructions carefully. Respond using markdown.',
  }
}

export function getLocalState(): SettingsState {
  const localSetting = ss.get(LOCAL_NAME)
  return { ...defaultSetting(), ...localSetting }
}
