import Koa from 'koa'
import 'reflect-metadata'
import { useKoaServer } from 'routing-controllers'
import { config as lodenv } from 'dotenv'
//优先于业务代码加载
lodenv()
import * as controllers from './api'
import * as middlewares from './middlewares'
import { createNextMiddleware } from './middlewares/next'
import connection from './db'
import sitemap from './sitemap'

export const dev = process.env.NODE_ENV !== 'production'
export const apiPrefix = '/api/v1'

const port = 3000
;(async () => {
  await connection()

  await sitemap()

  const koaApp = new Koa()

  const nextMiddleware = await createNextMiddleware()
  koaApp.use(nextMiddleware)

  useKoaServer(koaApp, {
    controllers: Object.values(controllers),
    // 确保解析页面的行为在API之前
    middlewares: [...Object.values(middlewares)],
    routePrefix: apiPrefix,
    defaults: { paramOptions: { required: true } },
    defaultErrorHandler: false,
  })

  koaApp.listen(port)
  console.log('app listening  at 3000')
})()
