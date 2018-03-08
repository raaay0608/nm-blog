const { ObjectId } = require('mongodb');
const { collection } = require('../database');
const { ResourceNotFoundError } = require('../commons/errors');


/**
 * get all tag documents
 * @returns {Promise<Object>} object contains a list of tags
 */
async function list() {
  const tags = await collection('tags').find().toArray();
  return { tags };
}


/**
 * get the first document that matches the condition
 * @async
 * @param {Object} query - match the target tag
 * @returns {Promise<Object>} object contains tag data
 */
async function getOne(query) {
  const tag = await collection('tags').findOne(query);
  if (!tag) {
    throw new ResourceNotFoundError(`Tag "${JSON.stringify(query)}" not found`);
  }
  return { tag };
}

/**
 * get a tag by id
 * @async
 * @param {string|ObjectId} _id - tag id
 * @returns {Promise<Object>} object contains tag data
 */
async function getById(_id) {
  return getOne({ _id: ObjectId(_id) });
}

/**
 * create a tag document with give data
 * @async
 * @param {Object} data - data of tag will be created
 * @returns {Promise<Object>} object contains created tag and create result
 */
async function create(data) {
  const res = await collection('tags').insertOne(data);
  const {
    result, ops, insertedCount, insertedId,
  } = res;
  const tag = ops[0];
  return { tag, result };
  // result: { n: 1, ok: 1 }
  // ops: list of docs
}

/**
 * get the first document that matches the condition,
 * and update it with given data
 * @async
 * @param {Object} query - match the target tag
 * @param {Object} data - update data
 * @returns {Promise<Object>} object contains updated tag
 */
async function updateOne(query, data) {
  const res = await collection('tags')
    .findOneAndUpdate(query, { $set: data }, { returnOriginal: false });
  const { lastErrorObject, value, ok } = res;
  if (!value) {
    throw new ResourceNotFoundError(`Tag ${query} not found`);
  }
  return { tag: value };
}

/**
 * update a tag, by id
 * @async
 * @param {string|ObjectId} _id - tag id
 * @param {*} data - update data
 * @returns {Promise<Object>} object contains updated tag
 */
async function updateById(_id, data) {
  return updateOne({ _id: ObjectId(_id) }, data);
}

/**
 * get the first tag document that matches the condition,
 * and delete it.
 * @async
 * @param {Object} query - match the target tag
 * @returns {Promise<Object>} object contains origin data and delete result
 */
async function deleteOne(query) {
  const { lastErrorObject, value, ok } = await collection('tags').findOneAndDelete(query);
  if (!value) {
    throw new ResourceNotFoundError(`Tag ${query} not found`);
  }
  return { tag: value, lastErrorObject, ok };
}

/**
 * delete tag by id
 * @async
 * @param {string|ObjectId} _id - tag id
 * @returns {Promise<Object>} object contains origin data and delete result
 */
async function deleteById(_id) {
  return deleteOne({ _id: ObjectId(_id) });
}

module.exports = {
  list, getOne, getById,
  create, updateOne, updateById,
  deleteOne, deleteById,
};
