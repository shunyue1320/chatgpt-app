import { defineStore } from 'pinia'
import { getLocalState, setLocalState } from './storage'

export const useChatStore = defineStore('chat-store', {
  state: (): Chat.ChatState => getLocalState(),

  getters: {
    getChatByUuid(state: Chat.ChatState) {
      return (uuid?: number) => {
        if (uuid)
          return state.chat.find(item => item.uuid === uuid)?.data ?? []
        return state.chat.find(item => item.uuid === state.active)?.data ?? []
      }
    },
  },

  actions: {
    addChatByUuid(uuid: number, chat: Chat.Chat) {
      const index = this.chat.findIndex(item => item.uuid === uuid)
      if (index !== -1) {
        this.chat[index].data.push(chat)
        if (this.history[index].title === 'New Chat')
          this.history[index].title = chat.text

        this.recordState()
      }
    },
    updateChatByUuid(uuid: number, index: number, chat: Chat.Chat) {
      const chatIndex = this.chat.findIndex(item => item.uuid === uuid)
      if (chatIndex !== -1) {
        this.chat[chatIndex].data[index] = { ...this.chat[chatIndex].data[index], ...chat }
        this.recordState()
      }
    },
    recordState() {
      setLocalState(this.$state)
    },
  },
})
