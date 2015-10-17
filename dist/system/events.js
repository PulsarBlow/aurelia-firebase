System.register(['aurelia-dependency-injection', 'aurelia-event-aggregator'], function (_export) {
  'use strict';

  var inject, EventAggregator, FirebaseEvent, UserEvent, UserCreatedEvent, UserSignedInEvent, UserSignedOutEvent, UserEmailChangedEvent, UserPasswordChangedEvent, UserDeletedEvent, UserAuthStateChangedEvent, Publisher;

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

  function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  return {
    setters: [function (_aureliaDependencyInjection) {
      inject = _aureliaDependencyInjection.inject;
    }, function (_aureliaEventAggregator) {
      EventAggregator = _aureliaEventAggregator.EventAggregator;
    }],
    execute: function () {
      FirebaseEvent = function FirebaseEvent() {
        _classCallCheck(this, FirebaseEvent);

        this.handled = false;
      };

      UserEvent = (function (_FirebaseEvent) {
        _inherits(UserEvent, _FirebaseEvent);

        function UserEvent() {
          var uid = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

          _classCallCheck(this, UserEvent);

          _get(Object.getPrototypeOf(UserEvent.prototype), 'constructor', this).call(this);
          this.uid = uid;
        }

        return UserEvent;
      })(FirebaseEvent);

      UserCreatedEvent = (function (_UserEvent) {
        _inherits(UserCreatedEvent, _UserEvent);

        function UserCreatedEvent(data) {
          _classCallCheck(this, UserCreatedEvent);

          _get(Object.getPrototypeOf(UserCreatedEvent.prototype), 'constructor', this).call(this, data.uid);
          this.email = data.email;
        }

        return UserCreatedEvent;
      })(UserEvent);

      _export('UserCreatedEvent', UserCreatedEvent);

      UserSignedInEvent = (function (_UserEvent2) {
        _inherits(UserSignedInEvent, _UserEvent2);

        function UserSignedInEvent(data) {
          _classCallCheck(this, UserSignedInEvent);

          _get(Object.getPrototypeOf(UserSignedInEvent.prototype), 'constructor', this).call(this, data.uid);
          this.provider = data.provider;
          this.email = data.email;
        }

        return UserSignedInEvent;
      })(UserEvent);

      _export('UserSignedInEvent', UserSignedInEvent);

      UserSignedOutEvent = (function (_UserEvent3) {
        _inherits(UserSignedOutEvent, _UserEvent3);

        function UserSignedOutEvent(data) {
          _classCallCheck(this, UserSignedOutEvent);

          _get(Object.getPrototypeOf(UserSignedOutEvent.prototype), 'constructor', this).call(this);
          this.email = data.email;
        }

        return UserSignedOutEvent;
      })(UserEvent);

      _export('UserSignedOutEvent', UserSignedOutEvent);

      UserEmailChangedEvent = (function (_UserEvent4) {
        _inherits(UserEmailChangedEvent, _UserEvent4);

        function UserEmailChangedEvent(data) {
          _classCallCheck(this, UserEmailChangedEvent);

          _get(Object.getPrototypeOf(UserEmailChangedEvent.prototype), 'constructor', this).call(this);
          this.oldEmail = data.oldEmail;
          this.newEmail = data.newEmail;
        }

        return UserEmailChangedEvent;
      })(UserEvent);

      _export('UserEmailChangedEvent', UserEmailChangedEvent);

      UserPasswordChangedEvent = (function (_UserEvent5) {
        _inherits(UserPasswordChangedEvent, _UserEvent5);

        function UserPasswordChangedEvent(data) {
          _classCallCheck(this, UserPasswordChangedEvent);

          _get(Object.getPrototypeOf(UserPasswordChangedEvent.prototype), 'constructor', this).call(this);
          this.email = data.email;
        }

        return UserPasswordChangedEvent;
      })(UserEvent);

      _export('UserPasswordChangedEvent', UserPasswordChangedEvent);

      UserDeletedEvent = (function (_UserEvent6) {
        _inherits(UserDeletedEvent, _UserEvent6);

        function UserDeletedEvent(data) {
          _classCallCheck(this, UserDeletedEvent);

          _get(Object.getPrototypeOf(UserDeletedEvent.prototype), 'constructor', this).call(this);
          this.email = data.email;
        }

        return UserDeletedEvent;
      })(UserEvent);

      _export('UserDeletedEvent', UserDeletedEvent);

      UserAuthStateChangedEvent = (function (_UserEvent7) {
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

      _export('UserAuthStateChangedEvent', UserAuthStateChangedEvent);

      Publisher = (function () {
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
        Publisher = inject(EventAggregator)(Publisher) || Publisher;
        return Publisher;
      })();

      _export('Publisher', Publisher);
    }
  };
});