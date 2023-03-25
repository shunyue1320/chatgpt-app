import { createApp } from 'vue'
import './styles.css'
import App from './App.vue'
import { setupStore } from './store'
import { setupRouter } from './router'

async function bootstrap() {
  const app = createApp(App)

  setupStore(app)

  await setupRouter(app)

  app.mount('#app')
}

bootstrap()
