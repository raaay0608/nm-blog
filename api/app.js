const Koa = require('koa');
const KoaBodyparser = require('koa-bodyparser');
// const KoaError = require('koa-error');
const KoaJsonError = require('koa-json-error');
const Middlewares = require('../commons/middlewares');
const ApiRoutes = require('./routes');


const app = new Koa();

app.use(async (ctx, next) => {
  if (!ctx.state.admin) {
    return ctx.raise(401, 'not authorized');
  }
  return next();
});

app.use(KoaJsonError());
// app.use(KoaError());
app.use(KoaBodyparser());
app.use(Middlewares.toObjectId);

Object.entries(ApiRoutes).forEach(([name, module]) => {
  app.use(module);
});

module.exports = app;
