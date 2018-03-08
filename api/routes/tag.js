const Router = require('koa-router');
const { TagService } = require('../../services');


const router = new Router();


router.get('/tags', async (ctx) => {
  const { tags, ...rest } = await TagService.list();
  ctx.body = { tags, ...rest };
});

router.post('/tags', async (ctx) => {
  const data = ctx.request.body;
  const { tag, ...rest } = await TagService.create(data);
  ctx.body = { tag, ...rest };
});

router.get('/tags/:_id', async (ctx) => {
  const { _id } = ctx.params;
  const { tag, ...rest } = await TagService.getById(_id);
  ctx.body = { tag, ...rest };
});

router.patch('/tags/:_id', async (ctx) => {
  const { _id } = ctx.params;
  const data = ctx.request.body;
  const { tag, ...rest } = await TagService.updateById(_id, data);
  ctx.body = { tag, ...rest };
});

router.delete('/tags/:_id', async (ctx) => {
  const { _id } = ctx.params;
  const { tag, ...rest } = await TagService.deleteById(_id);
  ctx.body = { tag, ...rest };
});


module.exports = router.routes();
