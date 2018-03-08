const Router = require('koa-router');
const { TagService, PostService } = require('../../services');


const router = new Router();


router.get('/tags/:slug/', async (ctx) => {
  const { slug } = ctx.params;
  let { page } = ctx.request.query;
  page = page || 1; // TODO: should give an error when page === 0
  const itemsEachPage = Number(process.env.SITE_ITEMS_EACH_PAGE) || 10;
  const [skip, limit] = [(page - 1) * itemsEachPage, itemsEachPage];

  const { tag } = await TagService.getOne({ slug });
  const [{ posts }, count] = await Promise.all([
    PostService.list({ tag: tag._id, skip, limit }),
    PostService.count({ tag: tag._id }),
  ]);
  const pageCount = Math.ceil(count / itemsEachPage);
  const pagination = {
    prevPageUrl: `/tags/${tag.name}?page=${page - 1}`,
    nextPageUrl: `/tags/${tag.name}?page=${page + 1}`,
    firstPageUrl: `/tags/${tag.name}?page=1`, // eslint-disable-line quotes
    lastPageUrl: `/tags/${tag.name}?page=${pageCount}`,
  };
  return ctx.render('posts', { tag, posts, page, pageCount, pagination });
});


module.exports = router.routes();
