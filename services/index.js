/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */

const fs = require('fs');
const path = require('path');


const services = {};


const dir = fs.readdirSync(__dirname);
dir.forEach((filename) => {
  if (filename.startsWith('index.')) {
    return;
  }
  const module = require(path.join(__dirname, filename));
  let [name] = filename.split('.');
  name = `${name.charAt(0).toUpperCase()}${name.slice(1)}Service`;
  services[name] = module;
});


module.exports = { ...services };
