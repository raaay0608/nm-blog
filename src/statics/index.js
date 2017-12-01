import KoaStatic from 'koa-static'
import mount from 'koa-mount'
import Koa from 'koa'

const staticServer = new Koa()

staticServer.use(mount('/', KoaStatic('./src/statics')))

/**
 * /statics/normalize.css/normalize.css
 */
staticServer.use(mount('/normalize.css', KoaStatic('./node_modules/normalize.css')))

/**
 * /statics/jquery/jquery.min.js
 */
staticServer.use(mount('/jquery', KoaStatic('./node_modules/jquery/dist')))

/**
 * /statics/popper.js/popper.min.js
 */
staticServer.use(mount('/popper.js', KoaStatic('./node_modules/popper.js/dist/umd')))

/**
 * /statics/bootstrap/css/bootstrap.min.css
 * /statics/bootstrap/js/bootstrap.min.js
 */
staticServer.use(mount('/bootstrap', KoaStatic('./node_modules/bootstrap/dist')))

/**
 * /statics/font-awesome/css/font-awesome.min.css
 * /statics/font-awesome/fonts/...
 */
staticServer.use(mount('/font-awesome', KoaStatic('./node_modules/font-awesome')))

/**
 * /statics/github-markdown-css/github-markdown.css
 */
staticServer.use(mount('/github-markdown-css', KoaStatic('./node_modules/github-markdown-css')))

/**
 * /statics/highlight.js/styles/*.css
 */
staticServer.use(mount('/highlight.js', KoaStatic('./node_modules/highlight.js')))

export default staticServer
