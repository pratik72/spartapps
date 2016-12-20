var express = require('express');
var passport = require('passport');
var restrict = require('../auth/restrict');
var supplierService = require('../services/supplier-services');

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
	if (bodyObject) {
		for (var i in bodyObject) {
			bodyObject[i] = JSON.parse(bodyObject[i])
		};
		supplierService.addSupplier(bodyObject , function(error){
			if(error){
				console.log("Supplier Not Created" , error);
				res.status(400);
				return res.json(error);
			}
			console.log("Data Entered Successfully");
	  		return res.json({ OK : "User Entered Successfully" });
		});
	}else{
		res.json({ error : "Invalid data..!!" });
	}
});

module.exports = router;