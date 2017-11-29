import { FileModel } from '~/models/index'

export class PostImage extends FileModel {
  static get bucketName () {
    return 'post.images'
  }

  static get filesSchema () {
    return {
      title: 'PostImage',
      bsonType: 'object',
      required: ['metadata'],
      properties: {
        metadata: {
          bsonType: 'object',
          required: ['post', 'filename'],
          properties: {
            post: {
              bsonType: 'objectId'
            },
            filename: {
              bsonType: 'string',
              minLength: 1,
              pattern: '^[A-Za-z0-9]+(?:[-.][A-Za-z0-9]+)*$'
            }
          },
          additionalProperties: false // restrict allowed fields at the moment
        }
      },
      additionalProperties: true // allow extra fields for GridFS
    }
  }

  static get filesIndexes () {
    return [
      { key: { 'metadata.post': 1 }, name: 'post' },
      { key: { 'metadata.post': 1, 'metadata.filename': 1 }, name: 'post_filename', unique: true }
    ]
  }
}

export default PostImage
