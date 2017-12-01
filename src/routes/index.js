import KoaRouter from 'koa-router'

import Post from '~/models/post'

export const router = new KoaRouter()

router.get('/', async (ctx, next) => {
  switch (ctx.accepts('html')) {
    case 'html':
      const posts = await Post.list()
      return ctx.render('index', { posts })
    default:
      ctx.throw(406)
  }
})

export default router
