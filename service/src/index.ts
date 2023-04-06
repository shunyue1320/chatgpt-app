import Koa from 'koa'
import serve from 'koa-static'
import json from 'koa-json'
import cors from '@koa/cors'
import Router from 'koa-router'

const app = new Koa()
const router = new Router()

app.use(serve('public'))
app.use(json())
app.use(cors({ origin: '*' }))

router.post('/chat-process', async (ctx, next) => {
  ctx.set('Content-type', 'application/octet-stream')
  await next()
})

app.use(router.routes())

app.listen(3002, () => {
  globalThis.console.log('Server started on port 3002')
})
