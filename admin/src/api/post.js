import api from './index'

export const getPosts = () => api.get({ url: '/posts' })
