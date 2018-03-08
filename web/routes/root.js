const Router = require('koa-router');
const { PostService } = require('../../services');

const router = new Router();


// eslint-disable-next-line arrow-body-style
router.get('/', async (ctx) => {
  // const [{ posts, ...rest }, postsCount] = await Promise.all([
  //   PostService.list(),
  //   PostService.count(),
  // ]);
  // await ctx.render('index', { posts, postsCount });
  return ctx.redirect('/posts');
});

module.exports = router.routes();
