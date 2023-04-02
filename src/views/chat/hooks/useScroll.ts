import { nextTick, ref } from 'vue'
import type { Ref } from 'vue'

type ScrollElement = HTMLDivElement | null

interface ScrollReturn {
  scrollRef: Ref<ScrollElement>
  scrollToTop: () => Promise<void>
  scrollToBottom: () => Promise<void>
  scrollToBottomIfAtBottom: () => Promise<void>
}

export function useScroll(): ScrollReturn {
  const scrollRef = ref<ScrollElement>(null)

  const scrollToTop = async () => {
    await nextTick()
    if (scrollRef.value)
      scrollRef.value.scrollTop = 0
  }

  const scrollToBottom = async () => {
    await nextTick()
    if (scrollRef.value)
      scrollRef.value.scrollTop = scrollRef.value.scrollHeight
  }

  const scrollToBottomIfAtBottom = async () => {
    await nextTick()
    if (scrollRef.value) {
      const threshold = 100 // 阈值，表示滚动条到底部的距离阈值
      const distanceToBottom = scrollRef.value.scrollHeight - scrollRef.value.scrollTop - scrollRef.value.clientHeight
      if (distanceToBottom <= threshold)
        scrollRef.value.scrollTop = scrollRef.value.scrollHeight
    }
  }

  return {
    scrollRef,
    scrollToTop,
    scrollToBottom,
    scrollToBottomIfAtBottom,
  }
}
