var express = require('express');
var passport = require('passport');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	if (req.user) {
	    return res.redirect('/dashboard');
	}
	var msg = {
		title : 'Login',
		error : req.flash('error')
	};
	res.render('index', msg );
});

router.post('/login',   passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/',
    failureFlash: 'Invalid Username or Password..!'
  }));

module.exports = router;
