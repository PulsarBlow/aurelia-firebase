import faker from 'faker';
import {EventAggregator} from 'aurelia-event-aggregator';
import * as events from '../src/events';
import * as testHelpers from './testHelpers';

describe('A Publisher', () => {

  it('should initialize properly', () => {
    let publisher = new events.Publisher(new EventAggregator());
    expect(typeof publisher).toBe('object');
  });

  describe('publishing events', () => {
    let eventAggregator = new EventAggregator(),
      publisher = new events.Publisher(eventAggregator);

    it('should publish a UserCreatedEvent', (done) => {
      let data = createEventData();

      eventAggregator.subscribeOnce(events.UserCreatedEvent, (eventData) => {
        expect(eventData).toBeDefined();
        expect(eventData).not.toBeNull();
        expect(eventData.uid).toBe(data.uid);
        expect(eventData.email).toBe(data.email);
        done();
      });

      publisher.publish(new events.UserCreatedEvent(data));
    });

    it('should publish a UserSignedInEvent', (done) => {
      let data = createEventData();

      eventAggregator.subscribeOnce(events.UserSignedInEvent, (eventData) => {
        expect(eventData).toBeDefined();
        expect(eventData).not.toBeNull();
        expect(eventData.uid).toBe(data.uid);
        expect(eventData.email).toBe(data.email);
        expect(eventData.provider).toBe(data.provider);
        done();
      });

      publisher.publish(new events.UserSignedInEvent(data));
    });

    it('should publish a UserSignedOutEvent', (done) => {
      let data = {email: faker.internet.email()};

      eventAggregator.subscribeOnce(events.UserSignedOutEvent, (eventData) => {
        expect(eventData).toBeDefined();
        expect(eventData).not.toBeNull();
        expect(eventData.uid).toBeNull();
        expect(eventData.email).toBe(data.email);
        done();
      });

      publisher.publish(new events.UserSignedOutEvent(data));
    });

    it('should publish a UserEmailChangedEvent', (done) => {
      let data = {
        oldEmail: faker.internet.email(),
        newEmail: faker.internet.email()
      };

      eventAggregator.subscribeOnce(events.UserEmailChangedEvent, (eventData) => {
        expect(eventData).toBeDefined();
        expect(eventData).not.toBeNull();
        expect(eventData.uid).toBeNull();
        expect(eventData.oldEmail).toBe(data.oldEmail);
        expect(eventData.newEmail).toBe(data.newEmail);
        done();
      });

      publisher.publish(new events.UserEmailChangedEvent(data));
    });

    it('should publish a UserPasswordChangedEvent', (done) => {
      let data = {email: faker.internet.email()};

      eventAggregator.subscribeOnce(events.UserPasswordChangedEvent, (eventData) => {
        expect(eventData).toBeDefined();
        expect(eventData).not.toBeNull();
        expect(eventData.email).toBe(data.email);
        done();
      });

      publisher.publish(new events.UserPasswordChangedEvent(data));
    });

    it('should publish a UserDeletedEvent', (done) => {
      let data = { email: faker.internet.email() };

      eventAggregator.subscribeOnce(events.UserDeletedEvent, (eventData) => {
        expect(eventData).toBeDefined();
        expect(eventData).not.toBeNull();
        expect(eventData.email).toBe(data.email);
        done();
      });

      publisher.publish(new events.UserDeletedEvent(data));
    });

    it('should publish a UserAuthStateChangedEvent with data', (done) => {
      let uid = faker.random.uuid(),
        data = { uid: uid, provider: 'password', auth: {uid:uid, provider:'password'}, expires: 111111 };

      eventAggregator.subscribeOnce(events.UserAuthStateChangedEvent, (eventData) => {
        expect(eventData).toBeDefined();
        expect(eventData).not.toBeNull();
        expect(eventData.uid).toBe(data.uid);
        expect(eventData.provider).toBe(data.provider);
        expect(eventData.auth).toBe(data.auth);
        expect(eventData.expires).toBe(data.expires);
        done();
      });

      publisher.publish(new events.UserAuthStateChangedEvent(data));
    });

    it('should publish a UserAuthStateChangedEvent with no data', (done) => {
      let data = { };

      eventAggregator.subscribeOnce(events.UserAuthStateChangedEvent, (eventData) => {
        expect(eventData).toBeDefined();
        expect(eventData).not.toBeNull();
        expect(eventData.uid).toBeNull();
        expect(eventData.provider).toBeNull();
        expect(eventData.auth).toBeNull();
        expect(eventData.expires).toBe(0);
        done();
      });

      publisher.publish(new events.UserAuthStateChangedEvent(data));
    });

    it('should not publish handled event', (done) => {
      let event = new events.UserCreatedEvent({});
      event.handled = true;
      eventAggregator.subscribeOnce(events.UserCreatedEvent, () => {
        done.fail();
      });
      publisher.publish(event);
      done();
    });
  });
});

function createEventData() {
  return {
    uid: faker.random.uuid(),
    email: faker.internet.email(),
    provider: faker.hacker.noun()
  };
}
