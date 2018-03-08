const { MongoClient, Server, GridFSBucket } = require('mongodb');


let _client = null;

/**
 * return the database is connected or not
 * @returns {Boolean}
 */
function isConnected() {
  if (!_client) {
    return false;
  }
  return _client.isConnected();
}


/**
 * connect
 */
async function connect(url = process.env.DB_URL) {
  try {
    if (isConnected()) {
      return;
    }
    _client = await MongoClient.connect(url);
  } catch (err) {
    throw err; // may `process.exit()`
  }
}


/**
 * close database connection
 * @param {boolean} force
 */
async function close(force = false) {
  if (!_client) {
    return;
  }
  await _client.close(force);
}


/**
 * return db instance
 * @param {string} dbName - database name
 * @returns {mongodb.Db}
 */
function db(dbName = process.env.DB_NAME) {
  if (!isConnected()) {
    throw new Error('Database not connected');
  }
  return _client.db(dbName); // cached by `mongodb.MongoClient`
}


/**
 * return collection
 * @param {string} collName - collection name
 * @returns {mongodb.Collection}
 */
function collection(collName) {
  return db().collection(collName);
}


/**
 * return GridFS bucket
 * @param {string} bucketName - bucket name
 * @param {Number} chunkSizeBytes - chunk size in bytes
 * @returns {mongodb.GridFSBucket}
 */
function bucket(bucketName, chunkSizeBytes) {
  const _db = db();
  const _bucket = new GridFSBucket(_db, { bucketName, chunkSizeBytes });
  return _bucket;
}


module.exports = {
  isConnected, connect, close,
  db, collection, bucket,
};
