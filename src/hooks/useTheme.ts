import { computed, watch } from 'vue'
import useOsTheme from './useOsTheme'

export function useTheme() {
  const OsTheme = useOsTheme()

  const isDark = computed(() => {
    return OsTheme.value === 'dark'
  })

  watch(() => isDark.value, (dark) => {
    if (dark)
      document.documentElement.classList.add('dark')
    else
      document.documentElement.classList.remove('dark')
  }, { immediate: true })
}
