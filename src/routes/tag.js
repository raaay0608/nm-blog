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

router.get('/tags/:tagSlug', async function (ctx, next) {
  switch (ctx.accepts('json', 'html')) {
    case 'json':
      const tagSlug = ctx.params.tagSlug
      const tag = await Tag.get({ slug: tagSlug })
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

router.patch('/tags/:tagSlug', async function (ctx, next) {
  switch (ctx.accepts('json')) {
    case 'json':
      const tagSlug = ctx.params.tagSlug
      const data = ctx.request.body
      const tag = await Tag.modify({ slug: tagSlug }, data)
      ctx.body = {
        tag: tag
      }
      break
    default:
      ctx.throw(406)
  }
})

router.delete('/tags/:tagSlug', async function (ctx, next) {
  switch (ctx.accepts('json')) {
    case 'json':
      const tagSlug = ctx.params.tagSlug
      const res = await Tag.delete({ slug: tagSlug })
      ctx.body = res
      break
    default:
      ctx.throw(406)
  }
})

export default router
