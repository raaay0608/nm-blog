import KoaRouter from 'koa-router'

export const router = new KoaRouter()

router.get('/', async (ctx, next) => {
  await ctx.render('index', {})
})

export default router
