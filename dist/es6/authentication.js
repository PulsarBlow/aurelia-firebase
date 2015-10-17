import Promise from 'bluebird';
import Firebase from 'firebase';
import {inject} from 'aurelia-dependency-injection';

import * as events from './events';
import {User} from './user';
import {Configuration} from './configuration';

/**
 * Handles Firebase authentication features
 */
@inject(Configuration, events.Publisher)
export class AuthenticationManager {

  _firebase = null;
  _publisher = null;
  currentUser = null;

  /**
   * Initializes a new instance of the AuthenticationManager
   * @param {Configuration} configuration - The configuration to use
   * @param {Publisher} publisher - The publisher used to broadcast system wide user events
   */
  constructor(
    configuration: Configuration,
    publisher: Publisher) {
    this._firebase = new Firebase(configuration.getFirebaseUrl());
    this._publisher = publisher;
    this.currentUser = new User();

    // Register auth state changed event
    // This will handle user data update now and in the future.
    if (configuration.getMonitorAuthChange() === true) {
      this._firebase.onAuth((result) => {
        this._onUserAuthStateChanged(result);
      }, this);
    }
  }

  /**
   * Creates a new user but does not authenticate him.
   * @param {string} email - The user email
   * @param {string} password - The user password
   * @returns {Promise<User>} - Returns a promise which on completion will return the user infos
   */
  createUser(email, password) : Promise<User> {
    return new Promise((resolve, reject) => {
      this._firebase.createUser({email: email, password: password}, (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        let user = new User(result);
        user.email = user.email || email; // Because firebase result doesn't provide the email
        this._publisher.publish(new events.UserCreatedEvent(user));
        resolve(user);
      });
    });
  }

  /**
   * Sign in a user with a password.
   * @param {string} email - The user email
   * @param {string} password - The user password
   * @returns {Promise<User>} Returns a promise which on completion will return user infos
   */
  signIn(email, password) : Promise<User> {
    return new Promise((resolve, reject) => {
      this._firebase.authWithPassword({email: email, password: password}, (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        let user = new User(result);
        this._publisher.publish(new events.UserSignedInEvent(user));
        resolve(user);
      });
    });
  }

  /**
   * Creates a user and automatically sign in if creation succeed
   * @param {string} email - The user email
   * @param {string} password - The user password
   * @returns {Promise<User>} - Returns a promise which on completion will return user infos
   */
  createUserAndSignIn(email, password) : Promise<User> {
    return this.createUser(email, password).then(() => {
      return this.signIn(email, password);
    });
  }

  /**
   * Sign out any authenticated user
   * @returns {Promise} - Returns a promise
   */
  signOut() : Promise {
    return new Promise((resolve) => {
      this._firebase.unauth();
      this.currentUser.reset();
      resolve();
    });
  }

  /**
   * Changes the user email.
   * User will be disconnected upon email change.
   * @param {string} oldEmail - The current user email (email to be changed)
   * @param {string} password - The current user password
   * @param {string} newEmail - The new email
   * @returns {Promise} - Returns a promise which on completion will return an object containing the old and new email
   */
  changeEmail(oldEmail, password, newEmail) : Promise {
    return new Promise((resolve, reject) => {
      this._firebase.changeEmail({oldEmail: oldEmail, password: password, newEmail: newEmail}, (error) => {
        if (error) {
          reject(error);
          return;
        }

        this.currentUser.email = newEmail;
        let result = {oldEmail: oldEmail, newEmail: newEmail};
        this._publisher.publish(new events.UserEmailChangedEvent(result));
        resolve(result);
      });
    });
  }

  /**
   * Changes the user password
   * @param {string} email - The email of the user to change the password
   * @param {string} oldPassword - The current password
   * @param {string} newPassword - The new password
   */
  changePassword(email, oldPassword, newPassword) : Promise {
    return new Promise((resolve, reject) => {
      this._firebase.changePassword({email: email, oldPassword: oldPassword, newPassword: newPassword}, (error) => {
        if (error) {
          reject(error);
          return;
        }

        let result = {email: email};
        this._publisher.publish(new events.UserPasswordChangedEvent(result));
        resolve(result);
      });
    });
  }

  /**
   * Deletes a user account
   * @param {string} email - The users's email
   * @param {string} password - The user's password
   */
  deleteUser(email: string, password: string) : Promise {
    return new Promise((resolve, reject) => {
      this._firebase.removeUser({email: email, password: password}, (error) => {
        if (error) {
          reject(error);
          return;
        }

        this.currentUser.reset();
        let result = {email: email};
        this._publisher.publish(new events.UserDeletedEvent(result));
        resolve(result);
      });
    });
  }

  _onUserAuthStateChanged(authData) {
    this.currentUser.update(authData);
    this._publisher.publish(new events.UserAuthStateChangedEvent(authData));
  }
}
