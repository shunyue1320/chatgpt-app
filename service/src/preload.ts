import * as dotenv from 'dotenv'
import fetch from 'node-fetch'

dotenv.config()
globalThis.fetch = fetch // 提供给 chatgpt 使用
