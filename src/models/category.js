import { Model } from '~/models/index'
import Post from './post'

const MODEL_NAME = 'Category'
const COLL_NAME = 'categories'

/*
 * slug        {string} - required, unique, index
 * name        {string} - required, unique, index
 * description {string}
 * preference  {number} - required, default = 0
 */
const SCHEMA = {
  title: 'Category',
  bsonType: 'object',
  required: ['_id', 'slug', 'name', 'preference'],
  properties: {
    _id: {
      bsonType: 'objectId'
    },
    slug: {
      bsonType: 'string',
      pattern: '^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$'
    },
    name: {
      bsonType: 'name'
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
const INDEXES = [
  { key: { slug: 1 }, name: 'slug', unique: true },
  { key: { name: 1 }, name: 'name', unique: true }
]

export class Category extends Model {
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

Category.MODEL_NAME = MODEL_NAME
Category.COLL_NAME = COLL_NAME
Category.SCHEMA = SCHEMA
Category.INDEXES = INDEXES

export default Category
