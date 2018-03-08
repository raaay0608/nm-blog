const Utils = require('./utils');
const { CategoryService, TagService } = require('../services');

/**
 * Koa middleware, that process request body
 *   if `key` is `_id`, then try to convert the value to `ObjectId`
 * Must be used after body parser
 */
async function toObjectId(ctx, next) {
  const { body } = ctx.request;
  Utils.convertId(body);
  return next();
}

async function getCategoriesAndTags(ctx, next) {
  const [{ categories }, { tags }] = await Promise.all([
    CategoryService.list(),
    TagService.list(),
  ]);
  ctx.state.categories = categories;
  ctx.state.tags = tags;
  return next();
}

module.exports = {
  toObjectId,
  getCategoriesAndTags,
};
