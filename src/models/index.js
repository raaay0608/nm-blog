// TODO: Error Type

import MongoDB, { MongoClient } from 'mongodb'
// import Category from './category'
// import PostImage from './post-image'
// import Post from './post'
// import Tag from './tag'

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

  // ======== utils ========
  static async ensureValidator () {
    const existing = await this.db.listCollections({name: this.COLL_NAME}).toArray()
    if (!existing || !existing.length) {
      return this.db.createCollection(this.COLL_NAME, {
        validator: { $jsonSchema: this.SCHEMA }
      })
    } else {
      return this.db.command({
        collMod: this.COLL_NAME,
        validator: { $jsonSchema: this.SCHEMA },
        validationLevel: 'strict'
      })
    }
  }

  static async ensureIndexes () {
    // TODO
  }

  // ======== customized functions for all models ========

  /**
   * Get all the docs which meet the filter
   */
  static async list (filter) {
    return this.collection.find(filter).toArray()
  }

  /**
   * Get one, throw error if not found
   */
  static async get (query) {
    const doc = await this.collection.findOne(query)
    if (!doc) {
      throw new Error('Not found')
    }
    return doc
  }

  /**
   * Simply insert doc and renturn it
   */
  static async create (doc) {
    const res = await this.insertOne(doc)
    return res.ops[0]
  }

  /**
   * Edit and return the updated document
   */
  static async modify (filter, update) {
    const res = await this.findOneAndUpdate(filter, { $set: update }, { returnOriginal: false })
    if (!res.value) {
      throw new Error('Not found')
    }
    return res.value
  }

  static async delete (filter) {
    let res = await this.findOneAndDelete(filter)
    if (!res.value) {
      throw new Error('Not Found') // should 404
    }
    return res.value
  }

  // ======== MongoDB.collection methods below ========

  static async aggregate (pipeline, options) {
    return this.collection.aggregate(pipeline, options)
  }

  static async deleteOne (filter, options) {
    // { n: 1, ok: 1}
    return this.collection.deleteOne(filter, options)
  }

  static async deleteMany (filter, options) {
    return this.collection.deleteMany(filter, options)
  }

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

  static get bucket () {
    const options = {
      bucketName: this.BUCKET_NAME,
      chunkSizeBytes: 255 * 1024
    }
    let bucket = new MongoDB.GridFSBucket(this.db, options)
    return bucket
  }

  static async ensureValidator () {
    // TODO
  }

  static async ensureIndexes () {
    // TODO
  }

  static getUploadStream (contentType, metadata = {}) {
    // use metadata.filename, not filename
    return this.bucket.openUploadStream(null, {
      contentType: contentType,
      metadata: metadata
    })
  }

  static getDownloadStreamById (id) {
    return this.bucket.openDownloadStream(MongoDB.ObjectId(id))
  }

  static async getDownloadStream (query) {
    const fileNode = await this.fileCollection.findOne(query)
    if (!fileNode) {
      throw new Error('Not found')
    }
    return this.getDownloadStreamById(fileNode._id)
  }

  // static async list (metadata = {}) {
  //   return this.fileCollection.find({ metadata }).toArray()
  // }

  static async list (query) {
    return this.fileCollection.find(query).toArray()
  }

  static async getById (_id) {
    _id = MongoDB.ObjectId(_id)
    const file = await this.fileCollection.findOne({ _id })
    if (!file) {
      throw new Error('Not found')
    }
    return file
  }

  static async get (query) {
    const file = await this.fileCollection.findOne(query)
    if (!file) {
      throw new Error('Not found')
    }
    return file
  }

  // static async getByMetadata (metadata = {}) {
  //   const file = await this.fileCollection.findOne({ metadata })
  //   if (!file) {
  //     throw new Error('Not found')
  //   }
  //   return file
  // }

  static async modifyFileInfo (filter, update) {
    // TODO: throw Error if not found
    const options = { returnOriginal: false }
    const res = this.fileCollection.findOneAndUpdate(filter, { $set: update }, options)
    if (!res.value) {
      throw new Error('Not found')
    }
    return res.value
  }

  static async deleteById (id) {
    // TODO: throw Error if not found
    const res = this.bucket.delete(MongoDB.ObjectId(id))
    return res
  }

  static async deleteOne (filter) {
    const fileNode = await this.fileCollection.findOne(filter)
    if (!fileNode) {
      throw new Error('Not found')
    }
    return this.deleteById(fileNode._id)
  }

  // static async deleteOneByMetadata (metadata = {}) {
  //   const fileNode = await this.fileCollection.findOne({ metadata })
  //   if (!fileNode) {
  //     throw new Error('Not found')
  //   }
  //   return this.deleteByIdById(fileNode._id)
  // }

  // static async deleteManyByMetadata (metadata = {}) {
  //   const fileNodes = await this.fileCollection.find({ metadata }).toArray()
  //   return Promise.all(fileNodes.map(fileNode => {
  //     return this.bucket.delete(fileNode._id)
  //   }))
  // }
}
