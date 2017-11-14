/* eslint-disable padded-blocks */
/* eslint-disable no-useless-constructor */
/* eslint-disable no-multiple-empty-lines */

import mongodb from 'mongodb' // eslint-disable-line no-unused-vars


const FileModelProxyHandler = {
  get: function (target, property, receiver) {
    if (property in target) {
      return target[property]
    }
    if (property in mongodb.Collection.prototype) {
      return target._collection[property]
    }
    return undefined
  }
}


/**
 * For GridFS, storing files
 */
export class FileModel {

}

export default FileModel
