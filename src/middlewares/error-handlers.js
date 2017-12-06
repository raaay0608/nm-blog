import logger from './logger'
import { DoesNotExist } from '~/models'

export default function handleErrors (app) {
  app.use(unhandledHandler)
  app.use(_404Handler)
  app.use(_406Handler)
  app.use(NotFoundHandler)
}

/**
 * catch `DoesNotExist` from db
 * throw 404
 */
export const NotFoundHandler = async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    if (!(err instanceof DoesNotExist)) {
      throw err
    }
    ctx.throw(404, err.message)
  }
}

/**
 * catch 404 http-error
 */
export const _404Handler = async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    if (Number(err.status) !== 404) {
      throw err
    }
    logger.info(`404 - ${ctx.method} ${ctx.url}`)
    ctx.status = 404
    switch (ctx.accepts(['html', 'json'])) {
      case 'html': {
        await ctx.render('error', {
          status: err.status,
          message: err.message
        })
        break
      }
      case 'json': {
        ctx.body = {
          error: err.name,
          message: err.message || 'Not found'
        }
        break
      }
      default: {
        ctx.res.end()
        break
      }
    }
  }
}

/**
 * catch 406 http-error
 */
export const _406Handler = async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    if (Number(err.status) !== 406) {
      throw err
    }
    ctx.status = 406
    switch (ctx.accepts(['html', 'json'])) {
      case 'html': {
        await ctx.render('error', {
          status: err.status,
          message: err.message || 'currently cannot provide web page on this url...'
        })
        break
      }
      case 'json': {
        ctx.body = {
          error: err.name, message: err.message || 'Not acceptable'
        }
        break
      }
      default: {
        ctx.res.end()
        break
      }
    }
  }
}

/**
 * The "final" handler, means this case of error does not been considered
 */
export const unhandledHandler = async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    ctx.status = 500
    logger.error(`500 - ${err.name}: ${err.message}`)
    switch (ctx.accepts(['html', 'json'])) {
      case 'html': {
        await ctx.render('error', {
          status: err.status,
          message: 'internal error'
        })
        break
      }
      case 'json': {
        ctx.body = {
          errorName: err.name,
          errorMessage: err.message
        }
        break
      }
      default: {
        ctx.res.end()
        break
      }
    }
  }
}
