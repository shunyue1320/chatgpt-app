import Router from '@koa/router'
import type { ChatMessage } from 'chatgpt'
import { isNotEmptyString } from '../utils/is'
import type { RequestProps } from '../typings/chatgptController'
import { chatReplyProcess, currentModel } from '../thirdPartyServices/chatgptService'

const router = new Router()

router.post('/chat-process', async (ctx) => {
  ctx.set('Content-type', 'application/octet-stream')

  try {
    const { prompt, options = {}, systemMessage, temperature, top_p } = ctx.request.body as RequestProps
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
      temperature,
      top_p,
    })
  }
  catch (error) {
    ctx.res.write(JSON.stringify(error))
  }
  finally {
    ctx.res.end()
  }
})

router.post('/session', async (ctx) => {
  try {
    const AUTH_SECRET_KEY = process.env.AUTH_SECRET_KEY
    const hasAuth = isNotEmptyString(AUTH_SECRET_KEY)
    ctx.body = { status: 'Success', message: '', data: { auth: hasAuth, model: currentModel() } }
  }
  catch (error) {
    ctx.body = { status: 'Fail', message: error.message, data: null }
  }
})

router.post('/verify', async (ctx) => {
  try {
    const { token } = ctx.request.body as { token: string }
    if (!token)
      throw new Error('密钥为空 | Secret key is empty')

    if (process.env.AUTH_SECRET_KEY !== token)
      throw new Error('密钥无效 | Secret key is invalid')

    ctx.body = { status: 'Success', message: '验证成功！', data: null }
  }
  catch (error) {
    ctx.body = { status: 'Fail', message: error.message, data: null }
  }
})

export default router
