var Project = require('../models/project.js');
var User = require('../models/user.js');
var Job= require('../models/job.js');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
var db = require('mongoose');
var async = require('async');

// Display list of all Users.
exports.user_list = function(req, res) {
     User.find()
    .sort([['name', 'ascending']])
    .exec(function (err, list_users) {
      if (err) { return next(err); }
      //Successful, so render
      res.render('profileinstance.ejs', { title: 'Freelancers List', user_list: list_users });
    });

};


// Display detail page for a specific user.
exports.user_detail = function(req, res, next) {
        async.parallel({
        user: function(callback) {
            User.findById(req.params.id)
              .exec(callback)
        },
        user_projects: function(callback) {
          Project.find({ 'user': req.params.id },'title description created_at')
          .exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); } // Error in API usage.
        if (results.user==null) { // No results.
            var err = new Error('User not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.render('user-detail.ejs', { title: 'User Detail', user: results.user, user_projects: results.user_projects } );
    });
};
    
// Display user update form on GET.
exports.user_update_get = function(req, res) {
   if(req.params.id === req.user.id) {
         res.render('profile-update.ejs', {
        user : req.user
    });
   } else {
    res.send('not acces to the page');
   }
};

// Handle user update on POST.
exports.user_update_post = (req, res) => {
  if(req.params.id === req.user.id) {
      User.update(User._id,  req.body, function(err, result) {
        if (err) {
            console.log('Error updating user: ' + err);
            return res.redirect('/user-update/' + req.params.id);
        }
        console.log('' + result + ' document(s) updated');
        res.redirect('/user-profile/' + req.params.id);
    });
  } else {
    res.send('not access to the page');
  }
};

     

