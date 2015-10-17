'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _firebase = require('firebase');

var _firebase2 = _interopRequireDefault(_firebase);

var _aureliaDependencyInjection = require('aurelia-dependency-injection');

var _events = require('./events');

var events = _interopRequireWildcard(_events);

var _user = require('./user');

var _configuration = require('./configuration');

var AuthenticationManager = (function () {
  function AuthenticationManager(configuration, publisher) {
    var _this = this;

    _classCallCheck(this, _AuthenticationManager);

    this._firebase = null;
    this._publisher = null;
    this.currentUser = null;

    this._firebase = new _firebase2['default'](configuration.getFirebaseUrl());
    this._publisher = publisher;
    this.currentUser = new _user.User();

    if (configuration.getMonitorAuthChange() === true) {
      this._firebase.onAuth(function (result) {
        _this._onUserAuthStateChanged(result);
      }, this);
    }
  }

  _createClass(AuthenticationManager, [{
    key: 'createUser',
    value: function createUser(email, password) {
      var _this2 = this;

      return new _bluebird2['default'](function (resolve, reject) {
        _this2._firebase.createUser({ email: email, password: password }, function (error, result) {
          if (error) {
            reject(error);
            return;
          }

          var user = new _user.User(result);
          user.email = user.email || email;
          _this2._publisher.publish(new events.UserCreatedEvent(user));
          resolve(user);
        });
      });
    }
  }, {
    key: 'signIn',
    value: function signIn(email, password) {
      var _this3 = this;

      return new _bluebird2['default'](function (resolve, reject) {
        _this3._firebase.authWithPassword({ email: email, password: password }, function (error, result) {
          if (error) {
            reject(error);
            return;
          }

          var user = new _user.User(result);
          _this3._publisher.publish(new events.UserSignedInEvent(user));
          resolve(user);
        });
      });
    }
  }, {
    key: 'createUserAndSignIn',
    value: function createUserAndSignIn(email, password) {
      var _this4 = this;

      return this.createUser(email, password).then(function () {
        return _this4.signIn(email, password);
      });
    }
  }, {
    key: 'signOut',
    value: function signOut() {
      var _this5 = this;

      return new _bluebird2['default'](function (resolve) {
        _this5._firebase.unauth();
        _this5.currentUser.reset();
        resolve();
      });
    }
  }, {
    key: 'changeEmail',
    value: function changeEmail(oldEmail, password, newEmail) {
      var _this6 = this;

      return new _bluebird2['default'](function (resolve, reject) {
        _this6._firebase.changeEmail({ oldEmail: oldEmail, password: password, newEmail: newEmail }, function (error) {
          if (error) {
            reject(error);
            return;
          }

          _this6.currentUser.email = newEmail;
          var result = { oldEmail: oldEmail, newEmail: newEmail };
          _this6._publisher.publish(new events.UserEmailChangedEvent(result));
          resolve(result);
        });
      });
    }
  }, {
    key: 'changePassword',
    value: function changePassword(email, oldPassword, newPassword) {
      var _this7 = this;

      return new _bluebird2['default'](function (resolve, reject) {
        _this7._firebase.changePassword({ email: email, oldPassword: oldPassword, newPassword: newPassword }, function (error) {
          if (error) {
            reject(error);
            return;
          }

          var result = { email: email };
          _this7._publisher.publish(new events.UserPasswordChangedEvent(result));
          resolve(result);
        });
      });
    }
  }, {
    key: 'deleteUser',
    value: function deleteUser(email, password) {
      var _this8 = this;

      return new _bluebird2['default'](function (resolve, reject) {
        _this8._firebase.removeUser({ email: email, password: password }, function (error) {
          if (error) {
            reject(error);
            return;
          }

          _this8.currentUser.reset();
          var result = { email: email };
          _this8._publisher.publish(new events.UserDeletedEvent(result));
          resolve(result);
        });
      });
    }
  }, {
    key: '_onUserAuthStateChanged',
    value: function _onUserAuthStateChanged(authData) {
      this.currentUser.update(authData);
      this._publisher.publish(new events.UserAuthStateChangedEvent(authData));
    }
  }]);

  var _AuthenticationManager = AuthenticationManager;
  AuthenticationManager = (0, _aureliaDependencyInjection.inject)(_configuration.Configuration, events.Publisher)(AuthenticationManager) || AuthenticationManager;
  return AuthenticationManager;
})();

exports.AuthenticationManager = AuthenticationManager;