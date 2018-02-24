var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var messageSchema = mongoose.Schema ({
  sender: {type: Schema.Types.ObjectId, required: true, ref: 'User'},
  timeStamp: Date,
  recipient: {type: Schema.Types.ObjectId, required: true, ref: 'User'},
  subject: String,
  body: String,
  isRead: Boolean
});

module.exports = mongoose.model('Message', messageSchema);
