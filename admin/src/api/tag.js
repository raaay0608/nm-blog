import api from './index'

export const getTags = () => api.get({
  url: '/tags'
})

export const createTag = (body) => api.post({
  url: '/tags',
  body: body
})

export const getTag = (TagName) => api.get({
  url: `/tags/${TagName}`
})

export const updateTag = (TagName, body) => api.patch({
  url: `/tags/${TagName}`,
  body: body
})

export const deleteTag = (TagName) => api.delete({
  url: `/tags/${TagName}`
})
