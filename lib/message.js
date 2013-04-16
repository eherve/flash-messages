var util = require('util');

var Message = module.exports = function() {
  if (arguments.length == 0)
    throw Error('A message should contained at leas a key !');
  if (arguments.length == 1) {
    if (typeof arguments[0] == 'string')
      this.key = arguments[0];
    else if (typeof arguments[0] == 'object' &&
        typeof arguments[0].key == 'string') {
      this.key = arguments[0].key;
      this.value = arguments[0].value;
      this.scope = arguments[0].scope == Message.SESSION_SCOPE ?
        Message.SESSION_SCOPE : Message.REQUEST_SCOPE;
    } else throw Error('Wrong argument type !', typeof arguments[0]);
  } else {
    this.key = arguments[0];
    this.value = arguments[1];
    this.scope = arguments[2] || Message.REQUEST_SCOPE;
    this.scope = arguments[2] == Message.SESSION_SCOPE ?
      Message.SESSION_SCOPE : Message.REQUEST_SCOPE;
  }
}

Message.REQUEST_SCOPE = 'request_scope';
Message.SESSION_SCOPE = 'session_scope';
