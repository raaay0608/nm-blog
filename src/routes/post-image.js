import KoaRouter from 'koa-router'
// import Busboy from 'busboy'
// import KoaBusboy from 'koa-busboy'

import Post from '~/models/post'
import PostImage from '~/models/post-image'

export const router = new KoaRouter()

// get image list
router.get('/posts/:postSlug/images', async function (ctx, next) {
  switch (ctx.accepts('json')) {
    case 'json':
      const post = await Post.get({ slug: ctx.params.postSlug }) // check if posts exists
      const imageDocs = await PostImage.list({ 'metadata.post': post._id })
      imageDocs.map(imageDoc => {
        imageDoc.url = `/posts/${post.slug}/images/${imageDoc.metadata.filename}`
      })
      ctx.body = { images: imageDocs }
      break
    default:
      ctx.throw(406)
  }
})

// multipart-formdata
router.post('/posts/:postSlug/images', async function (ctx, next) {
  switch (ctx.accepts('json')) {
    case 'json':
      const post = await Post.get({slug: ctx.params.postSlug})
      let { file, filename, metadata } = ctx.request.body
      metadata = JSON.parse(metadata)
      metadata.filename = filename || file.name
      metadata.post = post._id
      const contentType = file.mimetype || null
      const uploadStream = PostImage.getUploadStream(contentType, metadata)
      const imageId = uploadStream.id
      await new Promise((resolve, reject) => {
        file.pipe(uploadStream)
          // .on('close', () => resolve())
          .on('finish', () => resolve())
          .on('error', (err) => reject(err))
      })
      const res = await PostImage.getById(imageId)
      res.url = `/posts/${post.slug}/images/${res.metadata.filename}`
      ctx.body = { image: res }
      break
    default:
      ctx.throw(406)
  }
})

// get image info or file, depending on "Accept" header
router.get('/posts/:postSlug/images/:filename', async function (ctx, next) {
  switch (ctx.accepts('json', 'image/*')) {
    case 'json': {
      const post = await Post.get({ slug: ctx.params.postSlug })
      const file = await PostImage.get({
        'metadata.post': post._id,
        'metadata.filename': ctx.params.filename
      })
      file.url = `/posts/${post.slug}/images/${file.metadata.filename}`
      ctx.body = { image: file }
      break
    }
    case 'image/*': {
      const post = await Post.get({ slug: ctx.params.postSlug })
      const file = await PostImage.get({
        'metadata.post': post._id,
        'metadata.filename': ctx.params.filename
      })
      const downloadStream = await PostImage.getDownloadStreamById(file._id)
      const filename = file.metadata.filename || file.filename
      const contentDeposition = filename ? `inline; filename="${filename}"` : 'inline'
      ctx.append('Content-Disposition', contentDeposition)
      ctx.append('Content-Type', file.contentType || 'application/octet-stream')
      ctx.body = downloadStream
      break
    }
    default:
      ctx.throw(406)
  }
})

// modify image info, i.e. filename
// Not tested
router.patch('/posts/:postSlug/images/:filename', async function (ctx, next) {
  switch (ctx.accepts('json')) {
    case 'json':
      const data = ctx.request.body
      const post = await Post.get({ slug: ctx.params.postSlug })
      const result = await PostImage.modifyFileInfo(
        { 'metadata.post': post._id, 'metadata.filename': ctx.params.filename },
        data
      )
      ctx.body = { result }
      break
    default:
      ctx.throw(406)
  }
})

// delete an image
router.delete('/posts/:postSlug/images/:filename', async function (ctx, next) {
  switch (ctx.accepts('json')) {
    case 'json':
      const post = await Post.get({ slug: ctx.params.postSlug })
      const result = await PostImage.deleteOne({
        'metadata.post': post._id,
        'metadata.filename': ctx.params.filename
      })
      ctx.body = { result }
      break
    default:
      ctx.throw(406)
  }
})

export default router
