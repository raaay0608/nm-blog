import { Model } from '~/models/index'
import Post from './post'

const MODEL_NAME = 'Tag'
const COLL_NAME = 'tags'

/*
 * slug {string} - required, unique, index
 * name {string} - required, unique, index
 */
const VALIDATOR = {
  title: 'Tag',
  bsonType: 'object',
  required: ['_id', 'slug', 'name'],
  properties: {
    _id: {
      bsonType: 'objectId'
    },
    slug: {
      bsonType: 'string',
      pattern: '^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$',
      description: 'slug must be a valid-slug-string and is required'
    },
    name: {
      bsonType: 'name',
      description: 'name must be a string and is required'
    }
  },
  additionalProperties: false
}

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
Tag.VALIDATOR = VALIDATOR

export default Tag
