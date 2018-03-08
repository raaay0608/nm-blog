/* eslint-disable import/extensions */
import BaseApi from './base-api.js';

export function getTags() {
  return BaseApi.get('/api/tags');
}

export function createTag(body) {
  return BaseApi.post('/api/tags', body);
}

export function updateTag(_id, body) {
  return BaseApi.patch(`/api/tags/${_id}`, body);
}

export function deleteTag(_id) {
  return BaseApi.delete(`/api/tags/${_id}`);
}

export function getCategories() {
  return BaseApi.get('/api/categories?lookupParent=1');
}

export function createCategory(body) {
  return BaseApi.post('/api/categories', body);
}

export function updateCategory(_id, body) {
  return BaseApi.patch(`/api/categories/${_id}`, body);
}

export function deleteCategory(_id) {
  return BaseApi.delete(`/api/categories/${_id}`);
}

export function getPosts() {
  return BaseApi.get('/api/posts');
}

export function getPost(_id) {
  return BaseApi.get(`/api/posts/${_id}`);
}

export function createPost(body) {
  return BaseApi.post('/api/posts', body);
}

export function updatePost(_id, body) {
  return BaseApi.patch(`/api/posts/${_id}`, body);
}

export function deletePost(_id) {
  return BaseApi.delete(`/api/posts/${_id}`);
}

export function getFileList() {
  return BaseApi.get('/api/files');
}

export function uploadFile(file, filename = null) {
  if (!filename) {
    filename = file.name; // eslint-disable-line no-param-reassign
  }
  const url = `/api/files/${filename}`;
  const options = {
    headers: {
      'Content-Type': file.type,
    },
  };
  return BaseApi.put(url, file, options);
}

export function deleteFile(filename) {
  return BaseApi.delete(`/api/files/${filename}`);
}
