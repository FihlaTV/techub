var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment');

var jobSchema = new Schema({
    title: {type: String, required: true},
    position: {type: String},
    description: {type: String, required: true},
    locality:  {type: String, required: true},
    created_at: {type: Date, default: Date.now()},
    employer: {type: Schema.Types.ObjectId, ref: 'User'},
});

jobSchema
.virtual('url')
.get(function () {
  return '/job/' + this._id;
});

jobSchema
.virtual('created_at_formatted')
.get(function () {
  return moment(this.created_at).format('MMMM Do, YYYY');
});

module.exports = mongoose.model('Job', jobSchema);