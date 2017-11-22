import { Model } from '~/models/index'

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
    // TODO: remove the category ref from posts
    return super.delete(filter)
  }
}

Category.MODEL_NAME = MODEL_NAME
Category.COLL_NAME = COLL_NAME

export default Category
