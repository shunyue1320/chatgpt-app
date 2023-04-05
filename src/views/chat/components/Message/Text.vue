<script lang="ts" setup>
import { computed } from 'vue'
import MarkdownIt from 'markdown-it'
import mdKatex from '@traptitech/markdown-it-katex'
import hljs from 'highlight.js'
import { t } from '@/locales'

interface Props {
  inversion?: boolean
  error?: boolean
  text?: string
  loading?: boolean
  asRawText?: boolean
}
const props = defineProps<Props>()

const wrapClass = computed(() => {
  return [
    'text-wrap', 'min-w-[20px]', 'rounded-md', 'p-2',
    props.inversion
      ? ['bg-[#d2f9d1]', 'dark:bg-[#a1dc95]', 'message-request']
      : ['bg-[#f4f6f8]', 'dark:bg-[#1e1e20]', 'message-reply'],
    { 'text-red-500': props.error },
  ]
})

function highlightBlock(str: string, lang?: string) {
  return `<pre class="code-block-wrapper"><div class="code-block-header"><span class="code-block-header__lang">${lang}</span><span class="code-block-header__copy">${t('chat.copyCode')}</span></div><code class="hljs code-block-body ${lang}">${str}</code></pre>`
}

const mdi = new MarkdownIt({
  linkify: true,
  highlight(code: string, language: string) {
    const validLang = !!(language && hljs.getLanguage(language))
    if (validLang) {
      const lang = language ?? ''
      return highlightBlock(hljs.highlight(code, { language: lang }).value, lang)
    }
    return highlightBlock(hljs.highlightAuto(code).value, '')
  },
})
// 使用 LaTeX 数学公式
mdi.use(mdKatex, { blockClass: 'katexmath-block rounded-md p-[10px]', errorColor: ' #cc0000' })

const text = computed(() => {
  const value = props.text ?? ''
  if (!props.asRawText)
    return mdi.render(value)

  return value
})
</script>

<template>
  <div class="text-black" :class="wrapClass">
    <div class="leading-relaxed break-words">
      <div v-if="!inversion" class="flex items-end">
        <div v-if="asRawText" class="w-full whitespace-pre-wrap" v-text="text" />
        <div v-else class="w-full markdown-body" v-html="text" />
        <span v-if="loading" class="dark:text-white w-[4px] h-[20px] block animate-blink" />
      </div>
      <div v-else class="w-full" v-text="text" />
    </div>
  </div>
</template>

<style lang="less">
@import url(./text.less);
</style>
