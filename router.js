var express = require('express');
var path = require('path');
var router = express.Router();
<<<<<<< HEAD

=======
var config = require('./config');
>>>>>>> f35e748b086196e0ee05ef82dc7b4e91ec3e854c

//Default routing
router.get('/*', function (req, res) {
  res.redirect('/');
});

module.exports = router;
