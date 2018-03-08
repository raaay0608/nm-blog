const Router = require('koa-router');


const router = new Router();


router.get('/tags', async (ctx) => {
  await ctx.render('tags', {});
});


module.exports = router.routes();
