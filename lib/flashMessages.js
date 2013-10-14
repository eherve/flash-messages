var util = require('util')
  , Message = require('./message');

var debug = false;
var verbose = false;
var fieldName = 'flash';

module.exports.REQUEST_SCOPE = Message.REQUEST_SCOPE;
module.exports.SESSION_SCOPE = Message.SESSION_SCOPE;

module.exports.configure = function(config) {
  config = config || {};
  debug = config.debug || debug;
  verbose = config.verbose || verbose;
  fieldName = config.fieldName || fieldName;
}

module.exports.init = function(req, res, next) {
  if (!req.flash) req.flash = flashReq;
  if (!req.flashBody) req.flashBody = flashBody;
  flashToLocals(req, res);
  next();
}

function flashReq() {
  if (this.session === undefined)
    throw Error('req.flash(): requires sessions !');
  var flash = this.session.flash = this.session.flash || [];
  if (arguments.length == 0) return flash;
  if (arguments.length == 1) {
    arg = arguments[0];
    if (typeof arg == 'string') return pull(flash, arg);
    if (util.isArray(arg)) {
      for (var index = 0; index < arg.length; ++index) {
        addToFlash(flash, buildMessage(arg[index]));
      }
    } else addToFlash(flash, buildMessage(arg));
  } else if (arguments.length > 1) {
    addToFlash(flash, buildMessage(arguments[0], arguments[1], arguments[2]));
  }
}

function buildMessage() {
  try {
    if (arguments.length == 1)
      return new Message(arguments[0]);
    if (arguments.length == 3)
      return new Message(arguments[0], arguments[1], arguments[2]);
  } catch(ex) { console.error("Build Flash Message Error:", ex.message); }
  return undefined;
}

function addToFlash(flash, message) {
  if (message == undefined) return;
  if (verbose) console.log("Add flash:", message);
  for (var index = 0; index < flash.length; ++index) {
    if (flash[index] && flash[index].key == message.key) {
      if (message.value != undefined) flash[index] = message;
      else flash.splice(index, 1);
      return;
    }
  }
  flash.push(message);
}

function pull(flash, key) {
  var message;
  var index = 0;
  while (index < flash.length) {
    if (flash[index] && flash[index].key == key) {
      message = flash[index];
      break;
    }
    ++index;
  }
  removeMessage(flash, message, index);
  return message;
}

function removeMessage(flash, message, index) {
  if (message) {
    if (verbose) console.log("Pull flash:", message);
    if (message.scope == Message.REQUEST_SCOPE) {
      flash.splice(index, 1);
      return true;
    }
  }
  return false;
}

function flashToLocals(req, res) {
  res.locals[fieldName] = res.locals[fieldName] || {};
  var flash = req.flash();
  var index = 0;
  while (index < flash.length) {
    var message = flash[index];
    if (!removeMessage(flash, message, index)) ++index;
    addToLocals(res, message.key, message.value);
  }
}

function addToLocals(res, key, value) {
  res.locals[fieldName][key] = value;
  if (verbose) console.log(util.format(
        "Flash local message [%s]: \"%s\" added !", key, value));
}

function flashBody() {
  if (this.body == null) return;
  var messages = [];
  for (var key in this.body) {
    messages.push({ key: key, value: this.body[key]});
  }
  this.flash(messages);
}

