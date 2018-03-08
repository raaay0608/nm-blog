const Router = require('koa-router');
// const { Duplex, PassThrough } = require('stream');
const { FileService } = require('../../services');


const router = new Router();


// list all files
router.get('/files/', async (ctx) => {
  const { files } = await FileService.list();
  files.forEach((f) => {
    // eslint-disable-next-line no-param-reassign
    f.url = `/files/${f.filename}`;
  });
  ctx.body = { files };
});


/**
 * download file with filename
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


/**
 * upload file with filename specified
 */
router.put('/files/:filename', async (ctx) => {
  const contentType = ctx.get('Content-Type') || 'application/octet-stream';
  const { filename } = ctx.params;
  const { file } = await FileService.findByName(filename);
  if (file) {
    ctx.throw(409, `There is already a file named '${filename}'`);
  }
  const uploadStream = FileService.getUploadStream(filename, { contentType });
  await new Promise((resolve, reject) => {
    ctx.req.pipe(uploadStream)
      .on('finish', resolve)
      .on('error', reject);
  });
  ctx.body = null;
});


/**
 * delete file by filename
 */
router.delete('/files/:filename', async (ctx) => {
  const { filename } = ctx.params;
  const res = await FileService.deleteByName(filename);
  ctx.body = res; // will return null, thus status 204 is returned
});


module.exports = router.routes();
