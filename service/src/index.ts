import './preload'
import Koa from 'koa'
import serve from 'koa-static'
import bodyparser from 'koa-bodyparser'
import cors from '@koa/cors'
import chatgptRouter from './controllers/chatgptController'

const app = new Koa()

app.use(serve('public'))
app.use(bodyparser())
app.use(cors({ origin: '*' }))

// app.use(async (ctx, next) => {
//   ctx.set('Access-Control-Allow-Origin', '*')
//   ctx.set('Access-Control-Allow-Headers', 'authorization, Content-Type')
//   ctx.set('Access-Control-Allow-Methods', '*')
//   await next()
// })

app.use(chatgptRouter.routes())

app.listen(3010, () => {
  globalThis.console.log('Server started on port 3010')
})
