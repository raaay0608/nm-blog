
// must be used after the using of 'koa-jwt'
export default async (ctx, next) => {
  if (ctx.state.user && ctx.state.user.admin) {
    ctx.state.admin = true
  } else {
    ctx.state.admin = false
  }
  await next()
}
