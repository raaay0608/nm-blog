import { Model } from '~/models/index'
import Post from './post'

/*
 * slug        {string} - required, unique, index
 * name        {string} - required, unique, index
 * description {string}
 * preference  {number} - required, default = 0
 */
export class Category extends Model {
  static get modelName () {
    return 'Category'
  }

  static get collName () {
    return 'categories'
  }

  static get schema () {
    return {
      title: 'Category',
      bsonType: 'object',
      required: ['_id', 'slug', 'name', 'preference'],
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
          bsonType: 'string',
          minLength: 1
        },
        description: {
          bsonType: 'string'
        },
        preference: {
          bsonType: 'int'
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

  static async list (filter) {
    return this.find(filter).sort({ preference: -1 }).toArray()
  }

  static async delete (filter) {
    const category = await this.get(filter)
    const posts = await Post.updateMany({ category: category._id }, { $set: { category: null } })
    const categoryData = await super.delete(filter)
    return {
      category: categoryData,
      posts: posts
    }
  }
}

export default Category
