var express = require('express');
var path = require('path');
var router = express.Router();


//Default routing
router.get('/*', function (req, res) {
  res.redirect('/');
});

module.exports = router;
