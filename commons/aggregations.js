
/**
 * Filters the documents to pass only the documents that
 * match the specified condition(s)
 */
function match(query) {
  return { $match: query };
}


function project(specifications) {
  return { $project: specifications };
}

/**
 * combine $match and $or
 */
function matchAny(queries) {
  return {
    $match: {
      $or: [queries],
    },
  };
}

/**
 * similar to `join` in SQL databases
 */
function lookup({ from, localField, foreignField, as } = {}) {
  return {
    $lookup: {
      from, localField, foreignField, as,
    },
  };
}


function graphLookup({
  from, startWith, connectFromField, connectToField,
  as, depthField, restrictSearchWithMatch,
} = {}) {
  const query = {};
  if (from) {
    query.from = from;
  }
  if (startWith) {
    query.startWith = startWith;
  }
  if (connectFromField) {
    query.connectFromField = connectFromField;
  }
  if (connectToField) {
    query.connectToField = connectToField;
  }
  if (as) {
    query.as = as;
  }
  if (depthField) {
    query.depthField = depthField;
  }
  if (restrictSearchWithMatch) {
    query.restrictSearchWithMatch = restrictSearchWithMatch;
  }
  return {
    $graphLookup: query,
  };
}

/**
 * Replace a field which has an array value with its first elem
 * set null if not exist
 */
function useTheFirst(field) {
  return {
    $addFields: {
      [field]: { $ifNull: [{ $arrayElemAt: [`$${field}`, 0] }, null] },
    },
  };
}

/**
 * limit the number of results
 */
function limit(number) {
  return { $limit: number };
}

/**
 * skip the first n results
 */
function skip(number) {
  return { $skip: number };
}


module.exports = {
  match, project, matchAny, lookup, graphLookup, limit, skip, useTheFirst,
};
