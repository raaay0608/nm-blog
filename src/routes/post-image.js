import KoaRouter from 'koa-router'

export const router = new KoaRouter()

// get image list
router.get('/posts/:postSlug/images', async function (ctx, next) {
  switch (ctx.accepts('json')) {
    case 'json':
      break
    default:
      ctx.throw(406)
  }
})

// image upload, multipart-formdata
router.post('/posts/:postSlug/images', async function (ctx, next) {
  switch (ctx.accepts('json')) {
    case 'json':
      break
    default:
      ctx.throw(406)
  }
})

// get image info or file, depending on "Accept" header
router.get('/posts/:postSlug/images/:imageName', async function (ctx, next) {
  switch (ctx.accepts('json', 'image/*')) {
    case 'json':
      break
    case 'image/*':
      break
    default:
      ctx.throw(406)
  }
})

// modify image info, i.e. filename
router.patch('/posts/:postSlug/images/:imageName', async function (ctx, next) {
  switch (ctx.accepts('json')) {
    case 'json':
      break
    default:
      ctx.throw(406)
  }
})

// delete a image
router.delete('/posts/:postSlug/images/:imageName', async function (ctx, next) {
  switch (ctx.accepts('json')) {
    case 'json':
      break
    default:
      ctx.throw(406)
  }
})

export default router
