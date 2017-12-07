import MongoDB, { MongoClient, Server } from 'mongodb'
import config from 'config'
// import Category from './category'
// import PostImage from './post-image'
// import Post from './post'
// import Tag from './tag'

let _client = null

export async function connect ({
  mongoAddress = config.get('mongo.address') || 'localhost',
  mongoPort = config.get('mongo.port') || 27017,
  mongoUser = config.get('mongo.user'),
  mongoPassword = config.get('mongo.password'),
  authSource = config.get('mongo.authSource') || config.get('mongo.database')
} = {}) {
  if (_client) {
    return _client.db(config.get('mongo.database'))
  }
  const client = await new MongoClient(new Server(mongoAddress, mongoPort), {
    user: mongoUser,
    password: mongoPassword,
    authSource: authSource
  }).connect()
  _client = client
}

export function close () {
  if (!_client) {
    return
  }
  return _client.close()
    .then(ret => {
      _client = null
    })
}

export function connection () {
  return _client.db(config.get('mongo.database'))
}

export function collection (collName) {
  return _client.db(config.get('mongo.database')).collection(collName)
}

/**
 * Base model class
 * Static only
 */
export class Model {
  static get db () {
    return _client.db(config.get('mongo.database'))
  }

  static get collection () {
    return this.db.collection(this.collName)
  }

  // ======== to be overwrited ========

  static get modelName () {
    throw new CallingAbstractMethod('Getter [modelName] does not implemented')
  }

  static get collName () {
    throw new CallingAbstractMethod('Getter [collName] does not implemented')
  }

  static get schema () {
    throw new CallingAbstractMethod('Getter [schema] does not implemented')
  }

  static get indexes () {
    throw new CallingAbstractMethod('Getter [indexes] does not implemented')
  }

  // ======== utils ========
  static async ensureValidator () {
    const existing = await this.db.listCollections({name: this.collName}).toArray()
    if (!existing || !existing.length) {
      return this.db.createCollection(this.collName, {
        validator: { $jsonSchema: this.schema }
      })
    } else {
      // return this.db.command({
      //   collMod: this.collName,
      //   validator: { $jsonSchema: this.schema },
      //   validationLevel: 'strict'
      // })
      return true
    }
  }

  static async ensureIndexes () {
    return this.collection.createIndexes(this.indexes)
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
      throw new DoesNotExist('not found')
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
      throw new DoesNotExist('not found')
    }
    return res.value
  }

  static async delete (filter) {
    let res = await this.findOneAndDelete(filter)
    if (!res.value) {
      throw new DoesNotExist('not found')
    }
    return res.value
  }

  // ======== MongoDB.collection methods below ========

  static async aggregate (pipeline, options) {
    return this.collection.aggregate(pipeline, options)
  }

  static async count (query, options) {
    return this.collection.count(query, options)
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
    return _client.db(config.get('mongo.database'))
  }

  static get bucketName () {
    throw new Error('Getter [bucketName] does not implemented')
  }

  static get fileCollectionName () {
    return this.bucketName + '.files'
  }

  static get chunkCollectionName () {
    return this.bucketName + '.chunks'
  }

  static get fileCollection () {
    return this.db.collection(this.fileCollectionName)
  }

  static get chunkCollection () {
    return this.db.collection(this.chunkCollectionName)
  }

  static get bucket () {
    const options = {
      bucketName: this.bucketName,
      chunkSizeBytes: 255 * 1024
    }
    let bucket = new MongoDB.GridFSBucket(this.db, options)
    return bucket
  }

  static async ensureValidator () {
    return this.ensureFileValidator()
  }

  static async ensureFileValidator () {
    const existing = await this.db.listCollections({name: this.fileCollectionName}).toArray()
    if (!existing || !existing.length) {
      return this.db.createCollection(this.fileCollectionName, {
        validator: { $jsonSchema: this.filesSchema }
      })
    } else {
      // return this.db.command({
      //   collMod: this.fileCollectionName,
      //   validator: { $jsonSchema: this.filesSchema },
      //   validationLevel: 'strict'
      // })
      return true
    }
  }

  static async ensureIndexes () {
    return this.ensureFileIndexes()
  }

  static async ensureFileIndexes () {
    return this.fileCollection.createIndexes(this.filesIndexes)
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
      throw new DoesNotExist('not found')
    }
    return this.getDownloadStreamById(fileNode._id)
  }

  static async list (query) {
    return this.fileCollection.find(query).toArray()
  }

  static async getById (_id) {
    _id = MongoDB.ObjectId(_id)
    const file = await this.fileCollection.findOne({ _id })
    if (!file) {
      throw new DoesNotExist('not found')
    }
    return file
  }

  static async get (query) {
    const file = await this.fileCollection.findOne(query)
    if (!file) {
      throw new DoesNotExist('not found')
    }
    return file
  }

  static async modifyFileInfo (filter, update) {
    // TODO: throw Error if not found
    const options = { returnOriginal: false }
    const res = this.fileCollection.findOneAndUpdate(filter, { $set: update }, options)
    if (!res.value) {
      throw new DoesNotExist('not found')
    }
    return res.value
  }

  static async deleteById (id) {
    // TODO: throw Error if not found
    return this.bucket.delete(MongoDB.ObjectId(id))
  }

  static async deleteOne (filter) {
    const fileNode = await this.fileCollection.findOne(filter)
    if (!fileNode) {
      throw new DoesNotExist('not found')
    }
    return this.deleteById(fileNode._id)
  }

  static async deleteMany (filter) {
    const files = await this.fileCollection.find(filter).toArray()
    return Promise.all(files.map(file => this.deleteById(file._id)))
  }
}

class DBError extends Error {
  constructor (message, status) {
    super(message)
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
    this.status = status || 500
  }
};

export class DoesNotExist extends DBError {
  constructor (message) {
    super(message, 404)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DoesNotExist)
    }
  }
}

export class CallingAbstractMethod extends Error {
  constructor (message) {
    super(message)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CallingAbstractMethod)
    }
  }
}

export class NotImplemented extends Error {
  constructor (message) {
    super(message)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NotImplemented)
    }
  }
}
