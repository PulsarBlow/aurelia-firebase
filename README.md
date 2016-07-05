# aurelia-firebase

 [![Circle CI](https://circleci.com/gh/PulsarBlow/aurelia-firebase/tree/master.svg?style=svg)](https://circleci.com/gh/PulsarBlow/aurelia-firebase/tree/master)   [![Join the chat at https://gitter.im/aurelia/discuss](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/aurelia/discuss?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

A Firebase plugin for [Aurelia](http://aurelia.io/) that supports Authentication, Reactive data collections (auto-sync) and other Firebase features. This plugin has been developed from scratch in order to provide an ubiquitous aurelia's experience and a [Promise/A+](https://promisesaplus.com/) support.

This is an early version which comes with :

- A complete firebase password authentication support.
- A reactive collection providing auto-sync with Firebase server.

Roadmap for the next versions :
 
* Full Query support (order, startAt, endAt etc..)
* Priorities
* Transactions
* Third party authentications (Google, FB etc..)

###Demo

[Aurelia on Fire](https://github.com/PulsarBlow/aureliaonfire) is a demo app providing complete working implementation of the plugin features.

Play with the demo : https://aureliaonfire.azurewebsites.net  
Check the demo source : https://github.com/PulsarBlow/aureliaonfire

# Installation


#### Install via JSPM
Go into your project and verify it's already `npm install`'ed and `jspm install`'ed. Now execute following command to install the plugin via JSPM:

```
jspm install aurelia-firebase
```

this will add the plugin into your `jspm_packages` folder as well as an mapping-line into your `config.js` as:

```
"aurelia-firebase": "github:pulsarblow/aurelia-firebase@X.X.X",
```

If you're feeling experimental or cannot wait for the next release, you could also install the latest version by executing:
```
jspm install aurelia-firebase@master
```


#### Migrate from aurelia-app to aurelia-app="main"
You'll need to register the plugin when your aurelia app is bootstrapping. If you have an aurelia app because you cloned a sample, there's a good chance that the app is bootstrapping based on default conventions. In that case, open your **index.html** file and look at the *body* tag.
``` html
<body aurelia-app>
```
Change the *aurelia-app* attribute to *aurelia-app="main"*.
``` html
<body aurelia-app="main">
```
The aurelia framework will now bootstrap the application by looking for your **main.js** file and executing the exported *configure* method. Go ahead and add a new **main.js** file with these contents:

``` javascript
export function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .developmentLogging();

  aurelia.start().then(a => a.setRoot('app', document.body));
}
```

#### Load the plugin
During bootstrapping phase, you can now include the plugin:

``` javascript
export function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .developmentLogging()
    .plugin('aurelia-firebase'); //Add this line to load the plugin

  aurelia.start().then(a => a.setRoot('app', document.body));
}
```

#Configuration
##One config to rule them all
The firebase plugin has one global configuration instance, which is passed to an optional callback function when you first install the plugin:  

``` javascript
export function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .developmentLogging()
    .plugin('aurelia-firebase', (config) => {
      config.setFirebaseUrl('https://myapp.firebaseio.com/');
    });

  aurelia.start().then(a => a.setRoot('app', document.body));
}
```

> Note: if you want to access the global configuration instance at a later point in time, you can inject it:

```javascript
import {Configuration} from 'aurelia-firebase';
import {inject} from 'aurelia-framework';

@inject(Configuration)
export class MyViewModel {
  _config = null;
  constructor(config)
  {
    this._config = config;
    console.log('My Firebase URL %s', this._config.getFirebaseUrl());
  }
}
```

##Possible configuration  

> Note: all these can be chained

``` javascript
(config) => { 
  config
    .setFirebaseUrl('https://myapp.firebaseio.com/')
    .setMonitorAuthChange(true);
}
```

####**setFirebaseUrl(firebaseUrl: string)**
> Sets the Firebase URL where your Firebase data live.
> This is required and the plugin will not start if not provided.

``` javascript
(config) => {
  config.setFirebaseUrl('https://myapp.firebaseio.com/');
}
```
####**setMonitorAuthChange(monitorAuthChange: boolean)**
> When set to `true`, the authentication manager will monitor authentication changes for the current user 
The default value is `false`.
``` javascript
(config) => { config.setMonitorAuthChange(true); }
```

#AuthenticationManager

The authentication manager handles authentication aspects of the plugin.
Currently it is only supporting the password authentication flow but other authentication types are coming soon.

Below is an example implementation of a signin view model from the [AureliaOnFire](https://github.com/PulsarBlow/aureliaonfire) sample app.

``` javascript
import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {AuthenticationManager} from 'aurelia-firebase';

@inject(AuthenticationManager, Router)
export class SignIn {
  email = null;
  password = null;
  message = null;

  constructor(authManager:AuthenticationManager, router:Router) {
    this.authManager = authManager;
    this.router = router;
  }

  signIn() {
    this.message = null;
    this.authManager.signIn(this.email, this.password)
      .then(() => {
        this.router.navigateToRoute('accountIndex');
      })
      .catch((e) => {
        this.message = e.message;
      });
  }
}
```

[AuthenticationManager documentation](doc/authentication-manager.md)
 
#ReactiveCollection

The ReactiveCollection class handles firebase data synchronization.  
To use it you just create a new ReactiveCollection passing its constructor the firebase data location relative to the Firebase Url you provided at the plugin initialization.
``` javascript
// My data location is at http://myapp.firebaseio.com/posts
let myCollection = new ReactiveCollection('posts');

// My data location is at http://myapp.firebaseio.com/users/john/posts
let myCollection = new ReactiveCollection(['users', 'john', 'posts']);
```

Your collection is now synchronized to your firebase data location. Any change happening either side will be synchronized on the other side.

From there you can use your ReactiveCollection :
``` javascript
let myCollection = new ReactiveCollection(['users', 'john', 'posts']),
    post = {
	  subject: 'This is my post subject',
	  content: 'A super coool post content'
    };

myCollection.add(post);
myCollection.remove(post);
```

ReactiveCollection exposes an `items` property which is synchronized with your firebase data.
You can use this property in your views databindings:

```html
<div class="row au-stagger">
  <div class="au-animate" repeat.for="item of collection.items">
    <p>${item.subject}</p>
    <p>${item.content}</p>
  </div>
</div>
```

[ReactiveCollection documentation](doc/reactive-collection.md)

#Events Publisher

Beside monitoring the user authentication state changes internally (with these changes exposed through the `currentUser` property), the AuthManager also triggers application wide events.
It uses the aurelia's `EventAggregator` to do so.

[Events Publisher documentation](doc/events-publisher.md)

# Sample implementation

Check the sample implementation at : https://github.com/PulsarBlow/aureliaonfire
While we work on a better documentation, this is a great place to learn about the plugin features.
