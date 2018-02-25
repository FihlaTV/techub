var Project = require('../models/project.js');
var User = require('../models/user.js');
var Job= require('../models/job.js');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

var async = require('async');



// Display list of all projects.
exports.project_list = function(req, res, next) {
    Project.find({}, 'title user description created_at_formatted')
    .populate('user')
    .exec(function (err, list_projects) {
      if (err) { return next(err); }
      //Successful, so render
      res.render('projects.ejs', { project_list: list_projects, user: req.user});
    });
}

// Display detail page for a specific projects.
exports.project_detail = function(req, res, next) {
     async.parallel({
        project: function(callback) {

            Project.findById(req.params.id)
              .populate('user')
              .exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.project==null) { // No results.
            var err = new Error('Project not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.render('project-detail.ejs', { title: 'Title', project:  results.project, user: req.user} );
    });
}

// Display project create form on GET.
exports.project_create_get = function(req, res) {
    res.render('newproject.ejs', {
        user : req.user
    });
}

// Handle project create on POST.
exports.project_create_post = (req, res, next) => {
        
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Book object with escaped and trimmed data.
        var project = new Project(
          { title: req.body.title,
            description: req.body.description,
            category: req.body.category,
            tag: req.body.tag,
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

                res.render('newproject.ejs', { title: 'Create Project', user:results.user, project: project, errors: errors.array() });
            });
            return;
        }
        else {
            // Data from form is valid. Save book.
            project.save(function (err) {
                if (err) { return next(err); }
                   //successful - redirect to new book record.
                   res.redirect(project.url);
                });
        }
    }


// Handle project delete on POST.
exports.project_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Project delete POST');
}

// Display project update form on GET.
exports.project_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Project update GET');
}

// Handle project update on POST.
exports.project_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Project update POST');
}


