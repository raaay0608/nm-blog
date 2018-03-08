const path = require('path');
const Koa = require('koa');
const KoaBodyParser = require('koa-bodyparser');
const KoaStatic = require('koa-static');
const KoaMount = require('koa-mount');
// const KoaSession = require('koa-session');
// const KoaGenericSession = require('koa-generic-session');
const KoaViews = require('koa-views');
const KoaEjs = require('koa-ejs');

const adminRoutes = require('./routes');


const app = new Koa();

// app.keys = [process.env.SECRET];

/**
 * /admin/[dirname-filename]
 */
// app.use(KoaStatic('statics'));
app.use(KoaStatic(path.join(__dirname, 'statics')));

// KoaEjs(app, {
//   root: path.join(__dirname, 'views'),
//   layout: 'layout',
//   viewExt: 'ejs',
//   cache: true,
//   debug: true,
// });


app.use(KoaBodyParser());

// app.use(async (ctx, next) => {
//   ctx.state.error = null;
//   ctx.state.warning = null;
//   ctx.state.info = null;
//   ctx.state.success = null;
//   return next();
// });

// app.use(KoaGenericSession());

// app.use(KoaSession({
//   key: process.env.SECRET,
//   maxAge: 86400000, // ms
//   overwrite: true,
//   httpOnly: true,
//   signed: true,
//   rolling: false,
//   renew: false,
// }, app));

app.use(KoaViews(path.join(__dirname, '/views'), {
  extension: 'ejs',
  // map: {
  //   ejs: 'ejs',
  //   mustache: 'mustache',
  //   hbs: 'handlebars',
  // },
}));


// a place for testing
app.use(async (ctx, next) => {
  if (ctx.url !== '/test/') {
    return next();
  }
  return ctx.render('test', {});
});


// if not logged in, redirect to log-in page
app.use(async (ctx, next) => {
  if (!ctx.state.admin && ctx.url !== '/login/') {
    ctx.status = 401;
    ctx.set('X-Is-Admin', 'True');
    ctx.redirect('/admin/login/');
  } else {
    ctx.set('X-Is-Admin', 'False');
  }
  return next();
});


// set routers
Object.entries(adminRoutes).forEach(([name, module]) => {
  app.use(module);
});


module.exports = app;
