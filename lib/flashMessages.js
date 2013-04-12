var util = require('util');

var localsFieldName = 'messages';
var debug = false;
var verbose = false;

module.exports.configure = function(config) {
  if (config == undefined) retun;
  localsFieldName = config.localsFieldName || localsFieldName;
  debug = config.debug || debug;
  verbose = config.verbose || verbose;
}

module.exports.init = function(req, res, next) {
  if (!req.flash) req.flash = flash;
  if(!res.locals[localsFieldName]) res.locals[localsFieldName] = {};
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
  var value = util.format.apply(util.format, args);
  addToMessages(messages, key, value);
}

function addAll(messages, values) {
  for (key in values) {
    addToMessages(messages, key, values[key]);
  }
}

function addToMessages(messages, key, value) {
  messages[key] = value;
  if (verbose) console.log(util.format(
        "Flash message %s: %s added !", key, value));
}

function pull(messages, key) {
  var message = messages[key];
  delete messages[key];
  if (verbose) console.log(util.format(
        "Flash message %s: %s pulled !", key, message));
  return message;
}

function addLocalFlashMsg() {
  if (arguments.length == 1) {
    if (util.isArray(arguments[0])) {
      for (var index = 0; index < arguments[0].length; ++index)
        this.flash(arguments[0][index]);
    } else if (typeof arguments[0] == 'object') {
      for (key in arguments[0])
        addToLocals.call(this, key, arguments[0][key]);
    }
  } else if (arguments.length == 2) {
    addToLocals.call(this, arguments[0], arguments[1]);
  } else if (arguments.length > 2) {
    for (var index = 0; index < arguments.length; ++index)
      this.flash(arguments[index]);
  }
}

function addToLocals(key, value) {
  this.locals[localsFieldName][key] = value;
  if (verbose) console.log(util.format(
        "Flash local message %s: %s added !", key, value));
}

