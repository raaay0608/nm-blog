import { Model } from '~/models/index'
import Post from './post'

/*
 * slug {string} - required, unique, index
 * name {string} - required, unique, index
 */
class Tag extends Model {
  static get modelName () {
    return 'Tag'
  }

  static get collName () {
    return 'tags'
  }

  static get schema () {
    return {
      title: 'Tag',
      bsonType: 'object',
      required: ['_id', 'slug', 'name'],
      properties: {
        _id: {
          bsonType: 'objectId'
        },
        slug: {
          bsonType: 'string',
          minLength: 1,
          pattern: '^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$'
        },
        name: {
          minLength: 1,
          bsonType: 'string'
        }
      },
      additionalProperties: false
    }
  }

  static get indexes () {
    return [
      { key: { slug: 1 }, name: 'slug', unique: true },
      { key: { name: 1 }, name: 'name', unique: true }
    ]
  }

  static async delete (filter) {
    const tag = await this.get(filter)
    const posts = await Post.updateMany({ tags: tag._id }, { $pull: { tags: tag._id } })
    const tagData = await super.delete(filter)
    return {
      tag: tagData,
      posts: posts
    }
  }
}

export default Tag
