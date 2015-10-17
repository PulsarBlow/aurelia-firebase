import faker from 'faker';
import {Container} from 'aurelia-dependency-injection';
import {EventAggregator} from 'aurelia-event-aggregator';
import {Configuration} from '../src/configuration';
import {ReactiveCollection} from '../src/collection';
import {testHelpers} from './testHelpers';

describe('A ReactiveCollection', () => {

  let config = new Configuration(Configuration.defaults)
    .setFirebaseUrl('https://aurelia-firebase.firebaseio.com')
    .setMonitorAuthChange(false);
  let container = new Container();
  container.makeGlobal();
  container.registerInstance(Configuration, config);

  let id = faker.random.uuid(),
    value = faker.lorem.sentence(),
    collection = new ReactiveCollection(['unit_tests', faker.random.uuid()]);

  it('should initialize properly', () => {
    expect(typeof collection).toBe('object');
  });

  it('should add an item properly', (done) => {
    collection.add({id: id, value: value}).then((data) => {
      expect(data).not.toBeNull();
      expect(data.id).toBe(id);
      expect(data.value).toBe(value);

      let item = collection.items[0];
      expect(item).toBeDefined();
      expect(item.id).toBe(data.id);
      expect(item.value).toBe(data.value);
      expect(item.__firebaseKey__).toBeDefined();

      done();
    }).catch((error) => {
      testHelpers.logWarn('add item test failed', error);
      done.fail();
    });
  });

  it('should remove an item properly', (done) => {
    let item = collection.items[0];
    collection.remove(item)
      .then((itemKey) => {
        expect(itemKey).toBeTruthy();
        item = collection.items[0];
        expect(item).not.toBeDefined();
        done();
      })
      .catch(() => {
          done.fail();
       });
  });

  it('should find an item by key', (done) => {
    collection.add({id: id, value: value}).then((data) => {
      let actual = collection.items[0];
      let expected = collection.getByKey(actual.__firebaseKey__);
      expect(actual).toBe(expected);
      done();
    })
      .catch(() => {
        done.fail();
      });
  });

  it('should clear the collection accordingly', (done) => {
    collection.clear().then(() => {
      expect(collection.items.length).toBe(0);
      done();
    });
  });

  it('should handle a path location provided as a string', () => {
    expect(ReactiveCollection._getChildLocation('https://aurelia-firebase.firebaseio.com'))
      .toBe('https://aurelia-firebase.firebaseio.com');
    expect(ReactiveCollection._getChildLocation('https://aurelia-firebase.firebaseio.com/'))
      .toBe('https://aurelia-firebase.firebaseio.com/');
    expect(ReactiveCollection._getChildLocation('https://aurelia-firebase.firebaseio.com', null))
      .toBe('https://aurelia-firebase.firebaseio.com');
    expect(ReactiveCollection._getChildLocation('https://aurelia-firebase.firebaseio.com', 'apath'))
      .toBe('https://aurelia-firebase.firebaseio.com/apath');
    expect(ReactiveCollection._getChildLocation('https://aurelia-firebase.firebaseio.com/', 'apath'))
      .toBe('https://aurelia-firebase.firebaseio.com/apath');
  });

  it('should handle a path location provided as an array', () => {
    expect(ReactiveCollection._getChildLocation('https://aurelia-firebase.firebaseio.com'))
      .toBe('https://aurelia-firebase.firebaseio.com');
    expect(ReactiveCollection._getChildLocation('https://aurelia-firebase.firebaseio.com/'))
      .toBe('https://aurelia-firebase.firebaseio.com/');
    expect(ReactiveCollection._getChildLocation('https://aurelia-firebase.firebaseio.com', null))
      .toBe('https://aurelia-firebase.firebaseio.com');
    expect(ReactiveCollection._getChildLocation('https://aurelia-firebase.firebaseio.com', ['apath']))
      .toBe('https://aurelia-firebase.firebaseio.com/apath');
    expect(ReactiveCollection._getChildLocation('https://aurelia-firebase.firebaseio.com/', ['one', 'another']))
      .toBe('https://aurelia-firebase.firebaseio.com/one/another');
  });
});
