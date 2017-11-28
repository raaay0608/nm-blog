const urlBase = 'http://localhost:8000' // TODO

// const baseHeaders = new Headers({
//   'Content-Type': 'application/json',
//   'Accept': 'application/json',
//   'Accept-Charset': 'utf-8'
// })

// const multipartBaseHeader = new Headers({
//   // 'Content-Type': 'multipart/form-data',
//   'Content-Type': undefined, // browser will handle it...
//   'Accept': 'application/json',
//   'Accept-Charset': 'utf-8'
// })

const jsonHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Accept-Charset': 'utf-8'
}

const defaultHeaders = {
  'Accept': 'application/json',
  'Accept-Charset': 'utf-8'
}

function getHeaders (type = 'json') {
  let headers = {}
  switch (type) {
    case 'json': {
      headers = Object.assign({}, jsonHeaders)
      break
    }
    case 'multipart': {
      headers = Object.assign({}, defaultHeaders)
      break
    }
    default: {
      headers = Object.assign({}, defaultHeaders)
      break
    }
  }
  if (localStorage.getItem('token')) {
    headers.append('Authorization', `Bearer ${localStorage.getItem('token')}`)
    headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`
  }
  return headers
}

function handleErrors (response) {
  if (!response.ok) {
    throw Error(response.status.toString() + response.statusText)
  }
  return response
}

// Return URL object
function urlWithQueires (url, queries = {}) {
  const _url = new URL(urlBase + url)
  Object.keys(queries).forEach(key => _url.searchParams.append(key, queries[key]))
  return _url
}

const get = ({url, queries = {}} = {}) => {
  url = urlWithQueires(url, queries)
  const init = {
    method: 'GET',
    headers: getHeaders('json')
  }
  return fetch(url, init)
    .then(handleErrors)
    .then(res => res.json())
}

const post = ({url, queries = {}, body = {}} = {}) => {
  url = urlWithQueires(url, queries)
  body = JSON.stringify(body)
  const init = {
    method: 'POST',
    headers: getHeaders('json'),
    body: body
  }
  return fetch(url, init)
    .then(handleErrors)
    .then(res => res.json())
}

const multipartPost = ({url, queries = {}, formData} = {}) => {
  url = urlWithQueires(url, queries)
  const init = {
    method: 'POST',
    headers: getHeaders('multipart'),
    body: formData
  }
  return fetch(url, init)
    .then(handleErrors)
    .then(res => res.json())
}

const put = ({url, queries = {}, body = {}} = {}) => {
  url = urlWithQueires(url, queries)
  body = JSON.stringify(body)
  const init = {
    method: 'PUT',
    headers: getHeaders('json'),
    body: body
  }
  return fetch(url, init)
    .then(handleErrors)
    .then(res => res.json())
}

const patch = ({url, queries = {}, body = {}} = {}) => {
  url = urlWithQueires(url, queries)
  body = JSON.stringify(body)
  const init = {
    method: 'PATCH',
    headers: getHeaders('json'),
    body: body
  }
  return fetch(url, init)
    .then(handleErrors)
    .then(res => res.json())
}

// The DELETE request (should) may lead a reasponse 204 without body.
const del = ({url, queries = {}} = {}) => {
  url = urlWithQueires(url, queries)
  const init = {
    method: 'DELETE',
    headers: getHeaders('json')
  }
  return fetch(url, init)
    .then(handleErrors)
    .then(res => res.json())
}

// Avoid preserver word "delete" conflict
// Import with "import API from '...'"
// Use with "API.delete({url: someUrl})"
export default {
  get: get,
  post: post,
  patch: patch,
  put: put,
  delete: del,
  multipartPost: multipartPost
}
