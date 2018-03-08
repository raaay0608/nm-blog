const dotenv = require('dotenv');
const Koa = require('koa');
const KoaGenericSession = require('koa-generic-session');
const KoaMount = require('koa-mount');
const KoaResponseTime = require('koa-response-time');
const KCors = require('kcors');
const KoaLogger = require('koa-logger');
const KoaCompress = require('koa-compress');
const Marked = require('marked');

const database = require('./database');

const apiApp = require('./api/app');
const webApp = require('./web/app');
const adminApp = require('./admin/app');


dotenv.config();

// read site options from .env, and keep it
const siteOptions = Object.entries(process.env)
  .filter(([key, val]) => key.startsWith('SITE'))
  .reduce((current, [key, val]) => ({ ...current, [key]: val }), {});


const app = new Koa();
app.keys = [process.env.SECRET]; // required by adminApp cookie

app.use(KoaLogger());
app.use(KoaCompress());


app.use(KoaResponseTime());

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  app.use(KCors());
}


app.use(KoaGenericSession());
app.use(async (ctx, next) => {
  if (ctx.session.admin === true) {
    ctx.state.admin = true;
  } else {
    ctx.state.admin = false;
  }
  ctx.state.siteOptions = { ...siteOptions };
  ctx.state.marked = Marked;
  return next();
});


app.use(KoaMount('/api', apiApp));
app.use(KoaMount('/admin', adminApp));
app.use(KoaMount('/', webApp));


const server = app.listen(3000, () => {
  app.emit('listening');
});


(async () => {
  await database.connect();
  app.emit('database connected');
})();


module.exports.app = app;
module.exports.server = server;
