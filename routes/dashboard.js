var express = require('express');
var passport = require('passport');
var restrict = require('../auth/restrict');

var router = express.Router();

/* GET home page. */
router.get('/', restrict , function(req, res, next) {
	var msg = {
		title : 'Dashboard',
		userName : req.user ? req.user.firstName : 'User'
	}
  	res.render('dashboard', msg);
});

router.get('/logout',  function(req, res, next) {
	req.logout();
	req.session.destroy();
	res.redirect('/');
});

router.post('/userDetails', restrict , function(req, res, next) {
	console.log(" req.user " ,  req.user)
	res.send( req.user );
});

//createSupplier
router.post('/createSupplier', restrict , function(req, res, next) {
	var bodyObject = req.body;
	console.log("==req.body== " ,  bodyObject )
	res.json(  bodyObject);
});

module.exports = router;