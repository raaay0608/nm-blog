import { Model } from '~/models/index'
import Post from './post'

const MODEL_NAME = 'Tag'
const COLL_NAME = 'tags'

/*
 * slug {string} - required, unique, index
 * name {string} - required, unique, index
 */
const SCHEMA = {
  title: 'Tag',
  bsonType: 'object',
  required: ['_id', 'slug', 'name'],
  properties: {
    _id: {
      bsonType: 'objectId'
    },
    slug: {
      bsonType: 'string',
      pattern: '^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$'
    },
    name: {
      sonType: 'name'
    }
  },
  additionalProperties: false
}
const INDEXES = [
  { key: { slug: 1 }, name: 'slug', unique: true },
  { key: { name: 1 }, name: 'name', unique: true }
]

class Tag extends Model {
  static async delete (filter) {
    // TODO: cannot pull
    const tag = await this.get(filter)
    const posts = await Post.updateMany({ tags: tag._id }, { $pull: { tags: tag._id } })
    const tagData = await super.delete(filter)
    return {
      tag: tagData,
      posts: posts
    }
  }
}

Tag.MODEL_NAME = MODEL_NAME
Tag.COLL_NAME = COLL_NAME
Tag.SCHEMA = SCHEMA
Tag.INDEXES = INDEXES

export default Tag
