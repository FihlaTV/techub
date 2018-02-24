var express = require('express');
var fs = require('fs');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require('../models/user.js');

var imgPath = '/path/yourimage.png';

mongoose.connection.on('open', function () {
  console.error('mongo is open');

  User.remove(function (err) {
    if (err) throw err;

    console.error('removed old docs');

    User.img.data = fs.readFileSync(imgPath);
    Uer.img.contentType = 'image/png';
    User.save();

  });

});