import api from './index'

export const getPosts = () => api.get({
  url: '/posts'
})

export const createPost = (body) => api.post({
  url: '/posts',
  body: body
})

export const getPost = (postSlug) => api.get({
  url: `/posts/${postSlug}`
})

export const updatePost = (postSlug, body) => api.patch({
  url: `/posts/${postSlug}`,
  body: body
})

export const deletePost = (postSlug) => api.delete({
  url: `/posts/${postSlug}`
})
