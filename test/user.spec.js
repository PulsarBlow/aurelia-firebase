import {User} from '../src/user';

describe('User', () => {
  it('should initialize properly without initializer', () => {
    let user = new User();
    expect(user.uid).toBeNull();
    expect(user.provider).toBeNull();
    expect(user.token).toBeNull();
    expect(user.auth).toBeNull();
    expect(user.expires).toBe(0);
    expect(user.isTemporaryPassword).toBe(false);
    expect(user.profileImageUrl).toBeNull();
    expect(user.email).toBeNull();
    expect(user.isAuthenticated).toBe(false);
  });

  it('should initialize properly with uncomplete initializer', () => {
    let user = new User({uid:'uid'});
    expect(user.uid).toBe('uid');
    expect(user.provider).toBeNull();
    expect(user.token).toBeNull();
    expect(user.auth).toBeNull();
    expect(user.expires).toBe(0);
    expect(user.isTemporaryPassword).toBe(false);
    expect(user.profileImageUrl).toBeNull();
    expect(user.email).toBeNull();
    expect(user.isAuthenticated).toBe(false);
  });

  it('should returns truthy authenticated state', () => {
    let user = new User({auth: {}, token:'token', expires: 1000});
    expect(user.isAuthenticated).toBe(true);
  });

  it('should returns false authenticated state', () => {
    let user = new User({auth: {}, token:'token', expires: 0});
    expect(user.isAuthenticated).toBe(false);
  });

  it('should returns false authenticated state', () => {
    let user = new User({auth: {}, token:'token', expires: '45'});
    expect(user.isAuthenticated).toBe(true);
  });

  it('should returns false authenticated state', () => {
    let user = new User({auth: {}, token:'token', expires: 'abs'});
    expect(user.isAuthenticated).toBe(false);
  });

  it('should returns false authenticated state', () => {
    let user = new User({auth: {}, token:null, expires: 100});
    expect(user.isAuthenticated).toBe(false);
  });

  it('should returns false authenticated state', () => {
    let user = new User({auth: null, token:'token', expires: 1000});
    expect(user.isAuthenticated).toBe(false);
  });

  it('should returns false authenticated state', () => {
    let user = new User({auth: undefined, token:''});
    expect(user.isAuthenticated).toBe(false);
  });
});
