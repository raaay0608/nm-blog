import api from './index'

export const checkToken = () => api.get({
  url: '/token'
})

export const getToken = (body) => api.post({
  url: '/token',
  body: body
})
