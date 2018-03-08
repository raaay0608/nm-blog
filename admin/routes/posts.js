const Router = require('koa-router');


const router = new Router();


router.get('/posts', async (ctx) => {
  await ctx.render('posts', {});
});


router.get('/posts/:postId', async (ctx) => {
  const { postId } = ctx.params;
  await ctx.render('post', { postId });
});


module.exports = router.routes();
