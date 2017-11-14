/* eslint-disable padded-blocks */
/* eslint-disable no-useless-constructor */
/* eslint-disable no-multiple-empty-lines */

import mongodb from 'mongodb'
// import inflected from 'inflected'


const ModelProxyHandler = {

  get: function (target, property, receiver) {
    if (property in target) {
      return target[property]
    }
    if (property in mongodb.Collection.prototype) {
      return target.collection[property]
    }
    return undefined
  }

}

/**
 * Model class, provide static functions from MongoDB.Collections.prototype
 */
export class Model {

  /**
   * Model constructor.
   * do not instantiate directly.
   * @param {string} name - model name (usually singular format, camel format)
   * @param {string} collectionName - the actual collectionName
   * @param {Database} database - Database instance
   * @param {object} options - optional settings.
   */
  constructor (name, collectionName, database, options = {}) {
    if (!name) {
      throw new Error('Missing parameter "name"')
    }
    if (!collectionName) {
      throw new Error('Missing parameter "collectionName"')
    }
    if (!database) {
      throw new Error('Missing parameter "db"')
    }

    this._name = name
    this._collectionName = collectionName
    this._database = database
    this._options = options || {}

    return new Proxy(this, ModelProxyHandler)
  }

  /**
   * @returns {string} - name of the collection
   */
  get collectionName () {
    return this._collectionName
  }

  /**
   * @returns {mongodb.Collection}
   */
  get collection () {
    return this._database.collection(this.collectionName)
  }

  /**
   * returns Database object, NOT MongoDB connection
   * @returns {Database}
   */
  get database () {
    return this._database
  }

  /**
   * returns MongoDB connection
   * @returns {MongoDB.Db}
   */
  get connection () {
    return this.database.connection
  }

  /**
   * check if this model exists
   * @returns {Promise<boolean>}
   */
  async _exists () {
    return this._dbConnection.listCollections({ name: this.collectionName }).toArray()
      .then(colls => {
        if (colls) {
          return Promise.resolve(true)
        }
        return Promise.resolve(false)
      })
  }

}


export default Model
