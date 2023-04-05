import type { AxiosProgressEvent, GenericAbortSignal } from 'axios'
import { post } from '@/utils/request'
import { useSettingStore } from '@/store'

export function fetchChatAPIProcess<T = any>(
  params: {
    prompt: string
    options?: { conversationId?: string; parentMessageId?: string }
    signal?: GenericAbortSignal
    onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void
  },
) {
  const settingStore = useSettingStore()

  return post<T>({
    url: '/chat-process',
    data: { prompt: params.prompt, options: params.options, systemMessage: settingStore.systemMessage },
    signal: params.signal,
    onDownloadProgress: params.onDownloadProgress,
  })
}
