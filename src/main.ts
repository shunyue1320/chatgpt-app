import './styles'

import { createApp } from 'vue'
import App from './App.vue'
import { setupStore } from './store'
import { setupRouter } from './router'
import { setupNaiveStyleOverride } from './plugins'
import { setupI18n } from './locales'

async function bootstrap() {
  const app = createApp(App)

  setupNaiveStyleOverride()

  setupStore(app)

  setupI18n(app)

  await setupRouter(app)

  app.mount('#app')
}

bootstrap()
