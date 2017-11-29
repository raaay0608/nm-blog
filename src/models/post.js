import MongoDB from 'mongodb'
import { Model } from '~/models/index'
import Category from '~/models/category'
import Tag from '~/models/tag'
import PostImage from '~/models/post-image'

const ObjectId = MongoDB.ObjectId

/*
 * slug       {string} - required, unique, index
 * title      {string} - required, unique(?), index
 * heroImage  {string} - could be empty '', relative url, e.g. 'images/hero.jpg'
 * intro      {string} - could be empty ''
 * content    {string} - could be empty ''
 * category   {ObjectId} - reference to Category
 * tags       {list<ObjectId>} - references to Tag
 * state      {string} - required, in ['published', 'draft'], default='draft'
 * date       {Date} - required, default=now
 */
export class Post extends Model {
  static get modelName () {
    return 'Post'
  }

  static get collName () {
    return 'posts'
  }

  static get schema () {
    return {
      title: 'Post',
      bsonType: 'object',
      required: ['_id', 'slug', 'title', 'heroImage', 'intro', 'content', 'category', 'tags', 'state', 'date'],
      properties: {
        _id: {
          bsonType: 'objectId'
        },
        slug: {
          bsonType: 'string',
          minLength: 1,
          pattern: '^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$'
        },
        title: {
          minLength: 1,
          bsonType: 'string'
        },
        heroImage: {
          bsonType: 'string'
        },
        intro: {
          bsonType: 'string'
        },
        content: {
          bsonType: 'string'
        },
        category: {
          bsonType: ['objectId', 'null']
        },
        tags: {
          bsonType: 'array',
          items: { bsonType: 'objectId' }
        },
        state: {
          bsonType: 'string', // or bool?
          enum: ['draft', 'published']
        },
        date: {
          bsonType: 'date'
        }
      },
      additionalProperties: false
    }
  }

  static get indexes () {
    return [
      { key: { slug: 1 }, name: 'slug', unique: true },
      { key: { title: 1 }, name: 'title', unique: true },
      { key: { category: 1 }, name: 'category' },
      { key: { tags: 1 }, name: 'tags' },
      { key: { state: 1 }, name: 'state' },
      { key: { date: 1 }, name: 'date' }
    ]
  }

  static async create (doc) {
    // default values and basic validations
    if (doc.date) {
      doc.state = new Date(doc.state) // iso-string to Date object
    }
    let defaultProps = {
      heroImage: '',
      intro: '',
      content: '',
      category: null,
      tags: [],
      state: 'draft',
      date: new Date()
    }
    doc = Object.assign(defaultProps, doc)

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
          from: Category.collName,
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
          from: Tag.collName,
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
          from: Category.collName,
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
          from: Tag.collName,
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

  static async modify (filter, update) {
    if (update.date) {
      update.date = new Date(update.date) // iso-string to Date object
    }

    if (update.category) {
      const _category = await Category.get({ $or: [
        { _id: ObjectId.isValid(update.category) ? ObjectId(update.category) : null },
        { slug: update.category },
        { name: update.category }
      ] })
      update.category = _category._id
    }

    if (update.tags && update.tags.length) {
      const _tags = await Promise.all(update.tags.map(tag => {
        return Tag.get({ $or: [
          { _id: ObjectId.isValid(tag) ? ObjectId(tag) : null },
          { slug: tag },
          { name: tag }
        ]})
      }))
      update.tags = _tags.map(tag => tag._id)
    }

    let res = await super.modify(filter, update)
    return this.get({ _id: res._id })
  }

  static async delete (filter) {
    const post = await super.get(filter)
    const delImgRes = await PostImage.deleteMany({'metadata.post': post._id})
    const delPostRes = await super.delete(filter)
    return { post: delPostRes, images: delImgRes }
  }
}

export default Post
