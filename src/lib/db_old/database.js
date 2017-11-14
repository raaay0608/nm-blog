/* eslint-disable padded-blocks */
/* eslint-disable no-useless-constructor */
/* eslint-disable no-multiple-empty-lines */

import MongoDB from 'mongodb'

import { Model } from './model'
import { FileModel } from './file-model' // eslint-disable-line no-unused-vars


const STATE_CLOSED = 'closed'
const STATE_CLOSING = 'closing'
const STATE_CONNECTING = 'connecting'
const STATE_CONNECTED = 'connected'


export class Database {

  /**
   * Construct Database instance with uri and options.
   * @param {string} uri - MongoDB url starts with "mongo://"
   * @param {object} options - optional options for connecting
   */
  constructor (uri, options) {
    this._uri = uri
    this._options = options
    this._state = STATE_CLOSED
    this._connection = null
    this._connectionPromise = null
    this._models = {}
    this._fileModels = {}
  }

  /**
   * Connect to MongoDB using MongoClient
   * @returns {Promise<MongoDB.Db>} - will return the db instance, from MongoClient.
   */
  async connect () {
    try {
      if (this._connection) {
        return this._connection
      }
      this._state = STATE_CONNECTING
      this._connectionPromise = MongoDB.MongoClient.connect(this._uri, this._options)
      this._connection = await this._connectionPromise
      this._state = STATE_CONNECTED
      return this._connection
    } catch (err) {
      throw err
    }
  }

  /**
   * Async. Close database Connection
   * @returns {Promise} - will return nothing if closed suceessful.
   */
  async close () {
    try {
      const conn = this.getConnection()
      this._state = STATE_CLOSING
      let ret = await conn.close()
      this._state = STATE_CLOSED
      return ret
    } catch (err) {
      throw err
    }
  }

  /**
   * Get connection instance.
   * @returns {Promise} - return connection instance or throw error.
   */
  async getConnection () {
    try {
      if (this.state === STATE_CLOSED) {
        throw new Error('Database is closed.')
      }
      if (this.state === STATE_CLOSING) {
        throw new Error('Database is closing.')
      }
      if (this.state === STATE_CONNECTED) {
        return this._connection
      }
      if (this.state === STATE_CONNECTING) {
        return this._connectionPromise
      }
    } catch (err) {
      throw err
    }
  }

  /**
   * get/set collection model
   * @param {string} name - model name (usually in singular form)
   * @param {string} collectionName - collection name
   * @param {object} options - optional settings for the collection
   */
  model (name, collectionName, options = {}) {
    if (!name || (typeof name !== 'string')) {
      throw new Error('Missing or invalid argument "name"')
    }
    if (!collectionName || (typeof collectionName !== 'string')) {
      throw new Error('Missing or invalid argument "name"')
    }

    // If not registered, create it
    if (!this._models[name]) {
      const model = new Model()
      this._models[name] = model(name, collectionName, this, options)
    }

    return this._models[name]
  }

  /**
   * get/set GridFS file model
   * @param {string} name - model name (usually in singular form)
   * @param {string} bucketName - same as the "bucketName" option of GridFS.
   * The 'files' and 'chunks' collections will be prefixed with the bucket name followed by a dot.
   * @param {object} options - optional settings
   */
  fileModel (name, bucketName, options = {}) {

  }

  /**
   * Check if collection exists
   * Using MongoDB.Db.listCollections
   * @param {string} collectionName - collection name
   */
  async _collectionExists (collectionName) {
    const colls = this.getConnection().listCollections({name: collectionName})
    return Boolean(colls.length)
  }

  /**
   * Create collection, with optional settings
   * Using MongoDB.Db.createCollection()
   * @param {string} name - collection name
   * @param {object} options - optional settings for creating collection
   */
  async _createCollection (name, options) {
    return this.getConnection().createCollection(name, options)
  }

}

export default Database
