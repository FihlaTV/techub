var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var notificationSchema = new Schema ({
    userfrom: {type: Schema.Types.ObjectId, required: true, ref: 'User'},
    userto: {type: Schema.Types.ObjectId, required: true, ref: 'User'},
    created_at: {type: Date, default: Date.now()},
    job: {type: Schema.Types.ObjectId, required: true, ref: 'Job'},
});



module.exports = mongoose.model('Notification', notificationSchema);