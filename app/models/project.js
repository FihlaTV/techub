var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment');

var projectSchema = mongoose.Schema({
    title : String,
    created_at  : {
        type: Date, 
        default: Date.now 
    },
    description : {
	    type: String,
	    default: '' 
    },
    category : {
    	type: Number
    },
    tag : {
    	type: [String]
    },
    completedBy: {
        type: Schema.Types.ObjectId, 
        ref: 'User' 
    },
    employer : {
        type: Schema.Types.ObjectId, 
        ref: 'User' 
    },
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
  return moment(this.created_at).format('MMMM Do, YYYY');
});
module.exports = mongoose.model('Project', projectSchema);
