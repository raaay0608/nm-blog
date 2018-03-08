/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { connect, db, collection,
  ensureCollection, setValidator, setIndexes } = require('./database');

dotenv.config();

/**
 * load all schema data from './schemas'
 */
function getSchemas() {
  const schemas = {};
  const modulePath = 'schemas';
  const dir = fs.readdirSync(path.join(modulePath));
  dir.forEach((filename) => {
    const { collectionName, indexes, schema } = require(`./${modulePath}/${filename.split('.')[0]}`);
    schemas[collectionName] = { collectionName, indexes, schema };
  });
  return schemas;
}


(async () => {
  try {
    await connect();
    const schemas = getSchemas();

    for (const [collectionName, { indexes, schema }] of Object.entries(schemas)) {
      const coll = await ensureCollection(collectionName);
      await setValidator(collectionName, schema);
      await setIndexes(collectionName, indexes);
    }
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    process.exit(0);
  }
})();
