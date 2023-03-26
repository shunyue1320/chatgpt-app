import { useChatStore } from '@/store'

export function useChat() {
  const chatStore = useChatStore()

  const addChat = (uuid: number, chat: Chat.Chat) => {
    chatStore.addChatByUuid(uuid, chat)
  }

  return {
    addChat,
  }
}
