const { collection } = require('../database');
const { ResourceNotFoundError, UnprocessableRequestError } = require('../commons/errors');
const { match, project, graphLookup, lookup, useTheFirst, limit } = require('../commons/aggregations');
const { ObjectId } = require('mongodb');


/**
 * Get all category documents in list
 * @param {Object} options
 * @param {boolean} options.lookupParent - join the `parent` field with parent data as sub-doc
 * @param {boolean} options.parent - whether results contains `parent` field in id form.
 *  considered to be true when `lookupParent` is `true`
 * @returns {Promise<Object>} object contains list of categories
 */
async function list({ lookupParent = false, parent = false } = {}) {
  const pipeline = [];
  if (lookupParent) {
    pipeline.push(
      lookup({ from: 'categories', localField: 'parent', foreignField: '_id', as: 'parent' }),
      project({ 'parent.parent': 0 }),
      useTheFirst('parent'),
    );
  } else {
    // eslint-disable-next-line no-lonely-if
    if (!parent) {
      pipeline.push(project({ parent: 0 }));
    }
  }
  const cursor = collection('categories').aggregate(pipeline);
  const categories = await cursor.toArray();
  return {
    categories,
  };
}


/**
 * Get categories in parent-children tree form
 * Each category in the list is the 'root' category,
 * and the children categories listed in the `children` field
 * @async
 * @returns {Promise<Object>} object contains list of categories
 */
async function tree() {
  const cursor = collection('categories').aggregate([
    match({ parent: null }),
    graphLookup({ from: 'categories', startWith: '$_id',
      connectFromField: '_id', connectToField: 'parent',
      as: 'children' }),
  ]);
  const categories = await cursor.toArray();
  return {
    categories,
  };
}


/**
 * get the first category document that meets the condition
 * throw error if not found
 * @async
 * @param {Object} query - conditions that matches a category
 * @returns {Promise<Object>} object that contains category data
 */
async function getOne(query) {
  const pipeline = [
    match(query),
    limit(1),
    lookup({ from: 'categories', localField: 'parent', foreignField: '_id', as: 'parent' }),
    useTheFirst('parent'),
  ];
  const cursor = collection('categories').aggregate(pipeline, { cursor: { batchSize: 1 } });
  // use `toArray` instead of `next` to simplify the cursor operations
  const [category] = await cursor.toArray();
  if (!category) {
    throw new ResourceNotFoundError(`Category "${JSON.stringify(query)} not found"`);
  }
  return {
    category,
  };
}

/**
 * @async
 * @param {string|ObjectId} _id - category id
 * @returns {Promise<Object>} object that contains category data
 */
async function getById(_id) {
  return getOne({ _id: ObjectId(_id) });
}


/**
 * create a new category
 * TODO: may need trans string formated `_id` to ObjectId
 * @async
 * @param {Object} data - data of category to be created
 * @returns {Promise<Object>} object contains data of created info and create result
 */
async function create(data) {
  const processedData = Object.assign({}, data);
  // check data.parent exists, is Object, and not empty
  if (data.parent
    && data.parent.constructor === Object
    && Object.keys(data.parent).length !== 0) {
    const parent = await collection('categories').findOne(data.parent);
    if (!parent) {
      throw new UnprocessableRequestError(`Parent category ${JSON.stringify(data.parent)} not found`);
    }
    processedData.parent = parent._id;
  } else {
    processedData.parent = null; // set parent to null explicity
  }
  const res = await collection('categories').insertOne(processedData);
  const { result, ops, insertedCount, insertedId } = res;
  const category = await getOne({ _id: insertedId });
  return {
    category,
    result,
    insertedCount,
  };
}


/**
 * find one and update
 * @async
 * @param {Object} query - match the category that will be updated
 * @returns {Promise<Object>} object contains updated category data and update result
 */
async function updateOne(query, data) {
  const original = await collection('categories').findOne(query);
  if (!original) {
    throw new ResourceNotFoundError(`Category "${JSON.stringify(query)} not found"`);
  }
  const processedData = Object.assign({}, data);
  if (data.parent) {
    const parent = await collection('categories').findOne(data.parent);
    if (!parent) {
      throw new UnprocessableRequestError(`Parent category ${JSON.stringify(data.parent)} not found`);
    }
    processedData.parent = parent._id;
  }
  const { lastErrorObject, value, ok } = await collection('categories')
    .findOneAndUpdate(query, { $set: processedData }, { returnOriginal: false });
  // the following checking may be redundant
  if (!value) {
    throw new ResourceNotFoundError(`Category "${JSON.stringify(query)} not found"`);
  }
  const category = await getOne({ _id: value._id });
  return {
    category,
    ok,
  };
}


/**
 * update category by id
 * @async
 * @param {string|ObjectId} _id - category id
 * @param {Object} data - update data
 * @returns {Promise<Object>} object contains updated category data and update result
 */
async function updateById(_id, data) {
  return updateOne({ _id: ObjectId(_id) }, data);
}


/**
 * delete a category
 * @async
 * @param {Object} query - match the category will be deleted
 * @returns {Object} object contains original category data and delete results
 */
async function deleteOne(query) {
  const original = await getOne(query);
  if (!original) {
    throw new ResourceNotFoundError(`Category "${JSON.stringify(query)} not found"`);
  }
  // remove references to deleted doc
  // { acknowledged, matchedCount, modifiedCount, upsertedId }
  const [categoryRes, postRes] = await Promise.all([
    await collection('categories').updateMany({ parent: original._id }, { $set: { parent: null } }),
    await collection('posts').updateMany({ categories: original._id }, { $pull: { categories: original._id } }),
  ]);
  const { acknowledged, deletedCount } = await collection('categories').deleteOne(query);
  return {
    category: original,
    acknowledged,
    deletedCount,
    affectedCategories: categoryRes,
    affectedPosts: postRes,
  };
}


/**
 * delete a category by id
 * @async
 * @param {string|ObjectId} _id - category id
 * @returns {Promise<Object>} object contains original category data and delete results
 */
async function deleteById(_id) {
  return deleteOne({ _id: ObjectId(_id) });
}


module.exports = {
  list, tree,
  getOne, getById,
  create,
  updateOne, updateById,
  deleteOne, deleteById,
};
