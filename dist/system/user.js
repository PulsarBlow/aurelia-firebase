System.register([], function (_export) {
  "use strict";

  var User;

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  return {
    setters: [],
    execute: function () {
      User = (function () {
        _createClass(User, [{
          key: "isAuthenticated",
          get: function get() {
            return this.token && this.auth && this.expires > 0 || false;
          }
        }]);

        function User() {
          var userData = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

          _classCallCheck(this, User);

          this.uid = null;
          this.provider = null;
          this.token = null;
          this.auth = null;
          this.expires = 0;
          this.email = null;
          this.isTemporaryPassword = null;
          this.profileImageUrl = null;

          this.update(userData);
        }

        _createClass(User, [{
          key: "update",
          value: function update(userData) {
            userData = userData || {};
            this.uid = userData.uid || null;
            this.provider = userData.provider || null;
            this.token = userData.token || null;
            this.auth = userData.auth || null;
            this.expires = userData.expires || 0;

            userData.password = userData.password || {};
            this.isTemporaryPassword = userData.password.isTemporaryPassword || false;
            this.profileImageUrl = userData.password.profileImageURL || null;
            this.email = userData.password.email || null;
          }
        }, {
          key: "reset",
          value: function reset() {
            this.update({});
          }
        }]);

        return User;
      })();

      _export("User", User);
    }
  };
});