const Router = require('koa-router');
const { FileService } = require('../../services');


const router = new Router();


/**
 * Download file
 */
router.get('/files/:filename', async (ctx) => {
  const { filename } = ctx.params;
  const { file } = await FileService.findByName(filename);
  if (!file) {
    ctx.throw(404, `File '${filename}' does not exist`);
  }
  const downloadStream = FileService.getDownloadStream(filename);
  const type = (file.metadata && file.metadata.contentType) || 'application/octet-stream';
  ctx.set('Content-Type', type);
  ctx.body = downloadStream;
});


module.exports = router.routes();
