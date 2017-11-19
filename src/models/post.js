import { Model } from '~/models/index'
import Category from '~/models/category' // eslint-disable-line no-unused-vars
import Tag from '~/models/tag' // eslint-disable-line no-unused-vars

const MODEL_NAME = 'Post'
const COLL_NAME = 'posts'

/*
 * title      {string} - required, unique(?), index
 * slug       {string} - required, unique, index
 * heroImage  {string} - not required, relative url, e.g. 'images/hero.jpg'
 * intro      {string} - not required
 * content    {string} - could be empty ''
 * cateogry   {ObjectId} - reference to Category
 * tags       {list<ObjectId>} - -references to Tag
 * state      {string} - required, in ['published', 'draft'], default='draft'
 * date       {Date} - required, default=now
 */

export class Post extends Model {
  static async list () {
    throw new Error('Model Function [Post.list] Not Implemented')
  }

  static async get (query) {
    throw new Error('Model Function [Post.get] Not Implemented')
  }

  static async create (doc) {
    throw new Error('Model Function [Post.create] Not Implemented')
  }
}

Post.MODEL_NAME = MODEL_NAME
Post.COLL_NAME = COLL_NAME

export default Post
