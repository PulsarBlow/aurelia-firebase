/**
 * Represents a Firebase User
 */
export class User {

  /**
   * A unique user ID, intented as the user's unique key accross all providers
   * @type {string}
   */
  uid = null;

  /**
   * The authentication method used
   * @type {string}
   */
  provider = null;

  /**
   * The Firebase authentication token for this session
   * @type {string}
   */
  token = null;

  /**
   * The contents of the authentication token
   * @type {Object}
   */
  auth = null;

  /**
   * A timestamp, in seconds since UNIX epoch, indicated when the authentication token expires
   * @type {number}
   */
  expires = 0;

  /**
   * The user's email address
   * @type {string}
   */
  email = null;

  /**
   * Whether or not the user authenticated using a temporary password,
   * as used in password reset flows.
   * @type {boolean}
   */
  isTemporaryPassword = null;

  /**
   * The URL to the user's Gravatar profile image
   * @type {string}
   */
  profileImageUrl = null;

  /**
   * Whether or not the user is authenticated
   * @type {boolean} True is the user is authenticated, false otherwise.
   */
  get isAuthenticated() {
    return (this.token && this.auth && this.expires > 0) || false;
  }

  /**
   * Initializes a new instance of user
   * @param userData {Object} Optional object containing data
   * to initialize this user with.
   */
  constructor(userData: Object = null) {
    this.update(userData);
  }

  /**
   * Update the current user instance with the provided data
   * @param userData {Object} An object containing the data
   */
  update(userData: Object) {
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

  /**
   * Reinitializes the current user instance.
   */
  reset() {
    this.update({});
  }
}
