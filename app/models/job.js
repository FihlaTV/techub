var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var jobSchema = new Schema({
    title: {type: String, required: true},
    position: {type: String},
    description: {type: String, required: true},
    locality:  {type: String, required: true},
    created_at: {type: Date, default: Date.now()},
    employer: {type: Schema.Types.ObjectId, required: true, ref: 'User'},
});

jobSchema
.virtual('url')
.get(function () {
  return '/job/' + this._id;
});

module.exports = mongoose.model('Job', jobSchema);