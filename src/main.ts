import './styles'

import { createApp } from 'vue'
import App from './App.vue'
import { setupStore } from './store'
import { setupRouter } from './router'
import { setupNaiveStyleOverride } from './plugins'

async function bootstrap() {
  const app = createApp(App)

  setupNaiveStyleOverride()

  setupStore(app)

  await setupRouter(app)

  app.mount('#app')
}

bootstrap()
