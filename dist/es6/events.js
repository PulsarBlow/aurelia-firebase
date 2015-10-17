import {inject} from 'aurelia-dependency-injection';
import {EventAggregator} from 'aurelia-event-aggregator';

class FirebaseEvent {
  handled = false;

  constructor() {
  }
}

class UserEvent extends FirebaseEvent {
  uid: string;

  constructor(uid: string = null) {
    super();
    this.uid = uid;
  }
}

/**
 * An event triggered when a user is created
 */
export class UserCreatedEvent extends UserEvent {
  email:string;
  constructor(data: Object) {
    super(data.uid);
    this.email = data.email;
  }
}

/**
 * An event triggered when a user signed in
 */
export class UserSignedInEvent extends UserEvent {
  provider: string;
  email: string;
  profileImageUrl:string;

  constructor(data: Object) {
    super(data.uid);
    this.provider = data.provider;
    this.email = data.email;
  }
}

/**
 * An event triggered when a user signed out
 */
export class UserSignedOutEvent extends UserEvent {
  email: string;
  constructor(data: Object) {
    super();
    this.email = data.email;
  }
}

/**
 * An event triggered when a user's email has changed
 */
export class UserEmailChangedEvent extends UserEvent {
  oldEmail: string;
  newEmail: string;
  constructor(data: Object) {
    super();
    this.oldEmail = data.oldEmail;
    this.newEmail = data.newEmail;
  }
}

/**
 * An event triggered when a user's password has changed
 */
export class UserPasswordChangedEvent extends UserEvent {
  email:string;
  constructor(data: Object) {
    super();
    this.email = data.email;
  }
}

/**
 * An event triggered when a user has been deleted
 */
export class UserDeletedEvent extends UserEvent {
  email: string;
  constructor(data: Object) {
    super();
    this.email = data.email;
  }
}

/**
 * An event triggered when a user authentication state has changed
 */
export class UserAuthStateChangedEvent extends UserEvent {
  provider: string;
  auth: any;
  expires: number;

  constructor(data: Object) {
    data = data || {};
    super(data.uid);
    this.provider = data.provider || null;
    this.auth = data.auth || null;
    this.expires = data.expires || 0;
  }
}

/**
 * Handles publishing events in the system
 */
@inject(EventAggregator)
export class Publisher {
  _eventAggregator;

  constructor(eventAggregator: EventAggregator) {
    this._eventAggregator = eventAggregator;
  }

  /**
   * Publish an event
   * @param {FirebaseEvent} event - The event to publish
   */
  publish(event: FirebaseEvent) {
    if (event.handled) {
      return;
    }
    this._eventAggregator.publish(event);
  }
}
