import rateLimit from 'koa2-ratelimit'
import { isNotEmptyString } from '../utils/is'

// 每小时最大请求数
const MAX_REQUEST_PER_HOUR = process.env.MAX_REQUEST_PER_HOUR

const maxCount = (isNotEmptyString(MAX_REQUEST_PER_HOUR) && !isNaN(Number(MAX_REQUEST_PER_HOUR))) ? parseInt(MAX_REQUEST_PER_HOUR) : 0

const limiter = rateLimit({
  interval: 60 * 60 * 1000,
  statusCode: 200,
  max: maxCount,
  message: 'Get out.',
})

export { limiter }
