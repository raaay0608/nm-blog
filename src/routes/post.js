import KoaRouter from 'koa-router'

import Post from '~/models/post' // eslint-disable-line no-unused-vars

export const router = new KoaRouter()

router.get('/posts', async function (ctx, next) {
  switch (ctx.accepts('json', 'html')) {
    case 'json':
      const posts = await Post.list()
      ctx.body = {
        posts: posts
      }
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
      const data = ctx.request.body
      const post = await Post.create(data)
      ctx.body = {
        post: post
      }
      break
    default:
      ctx.throw(406)
  }
})

router.get('/posts/:postSlug', async function (ctx, next) {
  switch (ctx.accepts('json', 'html')) {
    case 'json':
      const postSlug = ctx.params.postSlug
      const post = await Post.get({ slug: postSlug })
      ctx.body = {
        post: post
      }
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
      const postSlug = ctx.params.postSlug
      const data = ctx.request.body
      const post = await Post.modifyOne({ slug: postSlug }, data)
      ctx.body = {
        post: post
      }
      break
    default:
      ctx.throw(406)
  }
})

router.delete('/posts/:postSlug', async function (ctx, next) {
  switch (ctx.accepts('json')) {
    case 'json':
      const postSlug = ctx.params.postSlug
      const post = await Post.delete({ slug: postSlug })
      ctx.body = {
        post: post
      }
      break
    default:
      ctx.throw(406)
  }
})

export default router
