# flash-messages

Flash messages support to use with ExpressJs.

## Install

  npm install flash-messages

## Loading

  var FlashMessages = require('flash-messages');

## Configuration

  FlashMessages.configure(options);

### Options

Configuration is not mandatory but allows to specify if the module should activate the debug and verbose mode as well as the field name in the locals to contain the flash messages. Default configuration is debug: false, verbose: false and fieldName: flash.

#### eg

<pre>
FlashMessages.configure({
  debug: false,
  verbose: false,
  fieldName: messages
});
</pre>

## Initianlisation

The initialisation has to be done after the session activation in express application.

  app.use(FlashMessages.init);

## Usage

The method <i>flash</i> is added to the express request object. this method if no parameter is given, list all the messages present in the flash messages.
<pre>
req.flash();
// return list of messages
</pre>

If a string parameter is given, it retrieves the message with the key equals to the string argument, and if the message has a scope equal to REQUEST_SCOPE then the message is removed from the flash messages.
<pre>
req.flash('error_login');
// return MESSAGE { key: 'error_login', value: ..., scope: ... }
</pre>

If the method is called with one object argument or an array of object as argument, a message or a list of messages are created and stored in the flash messages. These objects have to declare a key, and a value. They can also declare a scope: FlashMessages.REQUEST_SCOPE / FlashMessages.SESSION_SCOPE. By default the REQUEST_SCOPE scope is set and force the message to be pull out of the flash messages if requested. The SESSION_SCOPE scope mode keeps the message in the flash messages until the session is deleted; this message can be updated by adding a new message with the same key to the flash messages.
<pre>
req.flash([
  { key: 'error_login', value: 'Wrong Login/Password' },
  { key: 'username', value: 'test', scope: FlashMessages.SESSION_SCOPE }];
// 2 messages are added to the flash messages, one containing the login error message
// and the other one containing the username used (this username will be keeped until
// the session in deleted, meaning if you refresh, the error login message will not
// exists anymore but the username will)
</pre>

If you pass 2 or 3 arguments then a message will be created with for key the first argument, for value the second one and for scope the third (not mandatory) one.
<pre>
req.flash('username', 'test', FlashMessages.REQUEST_SCOPE);
</pre>

The method <i>flashBody</i> is also added to flash all body data.

## Support

<a href="http://www.it-tweaks.com/" target="_blank">it-tweaks</a>
