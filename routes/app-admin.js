var express = require('express');
var restrict = require('../auth/restrict')
var router = express.Router();
var userService = require('../services/user-services');
var orgService = require('../services/org-services');
var uploadService = require('../services/upload-services');

/* GET home page. */
router.get('/', restrict , function(req, res, next) {
	var vm = {
		title : 'Admin',
		userName : req.user ? req.user.firstName : 'User'
	}
  res.render('Admin', vm);
});

router.post('/signup', restrict , function(req, res, next) {
	console.log(req.body)

	uploadService.uploadFiles(req, res, null , function(uplErr){
			
		if(uplErr){
			res.json({error : "File not Uploaded..!"});	
		}

		userService.addUser(req.body , function(error){
			if(error){
				console.log("Data Not Entered" , error);
				res.status(400);
				return res.send(error);
			}
			console.log("Data Entered Successfully");
	  		return res.send({ OK : "User Entered Successfully" });
		});
	})
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
