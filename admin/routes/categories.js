const Router = require('koa-router');


const router = new Router();


router.get('/categories', async (ctx) => {
  await ctx.render('categories', {});
});


module.exports = router.routes();
