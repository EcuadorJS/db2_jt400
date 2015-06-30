var traceur = require('traceur');
require('es6-shim');
require('es6-module-loader');

var path = require('path');

traceur.require.makeDefault(function(filename) {
  return filename.startsWith(__dirname) && !filename.startsWith(path.join(__dirname, 'node_modules'));
});

module.exports = require('./src/loader');
