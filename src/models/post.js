import { Model } from '~/models/index'
import Category from '~/models/category' // eslint-disable-line no-unused-vars
import Tag from '~/models/tag' // eslint-disable-line no-unused-vars

const MODEL_NAME = 'Post'
const COLL_NAME = 'posts'

/*
 * slug       {string} - required, unique, index
 * title      {string} - required, unique(?), index
 * heroImage  {string} - not required, relative url, e.g. 'images/hero.jpg'
 * intro      {string} - not required
 * content    {string} - could be empty ''
 * cateogry   {ObjectId} - reference to Category
 * tags       {list<ObjectId>} - -references to Tag
 * state      {string} - required, in ['published', 'draft'], default='draft'
 * date       {Date} - required, default=now
 */

export class Post extends Model {
  static async create (doc) {
    let [_category, _tags] = [null, []]

    if (doc.category) {
      _category = await Category.get({ slug: doc.category })
    }

    if (doc.tags && doc.tags.length) {
      _tags = await Promise.all(doc.tags.map(tag => {
        Tag.get({ slug: tag })
      }))
    }

    doc.category = _category._id
    doc.tags = _tags.map(tag => tag._id)

    return super.create(doc)
  }

  // TODO, ref with _id, not slug
  static async get (query = {}) {
    const cursor = await this.aggregate([
      { $match: query },
      { $lookup:
        {
          from: Category.COLL_NAME,
          localField: 'category',
          foreignField: 'slug',
          as: 'category' // overwrite
        }
      },
      {
        $addFields: { // overwrite 'category' with the first, or null
          category: { $ifNull: [ { $arrayElemAt: [ '$category', 0 ] }, null ] }
        }
      },
      { $lookup:
        {
          from: Tag.COLL_NAME,
          localField: 'tags',
          foreignField: 'slug',
          as: 'tags' // overwrite
        }
      }
    ], { cursor: { batchSize: 1 } })
    return cursor.next()
  }

  // TODO, ref with _id, not slug
  static async list (filter = {}, {skip = 0, limit = 0} = {}) {
    const pipeline = [
      { $match: filter },
      { $sort: { date: -1 } }
    ]
    if (skip) {
      pipeline.push({ $skip: skip })
    }
    if (limit) {
      pipeline.push({ $limit: limit })
    }
    pipeline.push(
      { $lookup:
        {
          from: Category.COLL_NAME,
          localField: 'category',
          foreignField: 'slug',
          as: 'category' // overwrite
        }
      },
      {
        $addFields: { // overwrite 'category' with the first, or null
          category: { $ifNull: [ { $arrayElemAt: [ '$category', 0 ] }, null ] }
        }
      },
      { $lookup:
        {
          from: Tag.COLL_NAME,
          localField: 'tags',
          foreignField: 'slug',
          as: 'tags' // overwrite
        }
      }
    )

    const cursor = await this.aggregate(pipeline)
    const res = cursor.toArray
    return res
  }
}

Post.MODEL_NAME = MODEL_NAME
Post.COLL_NAME = COLL_NAME

export default Post
