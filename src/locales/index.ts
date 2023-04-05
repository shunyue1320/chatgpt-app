import type { App } from 'vue'
import { createI18n } from 'vue-i18n'

import enUS from './en-US'
import zhCN from './zh-CN'

export type Language = 'zh-CN' | 'en-US'

const i18n = createI18n({
  locale: 'zh-CN',
  fallbackLocale: 'en-US',
  messages: {
    'en-US': enUS,
    'zh-CN': zhCN,
  },
})

export const t = i18n.global.t

export function setLocale(locale: Language) {
  i18n.global.locale = locale
}

export function setupI18n(app: App) {
  app.use(i18n)
}

export default i18n
