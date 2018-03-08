const Router = require('koa-router');
const { PostService } = require('../../services');


const router = new Router();


router.get('/posts/', async (ctx) => {
  let { page } = ctx.request.query;
  page = Number(page) || 1; // TODO: should give an error when page === 0
  const itemsEachPage = Number(process.env.SITE_ITEMS_EACH_PAGE) || 10;
  const [skip, limit] = [(page - 1) * itemsEachPage, itemsEachPage];

  const [{ posts }, count] = await Promise.all([
    PostService.list({ skip, limit }),
    PostService.count(),
  ]);
  const pageCount = Math.ceil(count / itemsEachPage);
  const pagination = {
    prevPageUrl: `/posts?page=${page - 1}`,
    nextPageUrl: `/posts?page=${page + 1}`,
    firstPageUrl: `/posts?page=1`, // eslint-disable-line quotes
    lastPageUrl: `/posts?page=${pageCount}`,
  };
  return ctx.render('posts', { posts, count, page, pageCount, pagination });
});

router.get('/posts/:slug/', async (ctx) => {
  const { slug } = ctx.params;
  const { post } = await PostService.getOne({ slug });
  return ctx.render('post', { post });
});


module.exports = router.routes();
