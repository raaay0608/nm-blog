/**
 * TODO: save username and password to database
 */

const Router = require('koa-router');


const router = new Router();


/**
 * get login page
 * redirect to index if already logged in
 */
router.get('/login', async (ctx) => {
  if (ctx.session.admin) {
    // already logged in
    return ctx.redirect('/admin/');
  }
  return ctx.render('login');
});


/**
 * do login, with username & password
 * redirect to index if login is successful,
 * return login page if not
 */
router.post('/login', async (ctx) => {
  const { username, password } = ctx.request.body;
  if (username !== process.env.USERNAME || password !== process.env.PASSWORD) {
    // 401
    ctx.status = 401;
    return ctx.render('login', { error: 'Login failed: wrong username or password' });
  }
  ctx.session.admin = true;
  return ctx.redirect('/admin/');
});


/**
 * do logout, and return login page
 */
router.get('/logout', async (ctx) => {
  ctx.session = null;
  return ctx.redirect('/admin/login/');
});


module.exports = router.routes();
