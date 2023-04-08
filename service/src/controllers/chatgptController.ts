import Router from '@koa/router'
import type { ChatMessage } from 'chatgpt'
import type { RequestProps } from '../typings/chatgptController'
import { chatReplyProcess } from '../thirdPartyServices/chatgptService'

const router = new Router()

router.post('/chat-process', async (ctx) => {
  ctx.set('Content-type', 'application/octet-stream')

  try {
    const { prompt, options = {}, systemMessage } = ctx.request.body as RequestProps
    let firstChunk = true // 标记是否为第一块数据
    await chatReplyProcess({
      message: prompt,
      lastContext: options,
      process: (chat: ChatMessage) => {
        // 以 JSON 字符串形式写入响应流
        ctx.res.write(firstChunk ? JSON.stringify(chat) : `\n${JSON.stringify(chat)}`)
        firstChunk = false
      },
      systemMessage,
    })
  }
  catch (error) {
    ctx.body = JSON.stringify(error)
  }
})

export default router
