const Router = require('koa-router');
const jwt = require('jsonwebtoken');


const router = new Router();


/**
 * use cookie and session,
 * and the JWT is not used anymore
 */
router.post('/token', async (ctx) => {
  // TODO: check username and password
  const token = jwt.sign({
    admin: true,
    iat: Date.now() / 1000 | 0, // eslint-disable-line no-bitwise
  }, process.env.SECRET);

  ctx.body = {
    token,
    tokenType: 'Bearer',
  };
});

module.exports = router.routes();
