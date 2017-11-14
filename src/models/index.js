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
  get db () {
    return _db
  }

  get collection () {
    return this.db.collection(this.COLL_NAME)
  }

  static async createCollection () {
    // TODO
  }

  static async ensureIndexes () {
    // TODO
  }
}
