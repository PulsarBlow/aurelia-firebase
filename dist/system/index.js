System.register(['./configuration', './user', './authentication', './collection', './events'], function (_export) {
  'use strict';

  var Configuration;

  _export('configure', configure);

  function configure(aurelia, configCallback) {
    var config = new Configuration(Configuration.defaults);

    if (configCallback !== undefined && typeof configCallback === 'function') {
      configCallback(config);
    }
    aurelia.instance(Configuration, config);
  }

  return {
    setters: [function (_configuration) {
      Configuration = _configuration.Configuration;

      _export('Configuration', _configuration.Configuration);
    }, function (_user) {
      _export('User', _user.User);
    }, function (_authentication) {
      _export('AuthenticationManager', _authentication.AuthenticationManager);
    }, function (_collection) {
      _export('ReactiveCollection', _collection.ReactiveCollection);
    }, function (_events) {
      for (var _key in _events) {
        if (_key !== 'default') _export(_key, _events[_key]);
      }
    }],
    execute: function () {}
  };
});