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
 * category   {ObjectId} - reference to Category
 * tags       {list<ObjectId>} - references to Tag
 * state      {string} - required, in ['published', 'draft'], default='draft'
 * date       {Date} - required, default=now
 */
const VALIDATOR = {
  title: 'Post',
  bsonType: 'object',
  required: ['_id', 'slug', 'title', 'heroImage', 'intro', 'content', 'category', 'tags', 'state', 'date'],
  properties: {
    _id: {
      bsonType: 'objectId'
    },
    slug: {
      bsonType: 'string',
      pattern: '^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$',
      description: 'slug must be a valid-slug-string and is required'
    },
    title: {
      bsonType: 'string',
      description: 'title must be a string and is required'
    },
    heroImage: {
      bsonType: 'string',
      description: 'heroImage must be a string and represents a URL'
    },
    intro: {
      bsonType: 'string',
      description: 'intro must be string if exists'
    },
    content: {
      bsonType: 'string',
      description: 'content must be string'
    },
    category: {
      bsonType: ['objectId', 'null'],
      description: 'category must be a reference to Category if not null'
    },
    tags: {
      bsonType: 'array',
      items: {
        bsonType: 'objectId'
      },
      description: 'tags must be an array of references to Tag'
    },
    state: {
      bsonType: 'string', // or bool?
      enum: ['draft', 'published'],
      description: 'state must be either \'draft\' or \'published\''
    },
    date: {
      bsonType: 'date',
      description: 'date must be date type'
    }
  },
  additionalProperties: false
}

export class Post extends Model {
  static async create (doc) {
    // default values and basic validations

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

  static async modify (filter, update) {
    if (update.hasOwnProperty('state') && !['published', 'draft'].includes(update.state)) {
      throw new Error(`Invalid parameter {state: ${update.state}}`)
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
}

Post.MODEL_NAME = MODEL_NAME
Post.COLL_NAME = COLL_NAME
Post.VALIDATOR = VALIDATOR

export default Post
