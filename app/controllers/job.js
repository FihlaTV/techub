var Project = require('../models/project.js');
var User = require('../models/user.js');
var Job= require('../models/job.js');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
var async = require('async');

exports.job_list = function(req, res, next){
	Job.find({}, 'title employer description position locality created_at_formatted')
    .populate('user')
    .exec(function (err, list_jobs) {
      if (err) { return next(err); }
      //Successful, so render
      res.render('jobs.ejs', { job_list: list_jobs, user: req.user});
    });
};

exports.job_detail = function(req, res, next){
	async.parallel({
        job: function(callback) {

            Job.findById(req.params.id)
              .populate('user')
              .exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.job==null) { // No results.
            var err = new Error('Job not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.render('job-detail.ejs', { title: 'Job detail', job: results.job, user: req.user} );
    });
};

exports.job_create_get = function(req, res) {
	res.render('newjob.ejs', { title: 'New Job', user: req.user  });
};

exports.job_create_post = (req, res, next) => {
        
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Book object with escaped and trimmed data.
        var job = new Job(
          { title: req.body.title,
            position: req.body.position,
            description: req.body.description,
            locality: req.body.locality,
           });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.

            // Get all authors and genres for form.
            async.parallel({
                user: function(callback) {
                    User.find(callback);
                },
            }, function(err, results) {
                if (err) { return next(err); }

                res.render('newjob.ejs', { title: 'Create Job', user:results.user, job : job, errors: errors.array() });
            });
            return;
        }
        else {
            // Data from form is valid. Save book.
            job.save(function (err) {
                if (err) { return next(err); }
                   //successful - redirect to new book record.
                   res.redirect(job.url);
                });
        }
    }


// Handle job delete on POST.
exports.job_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Project delete POST');
},

// Display job update form on GET.
exports.job_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Project update GET');
},

// Handle job update on POST.
exports.job_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Project update POST');
}

