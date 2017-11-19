import KoaRouter from 'koa-router'

import Tag from '~/models/tag'

export const router = new KoaRouter()

router.get('/tags', async function (ctx, next) {
  switch (ctx.accepts('json', 'html')) {
    case 'json':
      let tags = await Tag.list()
      ctx.body = {
        tags: tags
      }
      break
    case 'html':
      break
    default:
      ctx.throw(406)
  }
})

router.post('/tags', async function (ctx, next) {
  switch (ctx.accepts('json')) {
    case 'json':
      let data = ctx.request.body
      let tag = await Tag.insertOneAndReturn(data)
      ctx.body = {
        tag: tag
      }
      break
    default:
      ctx.throw(406)
  }
})

router.get('/tags/:tagName', async function (ctx, next) {
  switch (ctx.accepts('json', 'html')) {
    case 'json':
      break
    case 'html':
      break
    default:
      ctx.throw(406)
  }
})

router.patch('/tags/:tagName', async function (ctx, next) {
  switch (ctx.accepts('json')) {
    case 'json':
      break
    default:
      ctx.throw(406)
  }
})

router.delete('/tags/:tagName', async function (ctx, next) {
  switch (ctx.accepts('json')) {
    case 'json':
      break
    default:
      ctx.throw(406)
  }
})

export default router
