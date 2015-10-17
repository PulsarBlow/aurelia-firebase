import {Container} from 'aurelia-dependency-injection';
import {configure} from '../src/index';

describe('aurelia-firebase', () => {

  let container = new Container();

  describe('plugin initialization', () => {
    let aurelia = {
      globalizeResources: () => {

      },
      singleton: (type: any, implementation: Function) => {
        this.container.registerSingleton(type,implementation);
        return aurelia;
      },
      container: container
    };

    it('should export configure function', () => {
      expect(typeof configure).toBe('function');
    });

    it('should accept a setup callback passing back the configuration instance', (done) => {
      let firebaseUrl = 'https://aurelia-firebase.firebaseio.com',
        loginRoute = 'a/login/route',
        cb = (instance) => {
          expect(typeof instance).toBe('object');
          instance
            .setFirebaseUrl(firebaseUrl)
            .setMonitorAuthChange(true);
          done();
        };
      configure(aurelia, cb);
    });
  });
});
