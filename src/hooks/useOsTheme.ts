import { getCurrentInstance, onBeforeMount, onBeforeUnmount, readonly, ref } from 'vue'

type PrefersColorValue = 'dark' | 'light' | 'auto'

const osTheme = ref<PrefersColorValue>()
let darkMql: MediaQueryList | undefined
let lightMql: MediaQueryList | undefined
function handleDarkMqlChange(e: { matches: any }) {
  if (e.matches)
    osTheme.value = 'dark'
}
function handleLightMqlChange(e: { matches: any }) {
  if (e.matches)
    osTheme.value = 'light'
}
function init() {
  darkMql = window.matchMedia('(prefers-color-scheme: dark)')
  lightMql = window.matchMedia('(prefers-color-scheme: light)')
  if (darkMql.matches)
    osTheme.value = 'dark'
  else if (lightMql.matches)
    osTheme.value = 'light'
  else
    osTheme.value = 'auto'

  if (darkMql.addEventListener) {
    darkMql.addEventListener('change', handleDarkMqlChange)
    lightMql.addEventListener('change', handleLightMqlChange)
  }
}
function clean() {
  if (darkMql && lightMql) {
    if ('removeEventListener' in darkMql) {
      darkMql.removeEventListener('change', handleDarkMqlChange)
      lightMql.removeEventListener('change', handleLightMqlChange)
    }
  }
  darkMql = undefined
  lightMql = undefined
}

let usedCount = 0
let managable = true
export default function useOsTheme() {
  if (usedCount === 0)
    init()

  // eslint-disable-next-line no-cond-assign
  if (managable && (managable = hasInstance())) {
    onBeforeMount(() => {
      usedCount += 1
    })
    onBeforeUnmount(() => {
      usedCount -= 1
      if (usedCount === 0)
        clean()
    })
  }
  return readonly(osTheme)
}

function hasInstance() {
  return getCurrentInstance() !== null
}
