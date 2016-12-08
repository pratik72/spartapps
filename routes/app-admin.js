var express = require('express');
var restrict = require('../auth/restrict')
var router = express.Router();
var userService = require('../services/user-services');
var orgService = require('../services/org-services');

/* GET home page. */
router.get('/', restrict , function(req, res, next) {
  res.render('Admin', { title: 'Admin Portal' });
});

router.post('/signup', restrict , function(req, res, next) {
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

//orgcreate
router.post('/orgcreate', restrict , function(req, res, next) {
	console.log(req.body)
	orgService.addOrganization(req.body , function(error){
		if(error){
			console.log("Data Not Entered" , error);
			return res.render('Admin', { error : error });
		}
		console.log("Data Entered Successfully");
  		res.redirect('/');
	});
});

//Get All Organization
router.post('/getAllOrgList', restrict , function(req, res, next) {
	var allOrg = {};
	orgService.findOrgs( allOrg, function(error , orgs){
		if(error){
			console.log("Data Not Retrived" , error);
			return res.render('Admin', { error : error });
		}
		console.log("orgs" , orgs);
  		res.send(orgs);
	});
});

module.exports = router;