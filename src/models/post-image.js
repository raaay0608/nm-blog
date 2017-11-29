import { FileModel } from '~/models/index'

const BUCKET_NAME = 'posts.images'
const FILES_SCHEMA = {
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
          bsonType: 'string'
        }
      },
      additionalProperties: false // restrict allowed fields at the moment
    }
  },
  additionalProperties: true // allow extra fields for GridFS
}
const FILES_INDEXES = [
  { key: { 'metadata.post': 1 }, name: 'post' },
  { key: { 'metadata.post': 1, 'metadata.filename': 1 }, name: 'post_filename', unique: true }
]

export class PostImage extends FileModel {

}

PostImage.BUCKET_NAME = BUCKET_NAME
PostImage.FILES_SCHEMA = FILES_SCHEMA
PostImage.FILES_INDEXES = FILES_INDEXES

export default PostImage
