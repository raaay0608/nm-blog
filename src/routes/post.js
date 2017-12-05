import KoaRouter from 'koa-router'
import config from 'config'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'

import Post from '~/models/post' // eslint-disable-line no-unused-vars

const md = new MarkdownIt(({
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value
        // return '<pre class="hljs"><code>' +
        //   hljs.highlight(lang, str, true).value +
        //   '</code></pre>'
      } catch (__) {}
    }
    return '' // use external default escaping
  }
}))

export const router = new KoaRouter()

router.get('/posts', async function (ctx, next) {
  switch (ctx.accepts('json', 'html')) {
    case 'json': {
      const posts = await Post.list()
      ctx.body = { posts }
      break
    }

    case 'html': {
      const page = Number(ctx.query.page) || 1
      const [skip, limit] = [(page - 1) * config.get('postsPerPage'), config.get('postsPerPage')]
      const posts = await Post.list({ publish: true }, { skip, limit })
      const total = Math.ceil((await Post.count({ publish: true })) / config.get('postsPerPage'))
      await ctx.render('post-list', { posts, page, total })
      break
    }

    default: {
      ctx.throw(406)
      break
    }
  }
})

router.post('/posts', async function (ctx, next) {
  switch (ctx.accepts('json')) {
    case 'json': {
      const data = ctx.request.body
      const post = await Post.create(data)
      ctx.body = { post }
      break
    }

    default: {
      ctx.throw(406)
      break
    }
  }
})

router.get('/posts/:postSlug', async function (ctx, next) {
  switch (ctx.accepts('json', 'html')) {
    case 'json': {
      const postSlug = ctx.params.postSlug
      const post = await Post.get({ slug: postSlug })
      ctx.body = { post }
      break
    }

    case 'html': {
      const postSlug = ctx.params.postSlug
      const post = await Post.get({ slug: postSlug })
      post.mdContent = post.content ? md.render(post.content) : ''
      await ctx.render('post', { post })
      break
    }

    default: {
      ctx.throw(406)
      break
    }
  }
})

router.patch('/posts/:postSlug', async function (ctx, next) {
  switch (ctx.accepts('json')) {
    case 'json': {
      const postSlug = ctx.params.postSlug
      const data = ctx.request.body
      const post = await Post.modify({ slug: postSlug }, data)
      ctx.body = { post }
      break
    }

    default: {
      ctx.throw(406)
      break
    }
  }
})

router.delete('/posts/:postSlug', async function (ctx, next) {
  switch (ctx.accepts('json')) {
    case 'json': {
      const postSlug = ctx.params.postSlug
      const delResult = await Post.delete({ slug: postSlug })
      ctx.body = delResult
      break
    }

    default: {
      ctx.throw(406)
      break
    }
  }
})

export default router
