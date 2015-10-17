import faker from 'faker';
import {EventAggregator} from 'aurelia-event-aggregator';
import {Configuration} from '../src/configuration';
import {Publisher} from '../src/events';
import {AuthenticationManager} from '../src/authentication';
import {User} from '../src/user';
import * as helpers from './testHelpers';

describe('AuthenticationManager', () => {

  describe('without MonitorAuthStateChange', () => {
    let configuration = new Configuration(Configuration.defaults)
      .setFirebaseUrl('https://aurelia-firebase.firebaseio.com')
      .setMonitorAuthChange(false);
    let authManager = createAuthManager(configuration),
      email = createRandomTestEmail(),
      password = createRandomTestPassword();

    it('and should initialize properly', () => {
      expect(typeof authManager).toBe('object');
    });

    it('should create a new user', (done) => {
      authManager.createUser(email, password)
        .then((user)=> {
          expect(typeof user).toBe('object');
          expect(user.uid).toBeTruthy();
          expect(user.email).toBe(email);
          done();
        })
        .catch((error) => {
          helpers.logError('createUser test error', error);
          done.fail();
        });
    });

    it('should sign in the user', (done) => {
      authManager.signIn(email, password)
        .then((user) => {
          expect(typeof user).toBe('object');
          expect(user.provider).toBe('password');
          expect(user.uid).toBeTruthy();
          expect(user.token).toBeTruthy();
          expect(typeof user.auth).toBe('object');
          expect(user.auth.uid).toBe(user.uid);
          expect(user.auth.provider).toBe(user.provider);
          expect(user.expires).toBeGreaterThan(0);
          expect(user.email).toBe(email);
          expect(user.isTemporaryPassword).toBe(false);
          expect(user.profileImageUrl).toBeTruthy();
          expect(user.isAuthenticated).toBe(true);
          done();
        })
        .catch((error) => {
          helpers.logError('signIn test error', error);
          done.fail();
        });
    });

    it('should change the user\'s email', (done) => {
      let newEmail = createRandomTestEmail();
      authManager.changeEmail(email, password, newEmail)
        .then((result) => {
          expect(typeof result).toBe('object');
          expect(result.oldEmail).toBe(email);
          expect(result.newEmail).toBe(newEmail);
          email = newEmail; // used in the next test
          done();
        })
        .catch((error) => {
          helpers.logError('change email test error', error);
          done.fail()
        });
    });

    it('should change the user\'s password', (done) => {
      let newPassword = createRandomTestPassword();
      authManager.changePassword(email, password, newPassword)
        .then((result) => {
          expect(typeof result).toBe('object');
          expect(result.email).toBe(email);
          password = newPassword;
          done();
        })
        .catch((error) => {
          helpers.logError('change password test error', error);
          done.fail();
        });
    });

    it('should sign out a user', (done) => {
      authManager.signOut()
        .then(() => {
          done();
        })
        .catch((error) => {
          helpers.logError('signout test error', error);
          done.fail();
        });
    });

    it('should be able to relog after email and password changed', (done) => {
      authManager.signIn(email, password)
        .then(()=> {
          authManager.signOut();
          done();
        })
        .catch((error) => {
          helpers.logError('signIn test error', error);
          done.fail();
        });
    });

    it('should delete a user', (done) => {
      authManager.deleteUser(email, password)
        .then((result) => {
          expect(typeof result).toBe('object');
          expect(result.email).toBe(email);
          done();
        })
        .catch((error) => {
          helpers.logError('delete user test error', error);
          done.fail();
        });
    });

    it('should not be able to sign in after being deleted', (done) => {
      authManager.signIn(email, password)
        .then(() => {
          helpers.logError('signIn test error : user shouldn\'t be signed in');
          done.fail();
        })
        .catch(() => {
          done();
        });
    });
  });

  describe('createUserAndSignin', () => {

    it('should create and sign in a user', (done) => {

      let configuration = new Configuration(Configuration.defaults)
        .setFirebaseUrl('https://aurelia-firebase.firebaseio.com')
        .setMonitorAuthChange(false);
      let authManager = createAuthManager(configuration),
        email = createRandomTestEmail(),
        password = createRandomTestPassword();

      authManager.createUserAndSignIn(email, password)
        .then((user) => {
          expect(typeof user).toBe('object');
          expect(user.isAuthenticated).toBe(true);
          return authManager.signOut().then(() => {
            return authManager.deleteUser(email, password).then(() => {
              done();
            });
          });
        })
        .catch((error) => {
          helpers.logError('create user and signIn test error', error);
          done.fail();
        });
    });
  });

  describe('with monitorAuthStateChange', () => {

    it('should monitor auth state changes', (done) => {

      let configuration = new Configuration(Configuration.defaults)
        .setFirebaseUrl('https://aurelia-firebase.firebaseio.com')
        .setMonitorAuthChange(true);
      let authManager = createAuthManager(configuration),
        email = createRandomTestEmail(),
        password = createRandomTestPassword();

      authManager.createUserAndSignIn(email, password)
        .then((user) => {
          expect(typeof user).toBe('object');
          expect(user.isAuthenticated).toBe(true);
          expect(authManager.currentUser).toEqual(user);
          return authManager.signOut().then(() => {
            return authManager.deleteUser(email, password).then(() => {
              expect(authManager.currentUser.isAuthenticated).toBe(false);
              done();
            });
          });
        })
        .catch((error) => {
          helpers.logError('create user and signIn test error', error);
          done.fail();
        });
    });
  });

  function createRandomTestEmail() {
    setTimeout(function() {
      // Timeout to force timestamp increment
    }, 100);
    return 'xunittests_' + new Date().getTime() + '_' + faker.internet.email().toLowerCase();
  }

  function createRandomTestPassword() {
    return faker.internet.password();
  }

  function createAuthManager(configuration: Configuration) {
    return new AuthenticationManager(configuration, new Publisher(new EventAggregator()));
  }
});
