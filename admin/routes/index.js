/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */

const fs = require('fs');
const path = require('path');


const routes = {};


const dir = fs.readdirSync(__dirname);
dir.forEach((filename) => {
  if (filename.startsWith('index.')) {
    return;
  }
  const routeModule = require(path.join(__dirname, filename));
  let [moduleName] = filename.split('.');
  moduleName = `${moduleName.charAt(0).toUpperCase()}${moduleName.slice(1)}Route`;
  routes[moduleName] = routeModule;
});


module.exports = { ...routes };
