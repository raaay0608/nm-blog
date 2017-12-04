import KoaRouter from 'koa-router'

export const router = new KoaRouter()

router.all('*', async (ctx, next) => {
  ctx.throw(404, 'not found')
})

export default router
