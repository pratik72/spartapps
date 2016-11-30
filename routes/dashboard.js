var express = require('express');
var passport = require('passport');
var restrict = require('../auth/restrict');

var router = express.Router();

/* GET home page. */
router.get('/', restrict , function(req, res, next) {
  res.render('dashboard', { title: 'Dashboard' });
});

module.exports = router;