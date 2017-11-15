
// TODO: Authorization: `Bearer ${token}`

const baseHeader = new Headers({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Accept-Charset': 'utf-8'
})

const fileUploadBaseHeader = new Headers({ // eslint-disable-line no-unused-vars
  'Content-Type': 'multipart/form-data',
  'Accept': 'application/json',
  'Accept-Charset': 'utf-8'
})

function handleErrors (response) {
  if (!response.ok) {
    throw Error(response.status.toString() + response.statusText)
  }
  return response
}

// Return URL object
function urlWithQueires (baseURL, queries = {}) {
  const _url = new URL(baseURL)
  Object.keys(queries).forEach(key => _url.searchParams.append(key, queries[key]))
  return _url
}

const get = ({url, queries = {}} = {}) => {
  url = urlWithQueires(url, queries)
  const init = {
    method: 'GET',
    headers: baseHeader
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
    headers: baseHeader
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
    headers: baseHeader
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
    headers: baseHeader
  }
  return fetch(url, init)
    .then(handleErrors)
    .then(res => res.json)
}

// The DELETE request (should) may lead a reasponse 204 without body.
const del = ({url, queries = {}} = {}) => {
  url = urlWithQueires(url, queries)
  const init = {
    method: 'PATCH',
    headers: baseHeader
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
  delete: del
}
