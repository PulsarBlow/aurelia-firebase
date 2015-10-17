import {Configuration} from './configuration';

export {Configuration} from './configuration';
export {User} from './user';
export {AuthenticationManager} from './authentication';
export {ReactiveCollection} from './collection';
export * from './events';

export function configure(aurelia: Object, configCallback: Function) {
  let config = new Configuration(Configuration.defaults);

  if (configCallback !== undefined && typeof configCallback === 'function') {
    configCallback(config);
  }
  aurelia.instance(Configuration, config);
}
