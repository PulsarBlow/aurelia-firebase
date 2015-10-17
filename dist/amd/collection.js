define(['exports', 'bluebird', 'firebase', 'aurelia-dependency-injection', './configuration'], function (exports, _bluebird, _firebase, _aureliaDependencyInjection, _configuration) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var _Promise = _interopRequireDefault(_bluebird);

  var _Firebase = _interopRequireDefault(_firebase);

  var ReactiveCollection = (function () {
    function ReactiveCollection(path) {
      _classCallCheck(this, ReactiveCollection);

      this._query = null;
      this._valueMap = new Map();
      this.items = [];

      if (!_aureliaDependencyInjection.Container || !_aureliaDependencyInjection.Container.instance) throw Error('Container has not been made global');
      var config = _aureliaDependencyInjection.Container.instance.get(_configuration.Configuration);
      if (!config) throw Error('Configuration has not been set');

      this._query = new _Firebase['default'](ReactiveCollection._getChildLocation(config.getFirebaseUrl(), path));
      this._listenToQuery(this._query);
    }

    _createClass(ReactiveCollection, [{
      key: 'add',
      value: function add(item) {
        var _this = this;

        return new _Promise['default'](function (resolve, reject) {
          var query = _this._query.ref().push();
          query.set(item, function (error) {
            if (error) {
              reject(error);
              return;
            }
            resolve(item);
          });
        });
      }
    }, {
      key: 'remove',
      value: function remove(item) {
        if (item === null || item.__firebaseKey__ === null) {
          return _Promise['default'].reject({ message: 'Unknown item' });
        }
        return this.removeByKey(item.__firebaseKey__);
      }
    }, {
      key: 'getByKey',
      value: function getByKey(key) {
        return this._valueMap.get(key);
      }
    }, {
      key: 'removeByKey',
      value: function removeByKey(key) {
        var _this2 = this;

        return new _Promise['default'](function (resolve, reject) {
          _this2._query.ref().child(key).remove(function (error) {
            if (error) {
              reject(error);
              return;
            }
            resolve(key);
          });
        });
      }
    }, {
      key: 'clear',
      value: function clear() {
        var _this3 = this;

        return new _Promise['default'](function (resolve, reject) {
          var query = _this3._query.ref();
          query.remove(function (error) {
            if (error) {
              reject(error);
              return;
            }
            resolve();
          });
        });
      }
    }, {
      key: '_listenToQuery',
      value: function _listenToQuery(query) {
        var _this4 = this;

        query.on('child_added', function (snapshot, previousKey) {
          _this4._onItemAdded(snapshot, previousKey);
        });
        query.on('child_removed', function (snapshot) {
          _this4._onItemRemoved(snapshot);
        });
        query.on('child_changed', function (snapshot, previousKey) {
          _this4._onItemChanded(snapshot, previousKey);
        });
        query.on('child_moved', function (snapshot, previousKey) {
          _this4._onItemMoved(snapshot, previousKey);
        });
      }
    }, {
      key: '_stopListeningToQuery',
      value: function _stopListeningToQuery(query) {
        query.off();
      }
    }, {
      key: '_onItemAdded',
      value: function _onItemAdded(snapshot, previousKey) {
        var value = this._valueFromSnapshot(snapshot);
        var index = previousKey !== null ? this.items.indexOf(this._valueMap.get(previousKey)) + 1 : 0;
        this._valueMap.set(value.__firebaseKey__, value);
        this.items.splice(index, 0, value);
      }
    }, {
      key: '_onItemRemoved',
      value: function _onItemRemoved(oldSnapshot) {
        var key = oldSnapshot.key();
        var value = this._valueMap.get(key);

        if (!value) {
          return;
        }

        var index = this.items.indexOf(value);
        this._valueMap['delete'](key);
        if (index !== -1) {
          this.items.splice(index, 1);
        }
      }
    }, {
      key: '_onItemChanged',
      value: function _onItemChanged(snapshot, previousKey) {
        var value = this._valueFromSnapshot(snapshot);
        var oldValue = this._valueMap.get(value.__firebaseKey__);

        if (!oldValue) {
          return;
        }

        this._valueMap['delete'](oldValue.__firebaseKey__);
        this._valueMap.set(value.__firebaseKey__, value);
        this.items.splice(this.items.indexOf(oldValue), 1, value);
      }
    }, {
      key: '_onItemMoved',
      value: function _onItemMoved(snapshot, previousKey) {
        var key = snapshot.key();
        var value = this._valueMap.get(key);

        if (!value) {
          return;
        }

        var previousValue = this._valueMap.get(previousKey);
        var newIndex = previousValue !== null ? this.items.indexOf(previousValue) + 1 : 0;
        this.items.splice(this.items.indexOf(value), 1);
        this.items.splice(newIndex, 0, value);
      }
    }, {
      key: '_valueFromSnapshot',
      value: function _valueFromSnapshot(snapshot) {
        var value = snapshot.val();
        if (!(value instanceof Object)) {
          value = {
            value: value,
            __firebasePrimitive__: true
          };
        }
        value.__firebaseKey__ = snapshot.key();
        return value;
      }
    }], [{
      key: '_getChildLocation',
      value: function _getChildLocation(root, path) {
        if (!path) {
          return root;
        }
        if (!root.endsWith('/')) {
          root = root + '/';
        }

        return root + (Array.isArray(path) ? path.join('/') : path);
      }
    }]);

    return ReactiveCollection;
  })();

  exports.ReactiveCollection = ReactiveCollection;
});