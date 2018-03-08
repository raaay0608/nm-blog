const { ObjectId } = require('mongodb');
const { cloneDeep } = require('lodash');

/* eslint-disable no-restricted-syntax */
/* eslint-disable no-param-reassign */
/* eslint-disable no-continue */

/**
 * deep iterate an object
 *   if `key` is `_id`, trans the value from string to `ObjectId`
 */
function convertId(body) {
  if (!body) {
    return body;
  }
  for (const [key, value] of Object.entries(body)) {
    if (key === '_id') {
      body[key] = ObjectId(value);
      continue;
    }
    if (value instanceof Object) {
      convertId(value);
    }
  }
  return body;
}

function copyAndConvertId(body) {
  const copy = cloneDeep(body);
  return convertId(copy);
}

module.exports = {
  convertId, copyAndConvertId,
};
