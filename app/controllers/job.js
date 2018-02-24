var Project = require('../models/project.js');
var User = require('../models/user.js');
var Job= require('../models/job.js');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

var async = require('async');

exports.list = function(req, res){
	Job.find(function(err, result) {
		res.render('job_list.ejs',{locals: {title:'result',jobs:result}});
	});
};

exports.detail = function(req, res){
	Job.findById(new ObjectID(req.params.id), function(err, result) {
		res.render('job_detail.ejs',{ title:'Job Details', job:result });
	});
};

exports.new_job = function(req, res) {
	res.render('new_job_form.ejs', { locals: { title: 'New Job' } });
};

exports.create = function(req, res, next){

	var job = new Job({
		title: req.body.title,
		locality: req.body.locality,
		position: req.body.position,
		description: req.body.description,
		employer: req.body.employer,
	});
	
	job.save(function (err, job){
		if (err) {
			console.log('error');
		}
		else console.log('saved!');
	});
	res.send('Job creation success');
};