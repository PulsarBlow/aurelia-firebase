'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.configure = configure;

function _interopExportWildcard(obj, defaults) { var newObj = defaults({}, obj); delete newObj['default']; return newObj; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

var _configuration = require('./configuration');

Object.defineProperty(exports, 'Configuration', {
  enumerable: true,
  get: function get() {
    return _configuration.Configuration;
  }
});

var _user = require('./user');

Object.defineProperty(exports, 'User', {
  enumerable: true,
  get: function get() {
    return _user.User;
  }
});

var _authentication = require('./authentication');

Object.defineProperty(exports, 'AuthenticationManager', {
  enumerable: true,
  get: function get() {
    return _authentication.AuthenticationManager;
  }
});

var _collection = require('./collection');

Object.defineProperty(exports, 'ReactiveCollection', {
  enumerable: true,
  get: function get() {
    return _collection.ReactiveCollection;
  }
});

var _events = require('./events');

_defaults(exports, _interopExportWildcard(_events, _defaults));

function configure(aurelia, configCallback) {
  var config = new _configuration.Configuration(_configuration.Configuration.defaults);

  if (configCallback !== undefined && typeof configCallback === 'function') {
    configCallback(config);
  }
  aurelia.instance(_configuration.Configuration, config);
}