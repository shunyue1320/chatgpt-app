import fetch from 'node-fetch'
import type { ChatGPTAPIOptions, ChatMessage, SendMessageBrowserOptions, SendMessageOptions } from 'chatgpt'
import { ChatGPTAPI, ChatGPTUnofficialProxyAPI } from 'chatgpt'
import { SocksProxyAgent } from 'socks-proxy-agent'
import httpsProxyAgent from 'https-proxy-agent'
import { ErrorCodeMessage } from '../constants/error'
import type { RequestOptions, SetProxyOptions, UsageResponse } from '../typings/chatgptService'
import type { ApiModel, ChatGPTUnofficialProxyAPIOptions, ModelConfig } from '../typings/chatgptController'
import { isNotEmptyString } from '../utils/is'
import { sendResponse } from '../utils/response'

const { HttpsProxyAgent } = httpsProxyAgent

if (!isNotEmptyString(process.env.OPENAI_API_KEY) && !isNotEmptyString(process.env.OPENAI_ACCESS_TOKEN))
  throw new Error('环境变量 OPENAI_API_KEY 或 OPENAI_ACCESS_TOKEN 必须填写一个')

const debug: boolean = process.env.OPENAI_API_DEBUG === 'true'
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
      debug,
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
      apiReverseProxyUrl: isNotEmptyString(process.env.API_REVERSE_PROXY) ? process.env.API_REVERSE_PROXY : 'https://bypass.churchless.tech/api/conversation',
      model,
      debug,
    }

    setupProxy(options)
    api = new ChatGPTUnofficialProxyAPI({ ...options })
    apiModel = 'ChatGPTUnofficialProxyAPI'
  }
})()

export function currentModel(): ApiModel {
  return apiModel
}

function setupProxy(options: ChatGPTAPIOptions | ChatGPTUnofficialProxyAPIOptions | SetProxyOptions) {
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
  else {
    options.fetch = (url, options) => {
      return fetch(url, { ...options })
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

export async function chatConfig() {
  const usage = await fetchUsage()
  const reverseProxy = process.env.API_REVERSE_PROXY ?? '-'
  const httpsProxy = (process.env.HTTPS_PROXY || process.env.ALL_PROXY) ?? '-'
  const socksProxy = (process.env.SOCKS_PROXY_HOST && process.env.SOCKS_PROXY_PORT)
    ? (`${process.env.SOCKS_PROXY_HOST}:${process.env.SOCKS_PROXY_PORT}`)
    : '-'
  return sendResponse<ModelConfig>({
    type: 'Success',
    data: { apiModel, reverseProxy, timeoutMs, socksProxy, httpsProxy, usage },
  })
}

async function fetchUsage() {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY
  const OPENAI_API_BASE_URL = process.env.OPENAI_API_BASE_URL

  if (!isNotEmptyString(OPENAI_API_KEY))
    return Promise.resolve('-')

  const API_BASE_URL = isNotEmptyString(OPENAI_API_BASE_URL)
    ? OPENAI_API_BASE_URL
    : 'https://api.openai.com'

  const [startDate, endDate] = formatDate()
  // 每月使用量
  const urlUsage = `${API_BASE_URL}/v1/dashboard/billing/usage?start_date=${startDate}&end_date=${endDate}`

  const headers = {
    'Authorization': `Bearer ${OPENAI_API_KEY}`,
    'Content-Type': 'application/json',
  }

  const options = {} as SetProxyOptions

  setupProxy(options)

  try {
    // 获取已使用量
    const useResponse = await options.fetch(urlUsage, { headers })
    if (!useResponse.ok)
      throw new Error('获取使用量失败')
    const usageData = await useResponse.json() as UsageResponse
    const usage = Math.round(usageData.total_usage) / 100
    return Promise.resolve(usage ? `$${usage}` : '-')
  }
  catch (error) {
    global.console.log(error)
    return Promise.resolve('-')
  }
}

function formatDate(): string[] {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth() + 1
  const lastDay = new Date(year, month, 0)
  const formattedFirstDay = `${year}-${month.toString().padStart(2, '0')}-01`
  const formattedLastDay = `${year}-${month.toString().padStart(2, '0')}-${lastDay.getDate().toString().padStart(2, '0')}`
  return [formattedFirstDay, formattedLastDay]
}
