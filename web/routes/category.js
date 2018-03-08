const Router = require('koa-router');
const { CategoryService, PostService } = require('../../services');


const router = new Router();


router.get('/categories/:slug/', async (ctx) => {
  const { slug } = ctx.params;
  let { page } = ctx.request.query;
  page = page || 1; // TODO: should give an error when page === 0
  const itemsEachPage = Number(process.env.SITE_ITEMS_EACH_PAGE) || 10;
  const [skip, limit] = [(page - 1) * itemsEachPage, itemsEachPage];

  const { category } = await CategoryService.getOne({ slug });
  const [{ posts }, count] = await Promise.all([
    PostService.list({ category: category._id, skip, limit }),
    PostService.count({ category: category._id }),
  ]);
  const pageCount = Math.ceil(count / itemsEachPage);

  const pagination = {
    prevPageUrl: `/categories/${category.name}?page=${page - 1}`,
    nextPageUrl: `/categories/${category.name}?page=${page + 1}`,
    firstPageUrl: `/categories/${category.name}?page=1`, // eslint-disable-line quotes
    lastPageUrl: `/categories/${category.name}?page=${pageCount}`,
  };

  return ctx.render('posts', { category, posts, page, pageCount, pagination });
});


module.exports = router.routes();
