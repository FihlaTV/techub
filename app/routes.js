var express  = require('express');
var app      = express();
var router = express.Router();
var passport = require('passport');
var path = require('path');
var bodyParser = require('body-parser');
var User = require('./models/user.js')
var mongoose = require("mongoose");
var LocalStrategy = require('passport-local').Strategy;
var expressValidator = require('express-validator');
router.use(expressValidator())

var project_controller = require('./controllers/project');
var user_controller = require('./controllers/user');
var job_controller = require('./controllers/job');

router.get('/', function(req, res) {
    
        if (req.user) {
          res.redirect('/dashboard');
        } else {
           res.render('index.ejs');
        }
});

router.get('/dashboard', isLoggedIn, function(req, res) {
    res.render('dashboard.ejs', {
        user : req.user
    });
});


// PROFILE SECTION =========================
router.get('/user-profile/:id', isLoggedIn, function(req, res) {
    if (req.params.id === req.user.id) {
        res.render('user-profile.ejs', {
          user : req.user,
        });
    } else {
        res.send('not access to this page')
    }

});


router.get('/setting', isLoggedIn, function(req, res) {
    res.render('setting.ejs', {
        user : req.user
    });
});


// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

// locally --------------------------------
// LOGIN ===============================
// show the login form
// Login
router.get('/login', function(req, res){

        res.render('login.ejs', { message: req.flash('loginMessage'), success_msg: req.flash('success_msg') });

    
});

router.get('/signup', function(req, res) {

        res.render('signup.ejs', { message: req.flash('signupMessage') });
    
});

// Register User
router.post('/signup', function(req, res){
    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var roleRadio = req.body.roleRadio;


    // Validation
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();

    var errors = req.validationErrors();

    // if(errors){
    //     res.redirect('/signup');
    // } else {
    //     var newUser = new User({
    //         name: name,
    //         email:email,
    //         username: username,
    //         password: password
    //     });

    //     User.createUser(newUser, function(err, user){
    //         if(err) throw err;
    //         console.log(user);
    //     });

    //     req.flash('success_msg', 'You are registered and can now login');

    //     res.redirect('/dashboard');
    // }
    if (!req.user) {
                User.findOne({ 'username' :  username }, function(err, user) {
                    // if there are any errors, return the error
                    
                    if (errors)
                        res.redirect('/signup');

                    // check to see if theres already a user with that email
                    if (user) {
                        res.send('That username is already taken.');
                    } else {

                            var newUser = new User({
                                name: name,
                                email:email,
                                username: username,
                                password: password,
                                role: roleRadio
                            });

                            User.createUser(newUser, function(err, user){
                                if(err) throw err;
                                console.log(user);
                            });

                            req.flash('success_msg', 'You are registered and can now login');

                            res.redirect('/login');
                    }

                });
            // if the user is logged in but has no local account...
            } else {
                return req.user;
            }

});




passport.use(new LocalStrategy(
  function(username, password, done) {
   User.getUserByUsername(username, function(err, user){
    if(err) throw err;
    if(!user){
        return done(null, false, {message: 'Unknown User'});
    }

    User.comparePassword(password, user.password, function(err, isMatch){
        if(err) throw err;
        if(isMatch){
            return done(null, user);
        } else {
            return done(null, false, {message: 'Invalid password'});
        }
    });
   });
  }));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

router.post('/login',
  passport.authenticate('local', {successRedirect:'/dashboard', failureRedirect:'/login',failureFlash: true}),
  function(req, res) {
    res.redirect('/dashboard');
  });

router.get('/logout', function(req, res){
    req.logout();

    req.flash('success_msg', 'You are logged out');

    res.redirect('/login');
});

/// FREELANCERS ROUTES ///

// GET request to update user.
router.get('/user-update/:id', isLoggedIn, user_controller.user_update_get);

// POST request to update user.
router.post('/user-update/:id',  user_controller.user_update_post);

// GET request for one user.
router.get('/user/:id', isLoggedIn, user_controller.user_detail);

// GET request for list of all freelancers.
router.get('/freelancers', isLoggedIn, user_controller.user_list);

router.get('/todo?', isLoggedIn, user_controller.user_todo);

router.get('/jobstatus?', isLoggedIn, user_controller.user_jobstatus)

/// PROJECTS ROUTES ///

// GET request for creating a Project. NOTE This must come before routes that display Project (uses id).
router.get('/project/create', isLoggedIn, project_controller.project_create_get);

// POST request for creating Project.
router.post('/project/create',  project_controller.project_create_post);

// POST request to delete Project.
router.post('/project/:id/delete', project_controller.project_delete_post);

// GET request for one Project.
router.get('/project/:id', isLoggedIn, project_controller.project_detail);

// GET request for list of all Projects.
router.get('/projects', isLoggedIn, project_controller.project_list);


/// JOBS ROUTES ///

// GET request for creating a job. NOTE This must come before routes that display job (uses id).
router.get('/job/create', isLoggedIn, job_controller.job_create_get);

// POST request for creating Job.
router.post('/job/create',  job_controller.job_create_post);

// POST request to delete Job.
router.post('/job/:id/delete', job_controller.job_delete_post);

// GET request for one Job.
router.get('/job/:id', isLoggedIn, job_controller.job_detail);

// GET request for list of all jobs.
router.get('/jobs', isLoggedIn, job_controller.job_list);

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}

module.exports = router;
