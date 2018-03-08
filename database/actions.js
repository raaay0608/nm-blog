/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */

const fs = require('fs');
const path = require('path');
const { connect, client, db, collection } = require('./state');


/**
 * load all schema data from './schemas'
 * @returns {Object}
 */
function getSchemas() {
  const schemas = {};
  const modulePath = path.join(__dirname, '../', 'schemas');
  const dir = fs.readdirSync(modulePath);
  dir.forEach((filename) => {
    const { collectionName, indexes, schema } = require(`${modulePath}/${filename.split('.')[0]}`);
    schemas[collectionName] = { collectionName, indexes, schema };
  });
  return schemas;
}


/**
 * create collection if not exist
 * @param {string} collName - collection name
 * @returns {Promise<mongodb.Collection>}
 */
async function ensureCollection(collName) {
  let [coll] = await db().listCollections({ name: collName }).toArray();
  if (coll) {
    return coll;
  }
  coll = await db().createCollection(collName);
  return coll;
}


/**
 * set jsonSchema validator
 * @param {string} collName - collection name
 * @param {Object} schema - MongoDB jsonSchema validator
 */
async function setValidator(collName, schema) {
  const { ok } = await db().command({
    collMod: collName,
    validator: { $jsonSchema: schema },
    validationLevel: 'strict',
  });
  return { ok };
}


/**
 * set indexes on a collection
 * @param {string} collName - collection name
 * @param {Array} indexes - indexes array
 */
async function setIndexes(collName, indexes) {
  if (!indexes || !indexes.length) {
    return;
  }
  const coll = db().collection(collName);
  const {
    createdCollectionAutomatically,
    numIndexesBefore,
    note,
    numIndexesAfter,
    ok,
  } = await coll.createIndexes(indexes);
}


module.exports = {
  getSchemas,
  ensureCollection,
  setValidator,
  setIndexes,
};
