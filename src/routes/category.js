import KoaRouter from 'koa-router'

import Category from '~/models/category' // eslint-disable-line no-unused-vars

export const router = new KoaRouter()

router.get('/categories', async function (ctx, next) {
  switch (ctx.accepts('json', 'html')) {
    case 'json':
      let categories = await Category.list()
      ctx.body = {
        categories: categories
      }
      break
    case 'html':
      break
    default:
      ctx.throw(406)
  }
})

router.post('/categories', async function (ctx, next) {
  switch (ctx.accepts('json')) {
    case 'json':
      const data = ctx.request.body
      const category = await Category.create(data)
      ctx.body = {
        category: category
      }
      break
    default:
      ctx.throw(406)
  }
})

router.get('/categories/:categoryName', async function (ctx, next) {
  switch (ctx.accepts('json', 'html')) {
    case 'json':
      const categoryName = ctx.params.categoryName
      const category = await Category.get({ name: categoryName })
      ctx.body = {
        category: category
      }
      break
    case 'html':
      break
    default:
      ctx.throw(406)
  }
})

router.patch('/categories/:categoryName', async function (ctx, next) {
  switch (ctx.accepts('json')) {
    case 'json':
      const categoryName = ctx.params.categoryName
      const data = ctx.request.body
      const category = await Category.modifyOne({ name: categoryName }, data)
      ctx.body = {
        category: category
      }
      break
    default:
      ctx.throw(406)
  }
})

router.delete('/categories/:categoryName', async function (ctx, next) {
  switch (ctx.accepts('json')) {
    case 'json':
      const categoryName = ctx.params.categoryName
      const category = await Category.delete({ name: categoryName })
      ctx.body = {
        category: category
      }
      break
    default:
      ctx.throw(406)
  }
})

export default router
