import api from './index'

export const getCategories = () => api.get({
  url: '/categories'
})

export const createCategory = (body) => api.post({
  url: '/categories',
  body: body
})

export const getCategory = (categoryName) => api.get({
  url: `/categories/${categoryName}`
})

export const updateCategory = (categoryName, body) => api.patch({
  url: `/categories/${categoryName}`,
  body: body
})

export const deleteCategory = (categoryName) => api.delete({
  url: `/categories/${categoryName}`
})
