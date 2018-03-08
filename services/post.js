const { ObjectId } = require('mongodb');
const lodash = require('lodash');
const { collection } = require('../database');
const { UnprocessableRequestError, ResourceNotFoundError } = require('../commons/errors');
const Aggregations = require('../commons/aggregations');


/**
 * Return the default props for a post
 * used when creating a new post
 * @returns {Object} the default props for a post
 */
function getDefaultProps() {
  const now = new Date();
  const defaultPros = {
    featureImage: null,
    images: [],
    categories: [],
    tags: [],
    content: '',
    draft: null,
    status: 'private',
    // password: null,
    createdAt: now,
    updatedAt: now,
  };
  return defaultPros;
}


/**
 * @param {ObjectId | null} category
 * @param {ObjectId | null} tag
 * return the count of all posts, that meets the requirement
 */
async function count({ category = null, tag = null } = {}) {
  const query = {};
  if (category) {
    query.categories = category;
  }
  if (tag) {
    query.tags = tag;
  }
  return collection('posts').count(query);
}


/**
 * get post list
 * @async
 * @param {Object} options
 * @param {number} options.skip - set to 0 or null to disable 'skip'
 * @param {limit} options.limit - set to 0 or null to disable 'limit'
 * @returns {Promise<Object>} object contains list of posts
 */
async function list({ skip = 0, limit = 0, category = null, tag = null } = {}) {
  const pipeline = [];
  if (category) {
    pipeline.push(Aggregations.match({ categories: category }));
  }
  if (tag) {
    pipeline.push(Aggregations.match({ tags: tag }));
  }
  if (skip) {
    pipeline.push(Aggregations.skip(skip));
  }
  if (limit) {
    pipeline.push(Aggregations.limit(limit));
  }
  pipeline.push(
    Aggregations.lookup({ from: 'categories', localField: 'categories', foreignField: '_id', as: 'categories' }),
    Aggregations.lookup({ from: 'tags', localField: 'tags', foreignField: '_id', as: 'tags' }),
  );
  const cursor = collection('posts').aggregate(pipeline);
  const posts = await cursor.toArray();
  return {
    posts,
  };
}


/**
 * find the first post that meets the `query`
 * @async
 * @param {Object} query - match the post
 * @returns {Promise<Object>} object contains post document
 */
async function getOne(query) {
  const pipeline = [
    Aggregations.match(query),
    Aggregations.limit(1),
    Aggregations.lookup({ from: 'categories', localField: 'categories', foreignField: '_id', as: 'categories' }),
    Aggregations.lookup({ from: 'tags', localField: 'tags', foreignField: '_id', as: 'tags' }),
  ];
  const cursor = collection('posts').aggregate(pipeline);
  const [post] = await cursor.toArray();
  if (!post) {
    throw new ResourceNotFoundError(`Post "${JSON.stringify(query)} not found"`);
  }
  return {
    post,
  };
}


/**
 * get a post document by _id
 * @async
 * @param {string|ObjectId} _id - post id
 * @returns {Promise<Object>} object contains post document
 */
async function getById(_id) {
  return getOne({ _id: ObjectId(_id) });
}


/**
 * Turn categories/tags Sub-Document to ObjectId, for inserting or updating
 * @async
 * @param {Object} data
 * @returns {Promise<Object>} processed data, with `categories` and `tags` are lists of ObjectId
 */
async function processData(data) {
  const processedData = lodash.cloneDeep(data);
  // slug
  if (!processedData.slug) {
    processedData.slug = processedData._id.toString();
  }
  if (processedData.createdAt) {
    processedData.createdAt = new Date(processedData.createdAt);
  }
  if (processedData.updatedAt) {
    processedData.updatedAt = new Date(processedData.updatedAt);
  }
  // categories
  const categoriesPromise = (async () => {
    if (processedData.categories && processedData.categories.length) {
      const categories = await collection('categories').find({ $or: processedData.categories }).toArray();
      if (categories.length !== processedData.categories.length) {
        throw new UnprocessableRequestError('There is at least one category cannot found');
      }
      processedData.categories = categories.map(c => c._id);
    }
  })();
  // tags
  const tagsPromise = (async () => {
    if (processedData.tags && processedData.tags.length) {
      const tags = await collection('tags').find({ $or: processedData.tags }).toArray();
      if (tags.length !== processedData.tags.length) {
        throw new UnprocessableRequestError('There is at least one tag cannot found');
      }
      processedData.tags = tags.map(t => t._id);
    }
  })();
  await Promise.all([categoriesPromise, tagsPromise]);
  // delete processedData._id;
  return processedData;
}


/**
 * Create a new post
 * @async
 * @param {Object} data - properties of post that will be created
 * @returns {Promise<Object>} the created post
 */
async function create(data) {
  const _id = new ObjectId();
  let processedData = await processData({ ...data, _id });
  const defaultPros = getDefaultProps();
  processedData = { ...defaultPros, ...processedData };
  const { result, ops, insertedCount, insertedId } = await collection('posts').insertOne(processedData);
  const { post, ...rest } = await getOne({ _id: insertedId });
  return { post, ...rest };
}


/**
 * update a post
 * @async
 * @param {Object} query - condition that matches a post
 * @param {Promise<Object>} data - the update data
 */
async function updateOne(query, data) {
  let post = await collection('posts').findOne(query);
  if (!post) {
    throw new ResourceNotFoundError(`Post "${JSON.stringify(query)}" not found`);
  }
  let processedData = await processData({ ...data, _id: post._id });
  processedData = { ...processedData, ...{ updatedAt: new Date() } };
  const { lastErrorObject, value, ok } = await collection('posts').findOneAndUpdate(query, { $set: processedData });
  if (!value) {
    throw new ResourceNotFoundError(`Post "${JSON.stringify(query)} not found"`);
  }
  post = await getOne({ _id: value._id });
  return { post };
}


/**
 * update a post by id
 * @async
 * @param {string|ObjectId} _id - post id
 * @param {Object} data - the update data
 * @returns {Promise<Object>} post data and update results if updating is successful
 */
async function updateById(_id, data) {
  return updateOne({ _id: ObjectId(_id) }, data);
}


/**
 * delete a post
 * also delete all images/attachments in the future
 * @async
 * @param {Object} query - matching post
 * @returns {Promise<Object>} post data and delete results
 */
async function deleteOne(query) {
  const original = await getOne(query);
  if (!original) {
    throw new ResourceNotFoundError(`Post "${JSON.stringify(query)} not found"`);
  }
  const { acknowledged, deletedCount } = await collection('posts').deleteOne(query);
  return {
    post: original,
    acknowledged,
    deletedCount,
  };
}


/**
 * delete a post
 * @async
 * @param {string|ObjectId} _id - post id
 * @returns {Promise<Object>} post data and delete results if updating is successful
 */
async function deleteById(_id) {
  return deleteOne({ _id: ObjectId(_id) });
}


module.exports = {
  count,
  list, getOne, getById,
  create, updateOne, updateById,
  deleteOne, deleteById,
};
