/* eslint-disable padded-blocks */
/* eslint-disable no-useless-constructor */
/* eslint-disable no-multiple-empty-lines */


export class FileModel {

  constructor (name, bucketName, database, {fileCollectionOptions, chunkCollectionOptions} = {}) {
    if (!name) {
      throw new Error('Missing parameter "name"')
    }
    if (!bucketName) {
      throw new Error('Missing parameter "collectionName"')
    }
    if (!database) {
      throw new Error('Missing parameter "db"')
    }

    this._name = name
    this._bucketName = bucketName
    this._database = database
    this._fileCollectionOptions = fileCollectionOptions
    this._chunkCollectionOptions = chunkCollectionOptions
  }

  get bucketName () {
    return this._bucketName
  }

  get database () {
    return this.get
  }

  get fileCollectionName () {
    return this._bucketName + '.files'
  }

  get chunkCollectionName () {
    return this._bucketName + '.chunks'
  }

  async getFileCollection () {
    return this.database.getConnection().collection(this.fileCollectionName, this._fileCollectionOptions)
  }

  async getChunkCollection () {
    return this.database.getConnection().collection(this.chunkCollectionName, this._chunkCollectionOptions)
  }

}

export default FileModel
