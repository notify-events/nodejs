const Message = require('./lib/Message');
const InvalidArgumentError = require('./lib/errors/InvalidArgumentError');
const NotifyEventsMessageError = require('./lib/errors/NotifyEventsMessageError');

module.exports = Message;
module.exports.Message = Message;
module.exports.InvalidArgumentError = InvalidArgumentError;
module.exports.NotifyEventsMessageError = NotifyEventsMessageError;
