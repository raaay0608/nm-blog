import api from './index'

export const getImages = (postSlug) => api.get({
  url: `/posts/${postSlug}/images`
})

export const uploadImage = (postSlug, formData) => api.multipartPost({
  url: `/posts/${postSlug}/images`,
  formData: formData
})

export const getImage = (postSlug, imageFilename) => api.get({
  url: `/posts/${postSlug}/images/${imageFilename}`
})

export const deleteImage = (postSlug, imageFilename) => api.delete({
  url: `/posts/${postSlug}/images/${imageFilename}`
})

export const updateImage = (articleSlug, imageFilename, data) => api.patch({
  url: `/articles/${articleSlug}/images/${imageFilename}`,
  data: data
})
