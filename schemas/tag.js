const { slugRegexString } = require('../commons/regex');


const collectionName = 'tags';

const indexes = [
  { key: { slug: 1 }, unique: true },
  { key: { name: 1 }, unique: true },
];

const schema = {
  title: 'Tag',
  bsonType: 'object',
  required: [
    '_id',
    'slug',
    'name',
    'description',
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
  },
  additionalProperties: false,
};


module.exports = {
  collectionName, indexes, schema,
};
