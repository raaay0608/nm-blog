import KoaRouter from 'koa-router'
// import KoaJWT from 'koa-jwt'
import jwt from 'jsonwebtoken'
import config from 'config'

export const router = new KoaRouter()

router.get('/token', async (ctx, next) => {
  ctx.body = {
    admin: ctx.state.admin
  }
})

router.post('/token', async (ctx, next) => {
  const [username, password] = [ctx.request.body.username, ctx.request.body.password]
  if (username !== config.get('admin.username') || password !== config.get('admin.password')) {
    ctx.status = 400
    ctx.body = {
      success: false,
      message: 'Invalid username or password'
    }
    return
  }
  const token = jwt.sign({ admin: true }, config.get('secret'))
  ctx.body = {
    token,
    success: true
  }
})

export default router
