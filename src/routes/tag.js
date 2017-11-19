import KoaRouter from 'koa-router'

import Tag from '~/models/tag'

export const router = new KoaRouter()

router.get('/tags', async function (ctx, next) {
  switch (ctx.accepts('json', 'html')) {
    case 'json':
      const tags = await Tag.list()
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
      const data = ctx.request.body
      const tag = await Tag.create(data)
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
      const tagName = ctx.params.tagName
      const tag = await Tag.get({ name: tagName })
      ctx.body = {
        tag: tag
      }
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
      const tagName = ctx.params.tagName
      const data = ctx.request.body
      const tag = await Tag.modify({ name: tagName }, data)
      ctx.body = {
        tag: tag
      }
      break
    default:
      ctx.throw(406)
  }
})

router.delete('/tags/:tagName', async function (ctx, next) {
  switch (ctx.accepts('json')) {
    case 'json':
      const tagName = ctx.params.tagName
      const tag = await Tag.delete({ name: tagName })
      ctx.body = {
        tag: tag
      }
      break
    default:
      ctx.throw(406)
  }
})

export default router
