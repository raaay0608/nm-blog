import KoaRouter from 'koa-router'

import Category from '~/models/category' // eslint-disable-line no-unused-vars

export const router = new KoaRouter()

router.get('/categories', async function (ctx, next) {
  switch (ctx.accepts('json', 'html')) {
    case 'json':
      break
    case 'html':
      break
    default:
      ctx.throw(406)
  }
})

router.post('/categories', async function (ctx, next) {
  switch (ctx.accepts('json')) {
    case 'json':
      break
    default:
      ctx.throw(406)
  }
})

router.get('/categories/:categoryName', async function (ctx, next) {
  switch (ctx.accepts('json', 'html')) {
    case 'json':
      break
    case 'html':
      break
    default:
      ctx.throw(406)
  }
})

router.patch('/categories/:categoryName', async function (ctx, next) {
  switch (ctx.accepts('json')) {
    case 'json':
      break
    default:
      ctx.throw(406)
  }
})

router.delete('/categories/:categoryName', async function (ctx, next) {
  switch (ctx.accepts('json')) {
    case 'json':
      break
    default:
      ctx.throw(406)
  }
})

export default router
