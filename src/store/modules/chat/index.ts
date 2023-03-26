import { defineStore } from 'pinia'
import { getLocalState, setLocalState } from './storage'

export const useChatStore = defineStore('chat-store', {
  state: (): Chat.ChatState => getLocalState(),

  actions: {
    addChatByUuid(uuid: number, chat: Chat.Chat) {
      if (!uuid) {
        if (this.history.length === 0) {
          const uuid = Date.now()
          this.history.push({ uuid, title: chat.text, isEdit: false })
          this.chat.push({ uuid, data: [chat] })
          this.active = uuid
          this.recordState()
        }
        else {
          this.chat[0].data.push(chat)
          if (this.history[0].title === 'New Chat')
            this.history[0].title = chat.text

          this.recordState()
        }
        return
      }

      const index = this.chat.findIndex(item => item.uuid === uuid)
      if (index !== -1) {
        this.chat[index].data.push(chat)
        if (this.history[index].title === 'New Chat')
          this.history[index].title = chat.text

        this.recordState()
      }
    },
    recordState() {
      setLocalState(this.$state)
    },
  },
})
