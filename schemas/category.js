const { slugRegexString } = require('../commons/regex');


const collectionName = 'categories';

const indexes = [
  { key: { slug: 1 }, unique: true },
  { key: { name: 1 }, unique: true },
];

const schema = {
  title: 'Category',
  bsonType: 'object',
  required: [
    '_id',
    'slug',
    'name',
    'description',
    'parent',
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
    name: {
      bsonType: 'string',
      minLength: 1,
    },
    description: {
      bsonType: 'string',
    },
    parent: {
      bsonType: ['objectId', 'null'],
    },
  },
  additionalProperties: false,
};


module.exports = {
  collectionName, indexes, schema,
};
