
async function doFetch(method, url, body, options) {
  const defaultOptions = {
    credentials: 'include', // use cookie
    headers: {},
  };

  const confirmedOptions = { method, body, ...defaultOptions, ...options };

  if (confirmedOptions.body) {
    if (confirmedOptions.body.constructor === File) {
      // If body is file
      confirmedOptions.headers['Content-Type'] = confirmedOptions.headers['Content-Type'] || 'application/octet-stream';
    } else {
      // Else, it should be a plain object
      // trans it to JSON
      confirmedOptions.headers['Content-Type'] = 'application/json';
      confirmedOptions.body = JSON.stringify(confirmedOptions.body);
    }
  }

  // Error handling
  const res = await fetch(url, confirmedOptions);
  if (!res.ok) {
    throw new Error(res.statusText);
  }

  // if it's json, parse it
  const resContentType = res.headers.get('Content-Type');
  if (resContentType && resContentType.includes('json')) {
    res.jsonBody = await res.json();
  }

  return res;
}

export default {
  get(url, options) {
    return doFetch('GET', url, null, options);
  },

  post(url, body, options) {
    return doFetch('POST', url, body, options);
  },

  patch(url, body, options) {
    return doFetch('PATCH', url, body, options);
  },

  put(url, body, options) {
    return doFetch('PUT', url, body, options);
  },

  delete(url, options) {
    return doFetch('DELETE', url, null, options);
  },
};
