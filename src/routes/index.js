import KoaRouter from 'koa-router'

export const router = new KoaRouter()

router.get('/', async (ctx, next) => {
  switch (ctx.accepts('html')) {
    case 'html':
      break
    default:
      ctx.throw(406)
  }
})

export default router
