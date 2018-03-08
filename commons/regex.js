// letters, numbers, and dash
const slugRegex = /^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/;
const slugRegexString = '^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$';
// common filename
const filenameRegex = /^[\w\-. ]+$/;
const filenameRegexString = '^[\\w\\-. ]+$';

module.exports = {
  slugRegex,
  slugRegexString,
  filenameRegex,
  filenameRegexString,
};
