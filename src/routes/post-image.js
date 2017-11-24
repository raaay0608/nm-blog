import KoaRouter from 'koa-router'

import Post from '~/models/post'
import PostImage from '~/models/post-image'

export const router = new KoaRouter()

// get image list
router.get('/posts/:postSlug/images', async function (ctx, next) {
  switch (ctx.accepts('json')) {
    case 'json':
      const post = await Post.get({ slug: ctx.params.postSlug }) // check if posts exists
      const imageDocs = await PostImage.list({ postId: post._id })
      imageDocs.map(imageDoc => {
        imageDoc.url = `/posts/${post.slug}/images/${imageDoc.metadata.fileName}`
      })
      ctx.body = { images: imageDocs }
      break
    default:
      ctx.throw(406)
  }
})

// image upload, multipart-formdata
router.post('/posts/:postSlug/images', async function (ctx, next) {
  switch (ctx.accepts('multipart-formdata')) {
    case 'multipart-formdata':
      const post = Post.get({ slug: ctx.params.postSlug })
      const file = ctx.request.body.files.image // { fieldname, originaname, encoding, mimetype, size, buffer }
      const contentType = file.type || null
      const metadata = ctx.request.body.metadata
      metadata.fileName = metadata.fileName || file.originalname
      metadata.post = post._id

      const uploadStream = PostImage.getUploadStream(contentType, metadata)
      const imageId = uploadStream._id

      await new Promise((resolve, reject) => {
        uploadStream.on('error', (err) => reject(err))
        uploadStream.on('finish', () => resolve())
        uploadStream.write(file.buffer)
      })

      const imageDoc = await PostImage.getById(imageId)
      ctx.body = { image: imageDoc }
      break
    default:
      ctx.throw(406)
  }
})

// get image info or file, depending on "Accept" header
router.get('/posts/:postSlug/images/:fileName', async function (ctx, next) {
  switch (ctx.accepts('json', 'image/*')) {
    case 'json':
      const post = await Post.get({ slug: ctx.params.postSlug })
      const imageDoc = PostImage.getByMetadata({
        post: post._id,
        fileName: ctx.params.fileName
      })
      imageDoc.url = `/posts/${post.slug}/images/${imageDoc.metadata.fileName}`
      ctx.body = { image: imageDoc }
      break
    case 'image/*':
      // TODO
      break
    default:
      ctx.throw(406)
  }
})

// modify image info, i.e. filename
router.patch('/posts/:postSlug/images/:fileName', async function (ctx, next) {
  switch (ctx.accepts('json')) {
    case 'json':
      const data = ctx.request.body
      const post = await Post.get({ slug: ctx.params.postSlug })
      const result = await PostImage.modifyFileInfo(
        { post: post._id, fileName: ctx.params.fileName },
        data
      )
      ctx.body = { result }
      break
    default:
      ctx.throw(406)
  }
})

// delete a image
router.delete('/posts/:postSlug/images/:fileName', async function (ctx, next) {
  switch (ctx.accepts('json')) {
    case 'json':
      const post = await Post.get({ slug: ctx.params.postSlug })
      const result = await PostImage.deleteOneByMetadata({
        post: post._id,
        fileName: ctx.params.fileName
      })
      ctx.body = { result }
      break
    default:
      ctx.throw(406)
  }
})

export default router
