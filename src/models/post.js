import MongoDB from 'mongodb'
import { Model } from '~/models/index'
import Category from '~/models/category' // eslint-disable-line no-unused-vars
import Tag from '~/models/tag' // eslint-disable-line no-unused-vars

const ObjectId = MongoDB.ObjectId

const MODEL_NAME = 'Post'
const COLL_NAME = 'posts'

/*
 * slug       {string} - required, unique, index
 * title      {string} - required, unique(?), index
 * heroImage  {string} - could be empty '', relative url, e.g. 'images/hero.jpg'
 * intro      {string} - could be empty ''
 * content    {string} - could be empty ''
 * cateogry   {ObjectId} - reference to Category
 * tags       {list<ObjectId>} - references to Tag
 * state      {string} - required, in ['published', 'draft'], default='draft'
 * date       {Date} - required, default=now
 */

export class Post extends Model {
  static async create (doc) {
    // default values and basic validations
    // may add validator to MongoDB later
    doc.heroImage = doc.heroImage || ''
    doc.intro = doc.intro || ''
    doc.content = doc.content || ''
    doc.category = doc.category || null
    doc.tags = doc.tags || []
    doc.state = doc.state || 'draft'
    doc.date = doc.date || new Date()

    if (!doc.slug) {
      throw new Error(`Missing parameter "slug"`)
    }
    if (!doc.title) {
      throw new Error(`Missing parameter "title"`)
    }
    if (!['published', 'draft'].includes(doc.state)) {
      throw new Error(`Invalid parameter {state: ${doc.state}}`)
    }

    let [_category, _tags] = [null, []]

    if (doc.category) {
      _category = await Category.get({ $or: [
        { _id: ObjectId.isValid(doc.category) ? ObjectId(doc.category) : null },
        { slug: doc.category },
        { name: doc.category }
      ] })
      doc.category = _category._id
    }

    if (doc.tags && doc.tags.length) {
      _tags = await Promise.all(doc.tags.map(tag => {
        return Tag.get({ $or: [
          { _id: ObjectId.isValid(tag) ? ObjectId(tag) : null },
          { slug: tag },
          { name: tag }
        ]})
      }))
      doc.tags = _tags.map(tag => tag._id)
    }

    const plainDoc = await super.create(doc)
    return this.get({ _id: plainDoc._id })
  }

  static async get (query = {}) {
    const cursor = await this.aggregate([
      { $match: query },
      { $lookup:
        {
          from: Category.COLL_NAME,
          localField: 'category',
          foreignField: '_id',
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
          foreignField: '_id',
          as: 'tags' // overwrite
        }
      }
    ], { cursor: { batchSize: 1 } })
    return cursor.next()
  }

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
          foreignField: '_id',
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
          foreignField: '_id',
          as: 'tags' // overwrite
        }
      }
    )

    const cursor = await this.aggregate(pipeline)
    const res = cursor.toArray()
    return res
  }
}

Post.MODEL_NAME = MODEL_NAME
Post.COLL_NAME = COLL_NAME

export default Post
