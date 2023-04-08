import type { Router } from 'vue-router'
import { useAuthStore } from '@/store/modules/auth'

export function setupPageGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore()
    if (!authStore.session) {
      try {
        const data = await authStore.getSession()
        if (String(data.auth) === 'false' && authStore.token)
          authStore.removeToken()
      }
      finally {
        next()
      }
    }
    else {
      next()
    }
  })
}
