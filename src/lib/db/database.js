/* eslint-disable padded-blocks */
/* eslint-disable no-useless-constructor */
/* eslint-disable no-multiple-empty-lines */

import MongoDB from 'mongodb'

import { Model } from './model' // eslint-disable-line no-unused-vars
import { FileModel } from './file-model' // eslint-disable-line no-unused-vars


const STATE_CLOSED = 'closed'
const STATE_CLOSING = 'closing'
const STATE_CONNECTING = 'connecting'
const STATE_CONNECTED = 'connected'

export class Database {

  /**
   * @param {string} uri - MongoDB uri
   * @param {object} options - optional settings for connecting
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

  async connect (uri) {
    this._uri = uri
    try {
      if (this._connection) {
        return this._connection
      }
      if (!this._uri) {
        throw new Error('Missing mongodb uri')
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

  get connection () {
    return this._connection
  }

  /**
   * @returns {Promise<MongoDB.Db>}
   */
  getConnection () {
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
   * get/set model
   * @param {string} name - model name
   * @param {string} collectionName - collection name
   * @param {object} options - optional settings
   */
  model (name, collectionName, options) {
    if (!name) {
      throw new Error('Missing parameter "name"')
    }
    if (this._models[name]) {
      return this._models[name]
    }
    if (!collectionName) {
      throw new Error('Missing parameter "collectionName"')
    }

    const model = new Model(name, collectionName, this, options)
    this._models[name] = model
    return model
  }

  /**
   * get/set file-model
   * @param {string} name - model name
   * @param {string} bucketName - bucketName
   * @param {object} options.fileCollectionOptions - optional settings for file collection
   * @param {object} options.chunkCollectionOptions - optional settings for chunk collection
   */
  fileModel (name, bucketName, options) {
    if (!name) {
      throw new Error('Missing parameter "name"')
    }
    if (this._fileModels[name]) {
      return this._fileModels[name]
    }
    if (!bucketName) {
      throw new Error('Missing parameter "bucketName"')
    }

    const fileModel = new FileModel(name, bucketName, this, options)
    this._fileModels[name] = fileModel
    return fileModel
  }

}

export default Database
