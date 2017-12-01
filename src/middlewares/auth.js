
// must be used after the using of 'koa-jwt'
export default async (ctx, next) => {
  // allow any req from admin
  if (ctx.state.user && ctx.state.user.admin) {
    ctx.state.admin = true
    return next()
  }

  ctx.state.admin = false

  // allow accessing for /statics/*
  if (ctx.url.startsWith('/statics')) {
    return next()
  }

  // allow non-json request
  const type = ctx.accepts('json', 'html', 'image/*')
  if (type !== 'json') {
    return next()
  }

  // allow get token & check token
  if (ctx.url === '/token') {
    return next()
  }

  return ctx.throw(401)
}
