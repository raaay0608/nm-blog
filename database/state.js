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
async function connect({
  host = process.env.DB_HOST || 'localhost',
  port = process.env.DB_CLIENT || 27017,
  user = process.env.DB_USER || null,
  password = process.env.DB_PASSWORD || null,
  authSource = process.env.DB_AUTHSOURCE || null,
} = {}) {
  try {
    if (isConnected()) {
      return;
    }
    const server = new Server(host, port);
    const options = { user, password, authSource };

    _client = await new MongoClient(server, options).connect();
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
