const Router = require('koa-router');


const router = new Router();


router.get('/files', async (ctx) => {
  await ctx.render('files', {});
});


module.exports = router.routes();
