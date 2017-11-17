import KoaRouter from 'koa-router'

import Post from '~/models/post' // eslint-disable-line no-unused-vars

export const router = new KoaRouter()

router.get('/posts', async function (ctx, next) {
  switch (ctx.accepts('json', 'html')) {
    case 'json':
      const posts = await Post.findMultiple()
      ctx.body = posts
      break
    case 'html':
      break
    default:
      ctx.throw(406)
  }
})

router.post('/posts', async function (ctx, next) {
  switch (ctx.accepts('json')) {
    case 'json':
      break
    default:
      ctx.throw(406)
  }
})

router.get('/posts/:postSlug', async function (ctx, next) {
  switch (ctx.accepts('json', 'html')) {
    case 'json':
      break
    case 'html':
      break
    default:
      ctx.throw(406)
  }
})

router.patch('/posts/:postSlug', async function (ctx, next) {
  switch (ctx.accepts('json')) {
    case 'json':
      break
    default:
      ctx.throw(406)
  }
})

router.delete('/posts/:postSlug', async function (ctx, next) {
  switch (ctx.accepts('json')) {
    case 'json':
      break
    default:
      ctx.throw(406)
  }
})

export default router
