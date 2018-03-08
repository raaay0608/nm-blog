const Router = require('koa-router');
const { PostService } = require('../../services');

const router = new Router();

router.get('/posts', async (ctx) => {
  const [{ posts, ...rest }, postsCount] = await Promise.all([
    PostService.list(),
    PostService.count(),
  ]);
  ctx.body = {
    posts,
    postsCount,
    ...rest,
  };
});

router.post('/posts', async (ctx) => {
  const data = ctx.request.body;
  const { post, ...rest } = await PostService.create(data);
  ctx.body = { post, ...rest };
});

router.get('/posts/:_id', async (ctx) => {
  const { _id } = ctx.params;
  const { post, ...rest } = await PostService.getById(_id);
  ctx.body = { post, ...rest };
});

router.patch('/posts/:_id', async (ctx) => {
  const { _id } = ctx.params;
  const data = ctx.request.body;
  const { post, ...rest } = await PostService.updateById(_id, data);
  ctx.body = { post, ...rest };
});

router.delete('/posts/:_id', async (ctx) => {
  const { _id } = ctx.params;
  const { post, ...rest } = await PostService.deleteById(_id);
  ctx.body = { post, ...rest };
});

module.exports = router.routes();
