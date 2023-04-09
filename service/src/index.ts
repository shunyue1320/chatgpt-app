import './preload'
import path from 'node:path'
import Koa from 'koa'
import serve from 'koa-static'
import bodyparser from 'koa-bodyparser'
import cors from '@koa/cors'
import chatgptRouter from './controllers/chatgptController'

const app = new Koa()

app.use(serve(path.join(__dirname, 'public')))
app.use(bodyparser())
app.use(cors({ origin: '*' }))

app.use(chatgptRouter.routes()).use(chatgptRouter.allowedMethods())

app.listen(3010, () => {
  globalThis.console.log('Server started on http://localhost:3010')
})
