var util = require('util');

module.exports.init = function(req, res, next) {
  if (!req.flash) req.flash = flash;
  if(!res.locals.messages) res.locals.messages = {};
  if (!res.flash) res.flash = addLocalFlashMsg;
  next();
}

function flash() {
  if (this.session === undefined)
    throw Error('req.flash(): requires sessions !');
  var messages = this.session.flash = this.session.flash || {};
  if (arguments.length > 1) {
    var arg = arguments[0];
    add(messages, arg, Array.prototype.slice.call(arguments, 1));
  } else if (arguments.length == 1) {
    var arg = arguments[0];
    if (typeof arg == 'string') return pull(messages, arg);
    if (typeof arg == 'object') return addAll(messages, arg);
  } else {
    this.session.flash = {};
    return messages;
  }
}

function add(messages, key, args) {
  if (typeof key != 'string')
    throw Error('req.flash(key, value): key has to be of type string !');
  var message = util.format.apply(undefined, args);
  messages[key] = message;
}

function addAll(messages, values) {
  for (key in values) {
    messages[key] = values[key];
  }
}

function pull(messages, key) {
  var message = messages[key];
  delete messages[key];
  return message;
}

function addLocalFlashMsg() {
  if (arguments.length == 1) {
    if (util.isArray(arguments[0])) {
      for (var index = 0; index < arguments[0].length; ++index)
        this.flash(arguments[0][index]);
    } else if (typeof arguments[0] == 'object') {
      for (key in arguments[0])
        this.locals.messages[key] = arguments[0][key]
    }
  } else if (arguments.length == 2) {
    this.locals.messages[arguments[0]] = arguments[1];
  } else if (arguments.length > 2) {
    for (var index = 0; index < arguments.length; ++index)
      this.flash(arguments[index]);
  }
}
