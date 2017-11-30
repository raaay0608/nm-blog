
// must be used after the using of 'koa-jwt'
export default async (ctx, next) => {
  if (ctx.state.user && ctx.state.user.admin) {
    ctx.state.admin = true
    return next()
  }

  ctx.state.admin = false

  const type = ctx.accepts('json', 'html', 'image/*')
  if (type === 'json' && ctx.url !== '/token') {
    // json api is only for admin, thus block it
    return ctx.throw(401)
  }
  return next()
}
