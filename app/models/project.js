var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var projectSchema = mongoose.Schema({
    title : String,
    created_at  : { type: Date, default: Date.now },
    description : { type: String, default: '' },
    category : {type: Number},
    tag : {type: String},
    acceptedBy: { type: String, default: '' },
    user : { type: Schema.Types.ObjectId, ref: 'User' },
});



// Virtual for book's URL
projectSchema
.virtual('url')
.get(function () {
  return '/project/' + this._id;
});

projectSchema
.virtual('created_at_formatted')
.get(function () {
  return moment(this.created_at).format('X');
});
module.exports = mongoose.model('Project', projectSchema);
