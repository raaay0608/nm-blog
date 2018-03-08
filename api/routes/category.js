const Router = require('koa-router');
const { CategoryService } = require('../../services');

const router = new Router();

router.get('/categories', async (ctx) => {
  const tree = Boolean(['true', '1'].includes(ctx.request.query.tree));
  const lookupParent = Boolean(['true', '1'].includes(ctx.request.query.lookupParent));

  if (tree && lookupParent) {
    ctx.throw(422, 'Cannot query with both \'tree\' and \'lookupParent\' options');
  }

  let categories;
  let rest;

  if (tree) {
    ({ categories, ...rest } = await CategoryService.tree());
    ctx.body = { categories, ...rest };
  } else {
    ({ categories, ...rest } = await CategoryService.list({
      lookupParent,
    }));
    ctx.body = { categories, ...rest };
  }
});

router.post('/categories', async (ctx) => {
  const data = ctx.request.body;
  const { category, ...rest } = await CategoryService.create(data);
  ctx.body = { category, ...rest };
});

router.get('/categories/:_id', async (ctx) => {
  const { _id } = ctx.params;
  const { category, ...rest } = await CategoryService.getById(_id);
  ctx.body = { category, ...rest };
});

router.patch('/categories/:_id', async (ctx) => {
  const { _id } = ctx.params;
  const data = ctx.request.body;
  const { category, ...rest } = await CategoryService.updateById(_id, data);
  ctx.body = { category, ...rest };
});

router.delete('/categories/:_id', async (ctx) => {
  const { _id } = ctx.params;
  const { category, ...rest } = await CategoryService.deleteById(_id);
  ctx.body = { category, ...rest };
});

module.exports = router.routes();
