const path = require('path');
const Koa = require('koa');
// const KoaMount = require('koa-static');
const KoaStatic = require('koa-static');
const KoaViews = require('koa-views');
const WebRoutes = require('./routes');
const { getCategoriesAndTags } = require('../commons/middlewares');


const app = new Koa();

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    const status = error.statusCode || error.status || 500;
    ctx.status = status;
    await ctx.render('error', {
      error, status,
    });
  }
});

// app.use(KoaMount('/statics', KoaStatic(path.join(__dirname, 'statics'))));
app.use(KoaStatic(path.join(__dirname, 'statics')));

app.use(KoaViews(path.join(__dirname, '/views'), {
  extension: 'ejs',
  map: {
    ejs: 'ejs',
  },
}));

app.use(KoaViews(path.join(__dirname, '/views')));

app.use(getCategoriesAndTags);

Object.entries(WebRoutes).forEach(([name, module]) => {
  app.use(module);
});


module.exports = app;
