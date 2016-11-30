var express = require('express');
var restrict = require('../auth/restrict')
var router = express.Router();
var userService = require('../services/user-services');

/* GET home page. */
router.get('/', restrict , function(req, res, next) {
  res.render('Admin', { title: 'Signup' });
});

router.post('/', restrict , function(req, res, next) {
	console.log(req.body)
	userService.addUser(req.body , function(error){
		if(error){
			console.log("Data Not Entered" , error);
			return res.render('Admin', { error : error });
		}
		console.log("Data Entered Successfully");
  		res.render('index', { title: 'Hello Admin' });
	});
});

module.exports = router;
