import { Model } from '~/models/index'
import Post from './post'

const MODEL_NAME = 'Category' // eslint-disable-line no-unused-vars
const COLL_NAME = 'categories' // eslint-disable-line no-unused-vars

/*
 * slug        {string} - required, unique, index
 * name        {string} - required, unique, index
 * description {string}
 * preference  {number} - required, default = 0
 */

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

export default Category
