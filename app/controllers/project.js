var Project = require('../models/project.js');
var User = require('../models/user.js');
var Job= require('../models/job.js');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

var async = require('async');



// Display list of all projects.
exports.project_list = function(req, res) {
    Project.find({}, 'title user description created_at_formatted')
    .populate('user')
    .exec(function (err, list_projects) {
      if (err) { return next(err); }
      //Successful, so render
      res.render('projects.ejs', { project_list: list_projects });
    });
},

// Display detail page for a specific projects.
exports.project_detail = function(req, res) {
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
        res.render('project-detail.ejs', { title: 'Title', project:  results.project} );
    });
},

// Display project create form on GET.
exports.project_create_get = function(req, res) {
    res.render('newproject.ejs', {
        user : req.user
    });
},

// Handle project create on POST.
exports.project_create_post = function(req, res) {

    // Validate fields.
    body('title', 'Title must not be empty.').isLength({ min: 1 }).trim(),
    body('description', 'Description must not be empty.').isLength({ min: 1 }).trim(),
    body('user', 'user must not be empty').isLength({ min: 1 }).trim(),
  
    // Sanitize fields (using wildcard).
    sanitizeBody('*').trim().escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {
        
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a project object with escaped and trimmed data.
        var project = new Project({ 
            title: req.body.title,
            created_at: req.body.created_at,
            description: req.body.description,
            category: req.body.category,
            tag: req.body.tag,
            user: req.body.user
           });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.
            async.parallel({
                user: function(callback) {
                    User.find(callback);
                },
            }, function(err, results) {
                if (err) { return next(err); }

                res.render('projects-form.ejs', { title: 'Create Project', user:results.user, project: project, errors: errors.array() });
            });
            return;
        }
        else {
            // Data from form is valid. Save project.
            project.save(function (err) {
                if (err) { return next(err); }
                   //successful - redirect to new project record.
                   res.redirect(project.url);
                });
        }
    }
},


// Handle project delete on POST.
exports.project_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Project delete POST');
},

// Display project update form on GET.
exports.project_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Project update GET');
},

// Handle project update on POST.
exports.project_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Project update POST');
}


