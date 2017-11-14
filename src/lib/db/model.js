/* eslint-disable padded-blocks */
/* eslint-disable no-useless-constructor */
/* eslint-disable no-multiple-empty-lines */

import mongodb from 'mongodb'


const ModelProxyHandler = {
  get: function (target, property, receiver) {
    if (property in target) {
      return target[property]
    }
    if (property in mongodb.Collection.prototype) {
      return target.getCollection()
        .then(coll => {
          return coll[property]
        })
    }
    return undefined
  }
}


export class Model {

  constructor (name, collectionName, database, options) {
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
    this._options = options

    return new Proxy(this, ModelProxyHandler)
  }

  get collectionName () {
    return this._collectionName
  }

  get database () {
    return this._database
  }

  async getConnection () {
    return this.database.getConnection()
  }

  async getCollection () {
    return this.database.getConnection.collection(this._collectionName, this._options)
  }

}

export default Model
