import KoaRouter from 'koa-router'

import Category from '~/models/category' // eslint-disable-line no-unused-vars

export const router = new KoaRouter()

router.get('/categories', async function (ctx, next) {
  switch (ctx.accepts('json', 'html')) {
    case 'json': {
      let categories = await Category.list()
      ctx.body = { categories }
      break
    }

    default: {
      ctx.throw(406)
    }
  }
})

router.post('/categories', async function (ctx, next) {
  switch (ctx.accepts('json')) {
    case 'json': {
      const data = ctx.request.body
      const category = await Category.create(data)
      ctx.body = { category }
      break
    }

    default: {
      ctx.throw(406)
    }
  }
})

router.get('/categories/:categorySlug', async function (ctx, next) {
  switch (ctx.accepts('json', 'html')) {
    case 'json': {
      const categorySlug = ctx.params.categorySlug
      const category = await Category.get({ slug: categorySlug })
      ctx.body = { category }
      break
    }

    default: {
      ctx.throw(406)
      break
    }
  }
})

router.patch('/categories/:categorySlug', async function (ctx, next) {
  switch (ctx.accepts('json')) {
    case 'json': {
      const categorySlug = ctx.params.categorySlug
      const data = ctx.request.body
      const category = await Category.modify({ slug: categorySlug }, data)
      ctx.body = { category }
      break
    }

    default: {
      ctx.throw(406)
      break
    }
  }
})

router.delete('/categories/:categorySlug', async function (ctx, next) {
  switch (ctx.accepts('json')) {
    case 'json': {
      const categorySlug = ctx.params.categorySlug
      const res = await Category.delete({ slug: categorySlug })
      ctx.body = res
      break
    }

    default: {
      ctx.throw(406)
      break
    }
  }
})

export default router
