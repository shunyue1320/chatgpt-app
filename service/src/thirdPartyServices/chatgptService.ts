import fetch from 'node-fetch'
import type { ChatGPTAPIOptions, ChatMessage, SendMessageBrowserOptions, SendMessageOptions } from 'chatgpt'
import { ChatGPTAPI, ChatGPTUnofficialProxyAPI } from 'chatgpt'
import { SocksProxyAgent } from 'socks-proxy-agent'
import { HttpsProxyAgent } from 'https-proxy-agent'
import { ErrorCodeMessage } from '../constants/error'
import type { RequestOptions } from '../typings/chatgptService'
import type { ApiModel, ChatGPTUnofficialProxyAPIOptions } from '../typings/chatgptController'
import { isNotEmptyString } from '../utils/is'
import { sendResponse } from '../utils/response'

if (!isNotEmptyString(process.env.OPENAI_API_KEY) && !isNotEmptyString(process.env.OPENAI_ACCESS_TOKEN))
  throw new Error('环境变量 OPENAI_API_KEY 或 OPENAI_ACCESS_TOKEN 必须填写一个')

const timeoutMs: number = isNaN(Number(process.env.TIMEOUT_MS)) ? 30 * 1000 : Number(process.env.TIMEOUT_MS)
const model = isNotEmptyString(process.env.OPENAI_API_MODEL) ? process.env.OPENAI_API_MODEL : 'gpt-3.5-turbo'

let apiModel: ApiModel
let api: ChatGPTAPI | ChatGPTUnofficialProxyAPI

// chatgpt api 文档: https://github.com/transitive-bullshit/chatgpt-api
(async () => {
  // 使用 OPENAI_API_KEY
  if (isNotEmptyString(process.env.OPENAI_API_KEY)) {
    const OPENAI_API_BASE_URL = process.env.OPENAI_API_BASE_URL

    const options: ChatGPTAPIOptions = {
      apiKey: process.env.OPENAI_API_KEY,
      completionParams: { model },
      debug: true,
    }

    // 如果使用gpt-4，则增加最大令牌限制
    if (model.toLowerCase().includes('gpt-4')) {
      // 使用32k型号, 增加最大令牌限制
      if (model.toLowerCase().includes('32k')) {
        options.maxModelTokens = 32768
        options.maxResponseTokens = 8192
      }
      else {
        options.maxModelTokens = 8192
        options.maxResponseTokens = 2048
      }
    }

    if (isNotEmptyString(OPENAI_API_BASE_URL))
      options.apiBaseUrl = `${OPENAI_API_BASE_URL}/v1`

    setupProxy(options)
    api = new ChatGPTAPI({ ...options })
    apiModel = 'ChatGPTAPI'
  }
  // 使用 OPENAI_ACCESS_TOKEN
  else {
    const options: ChatGPTUnofficialProxyAPIOptions = {
      accessToken: process.env.OPENAI_ACCESS_TOKEN,
      model,
      debug: true,
    }

    setupProxy(options)
    api = new ChatGPTUnofficialProxyAPI({ ...options })
    apiModel = 'ChatGPTUnofficialProxyAPI'
  }
})()

export function currentModel(): ApiModel {
  return apiModel
}

function setupProxy(options: ChatGPTAPIOptions | ChatGPTUnofficialProxyAPIOptions) {
  // 如果存在 SOCKS 代理
  if (process.env.SOCKS_PROXY_HOST && process.env.SOCKS_PROXY_PORT) {
    // 创建 SocksProxyAgent 代理实例
    const agent = new SocksProxyAgent({
      hostname: process.env.SOCKS_PROXY_HOST,
      port: process.env.SOCKS_PROXY_PORT,
    })
    // 重写 fetch 方法
    options.fetch = (url, options) => {
      return fetch(url, { agent, ...options })
    }
  }
  // 如果存在 HTTPS 代理
  else if (process.env.HTTPS_PROXY || process.env.ALL_PROXY) {
    const httpsProxy = process.env.HTTPS_PROXY || process.env.ALL_PROXY
    if (httpsProxy) {
      // 创建 HttpsProxyAgent 代理实例
      const agent = new HttpsProxyAgent(httpsProxy)
      options.fetch = (url, options) => {
        return fetch(url, { agent, ...options })
      }
    }
  }
}

export async function chatReplyProcess(options: RequestOptions) {
  const { message, lastContext, process, systemMessage, temperature, top_p } = options
  try {
    let response: ChatMessage

    if (apiModel === 'ChatGPTAPI') {
      const options: SendMessageOptions = { timeoutMs }
      options.completionParams = { model, temperature, top_p }
      // 添加聊天前置 prompt 提示语
      if (isNotEmptyString(systemMessage))
        options.systemMessage = systemMessage
      // 携带历史消息id
      if (lastContext)
        options.parentMessageId = lastContext.parentMessageId

      response = await api.sendMessage(message, {
        ...options,
        // 消息回复过程
        onProgress: (partialResponse) => {
          process?.(partialResponse)
        },
      })
    }
    else if (apiModel === 'ChatGPTUnofficialProxyAPI') {
      const options: SendMessageBrowserOptions = { timeoutMs }
      if (lastContext)
        options.parentMessageId = lastContext.parentMessageId

      response = await api.sendMessage(message, {
        ...options,
        onProgress: (partialResponse) => {
          process?.(partialResponse)
        },
      })
    }

    return sendResponse({ type: 'Success', data: response })
  }
  catch (error) {
    const code = error.statusCode
    global.console.log(error)
    if (Reflect.has(ErrorCodeMessage, code))
      return sendResponse({ type: 'Fail', message: ErrorCodeMessage[code] })
    return sendResponse({ type: 'Fail', message: error.message ?? 'Please check the back-end console' })
  }
}
