const { slugRegexString } = require('../commons/regex');


const collectionName = 'posts';

const indexes = [
  { key: { slug: 1 }, unique: true },
  { key: { title: 1 } },
  // { key: { createdAt: 1 } },
  // { key: { createdAt: 1, tags: 1 } },
  // { key: { createdAt: 1, categories: 1 } },
];

const schema = {
  title: 'Post',
  bsonType: 'object',
  required: [
    '_id',
    'slug',
    'title',
    // 'featureImage',
    'content',
    // 'draft',
    'categories',
    'tags',
    'status',
    // 'password',
    'createdAt',
    'updatedAt',
  ],
  properties: {
    _id: {
      bsonType: 'objectId',
    },
    slug: {
      bsonType: 'string',
      minLength: 1,
      pattern: slugRegexString,
    },
    title: {
      bsonType: 'string',
      minLength: 1,
    },
    // featureImage: {
    //   bsonType: ['objectId', 'null'],
    // },
    excerpt: {
      bsonType: 'string',
    },
    content: {
      bsonType: 'string',
    },
    categories: {
      bsonType: 'array',
      items: { bsonType: 'objectId' },
    },
    tags: {
      bsonType: 'array',
      items: { bsonType: 'objectId' },
    },
    status: {
      bsonType: 'string',
      enum: ['public', 'private'],
      // enum: ['public', 'private', 'password'],
    },
    // password: {
    //   bsonType: ['string', 'null'],
    // },
    createdAt: {
      bsonType: 'date',
    },
    updatedAt: {
      bsonType: 'date',
    },
  },
  additionalProperties: false,
};


module.exports = {
  collectionName, indexes, schema,
};
