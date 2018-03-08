const { ObjectId } = require('mongodb');
const database = require('../database');

const { bucket } = database;


function getBucket() {
  return database.bucket();
}

async function list(query = {}) {
  const files = await bucket().find(query).toArray();
  return { files };
}

async function findOne(query) {
  const [file] = await bucket().find(query, { batchSize: 1, limit: 1 }).toArray();
  return { file };
}

async function findById(fileId) {
  return findOne({ _id: ObjectId(fileId) });
}

async function findByName(filename) {
  return findOne({ filename });
}


async function deleteById(_id) {
  const res = await bucket().delete(_id); // return null
  return res;
}

async function deleteByName(filename) {
  const { file } = await findByName(filename);
  return deleteById(file._id);
}


function getUploadStream(filename, metadata = null) {
  const downloadStream = bucket().openUploadStream(filename, { metadata });
  return downloadStream;
}


function getDownloadStream(filename) {
  const downloadStream = bucket().openDownloadStreamByName(filename);
  return downloadStream;
}


module.exports = {
  list,
  findOne, findById, findByName,
  getUploadStream,
  getDownloadStream,
  deleteById, deleteByName,
};
