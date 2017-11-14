import path from 'path'
import config from 'config'
import Koa from 'koa'
import KoaBody from 'koa-body'
import KoaViews from 'koa-views'
import KoaStatic from 'koa-static'
import KoaJson from 'koa-json'
import KoaLogger from 'koa-logger'
import KoaOnError from 'koa-onerror'

import router from '~/routes/index'
import db from '@/models'

export const app = new Koa()
export default app

// error handler
KoaOnError(app)

// middlewares
app.use(KoaBody())
app.use(KoaLogger())
app.use(KoaJson())

// static files
app.use(KoaStatic(path.join(__dirname, 'public')))

// views
app.use(KoaViews(path.join(__dirname, 'views'), {extension: 'ejs'}))

// routes
app.use(router.routes(), router.allowedMethods())

app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
})

db.connect(config.get('mongo'))
  .then(conn => {
    console.log(`Server Starts`)
    app.listen('3000')
  })
  .catch(err => {
    console.log('Db connection error')
    console.log(err)
  })
