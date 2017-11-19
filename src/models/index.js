import Mongodb, { MongoClient } from 'mongodb' // eslint-disable-line no-unused-vars

let _db = null

export function connect (uri, options = {}) {
  return new Promise((resolve, reject) => {
    if (_db) {
      return resolve(_db)
    }
    return MongoClient.connect(uri, options)
      .then(db => {
        _db = db
        resolve(_db)
      })
  })
}

export function close () {
  if (!_db) {
    return
  }
  return _db.close()
    .then(ret => {
      _db = null
    })
}

export function connection () {
  return _db
}

export function collection (collName) {
  return _db.collection(collName)
}

/**
 * Base model class
 * Static only
 */
export class Model {
  static get db () {
    return _db
  }

  static get collection () {
    return this.db.collection(this.COLL_NAME)
  }

  // MongoDB.collectio methods below

  static async aggregate (pipeline, options) {
    return this.collection.aggregate(pipeline, options)
  }

  static async deleteOne (filter, options) {
    return this.collection.deleteOne(filter, options)
  }

  static async deleteMany (filter, options) {
    return this.collection.deleteMany(filter, options)
  }

  // customed functions for all models

  /**
   * Get all the docs which meet the filter
   */
  static async list (filter) {
    return this.collection.find(filter).toArray()
  }

  /**
   * Insert doc and renturn it
   */
  static async insertOneAndReturn (doc) {
    const res = await this.insertOne(doc)
    const _doc = res.ops[0]
    return _doc
  }

  // MongoDB.collection methods below

  static find (query) {
    // return cursor, remember ".toArray()"
    return this.collection.find(query)
  }

  static async findOne (query, options) {
    return this.collection.findOne(query)
  }

  static async findOneAndDelete (filter, options) {
    return this.collection.findOneAndDelete(filter, options)
  }

  static async findOneAndReplace (filter, replacement, options) {
    return this.collection.findOneAndReplace(filter, replacement, options)
  }

  static async findOneAndUpdate (filter, update, options) {
    return this.collection.findOneAndUpdate(filter, update, options)
  }

  static async insertOne (doc, options) {
    // return {n: 1, ok: 1}
    return this.collection.insertOne(doc, options)
  }

  static async insertMany (docs, options) {
    return this.collection.insertMany(docs, options)
  }

  static async updateMany (filter, update, options) {
    return this.collection.updateMany(filter, update, options)
  }

  static async updateOne (filter, update, options) {
    return this.collection.updateOne(filter, update, options)
  }
}

/**
 * Base class for GridFS file model
 * Static only
 */
export class FileModel {
  static get db () {
    return _db
  }

  static get fileCollectionName () {
    return this.BUCKET_NAME + '.files'
  }

  static get chunkCollectionName () {
    return this.BUCKET_NAME + '.chunks'
  }

  static get fileCollection () {
    return this.db.collection(this.fileCollectionName)
  }

  static get chunkCollection () {
    return this.db.collection(this.chunkCollectionName)
  }
}
