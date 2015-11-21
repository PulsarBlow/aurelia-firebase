define(['exports', 'aurelia-dependency-injection', 'aurelia-event-aggregator'], function (exports, _aureliaDependencyInjection, _aureliaEventAggregator) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

  function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var FirebaseEvent = function FirebaseEvent() {
    _classCallCheck(this, FirebaseEvent);

    this.handled = false;
  };

  var UserEvent = (function (_FirebaseEvent) {
    _inherits(UserEvent, _FirebaseEvent);

    function UserEvent() {
      var uid = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      _classCallCheck(this, UserEvent);

      _get(Object.getPrototypeOf(UserEvent.prototype), 'constructor', this).call(this);
      this.uid = uid;
    }

    return UserEvent;
  })(FirebaseEvent);

  var UserCreatedEvent = (function (_UserEvent) {
    _inherits(UserCreatedEvent, _UserEvent);

    function UserCreatedEvent(data) {
      _classCallCheck(this, UserCreatedEvent);

      _get(Object.getPrototypeOf(UserCreatedEvent.prototype), 'constructor', this).call(this, data.uid);
      this.email = data.email;
    }

    return UserCreatedEvent;
  })(UserEvent);

  exports.UserCreatedEvent = UserCreatedEvent;

  var UserSignedInEvent = (function (_UserEvent2) {
    _inherits(UserSignedInEvent, _UserEvent2);

    function UserSignedInEvent(data) {
      _classCallCheck(this, UserSignedInEvent);

      _get(Object.getPrototypeOf(UserSignedInEvent.prototype), 'constructor', this).call(this, data.uid);
      this.provider = data.provider;
      this.email = data.email;
    }

    return UserSignedInEvent;
  })(UserEvent);

  exports.UserSignedInEvent = UserSignedInEvent;

  var UserSignedOutEvent = (function (_UserEvent3) {
    _inherits(UserSignedOutEvent, _UserEvent3);

    function UserSignedOutEvent(data) {
      _classCallCheck(this, UserSignedOutEvent);

      _get(Object.getPrototypeOf(UserSignedOutEvent.prototype), 'constructor', this).call(this);
      this.email = data.email;
    }

    return UserSignedOutEvent;
  })(UserEvent);

  exports.UserSignedOutEvent = UserSignedOutEvent;

  var UserEmailChangedEvent = (function (_UserEvent4) {
    _inherits(UserEmailChangedEvent, _UserEvent4);

    function UserEmailChangedEvent(data) {
      _classCallCheck(this, UserEmailChangedEvent);

      _get(Object.getPrototypeOf(UserEmailChangedEvent.prototype), 'constructor', this).call(this);
      this.oldEmail = data.oldEmail;
      this.newEmail = data.newEmail;
    }

    return UserEmailChangedEvent;
  })(UserEvent);

  exports.UserEmailChangedEvent = UserEmailChangedEvent;

  var UserPasswordChangedEvent = (function (_UserEvent5) {
    _inherits(UserPasswordChangedEvent, _UserEvent5);

    function UserPasswordChangedEvent(data) {
      _classCallCheck(this, UserPasswordChangedEvent);

      _get(Object.getPrototypeOf(UserPasswordChangedEvent.prototype), 'constructor', this).call(this);
      this.email = data.email;
    }

    return UserPasswordChangedEvent;
  })(UserEvent);

  exports.UserPasswordChangedEvent = UserPasswordChangedEvent;

  var UserDeletedEvent = (function (_UserEvent6) {
    _inherits(UserDeletedEvent, _UserEvent6);

    function UserDeletedEvent(data) {
      _classCallCheck(this, UserDeletedEvent);

      _get(Object.getPrototypeOf(UserDeletedEvent.prototype), 'constructor', this).call(this);
      this.email = data.email;
    }

    return UserDeletedEvent;
  })(UserEvent);

  exports.UserDeletedEvent = UserDeletedEvent;

  var UserAuthStateChangedEvent = (function (_UserEvent7) {
    _inherits(UserAuthStateChangedEvent, _UserEvent7);

    function UserAuthStateChangedEvent(data) {
      _classCallCheck(this, UserAuthStateChangedEvent);

      data = data || {};
      _get(Object.getPrototypeOf(UserAuthStateChangedEvent.prototype), 'constructor', this).call(this, data.uid);
      this.provider = data.provider || null;
      this.auth = data.auth || null;
      this.expires = data.expires || 0;
    }

    return UserAuthStateChangedEvent;
  })(UserEvent);

  exports.UserAuthStateChangedEvent = UserAuthStateChangedEvent;

  var Publisher = (function () {
    function Publisher(eventAggregator) {
      _classCallCheck(this, _Publisher);

      this._eventAggregator = eventAggregator;
    }

    _createClass(Publisher, [{
      key: 'publish',
      value: function publish(event) {
        if (event.handled) {
          return;
        }
        this._eventAggregator.publish(event);
      }
    }]);

    var _Publisher = Publisher;
    Publisher = (0, _aureliaDependencyInjection.inject)(_aureliaEventAggregator.EventAggregator)(Publisher) || Publisher;
    return Publisher;
  })();

  exports.Publisher = Publisher;
});