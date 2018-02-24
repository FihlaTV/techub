// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
let validator = require('validator');

var moment = require('moment');

// define the schema for our user model
var userSchema = mongoose.Schema({

    username: {
        type: String,
        index: true
    },
    password: {
        type: String
    },
    email: {
        type: String
    },
    name: {
        type: String
    },
    role: Number,
    joinedOn: {
        type: Date,
        default: Date.now()
    },
    profile_pic: {
         data: Buffer,
         contentType: String 
    },
    bio: {
        type: String,
        default: ''
    },
    skills: {
        type: [],
    },
    projects: {
        type: [],
    },
    location: {
        type: String,
        default: ''
    },
    date_of_birth: {
        type: String,
    },
    // lastVisited: {
    //     type: Date
    // },
    // visited: {
    //     type: Date,
    //     default: Date.now()
    // }

});

userSchema
.virtual('url')
.get(function () {
  return '/user/' + this._id;
});

userSchema
.virtual('joinedOn_formatted')
.get(function () {
  return moment(this.joinedOn).format('MMMM Do, YYYY');
});

userSchema
.virtual('date_of_birth_formatted')
.get(function () {
  return moment(this.date_of_birth).format('MMMM, YYYY');
});
var User = module.exports = mongoose.model('User', userSchema);

module.exports.createUser = function(newUser, callback){
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, null, function(err, hash) {
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}


module.exports.getUserByUsername = function(username, callback){
    var query = {username: username};
    User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback){
    User.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
        if(err) throw err;
        callback(null, isMatch);
    });
}


