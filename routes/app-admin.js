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
		userName : req.user ? req.user : 'User'
	}
  res.render('admin', vm);
});

router.post('/signup', restrict , function(req, res, next) {

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
	uploadService.uploadFiles(req, res, null , function(uplErr){
			
		if(uplErr){
			res.json({error : "File not Uploaded..!"});	
		}
		
		orgService.addOrganization(req.body , function(error){
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

//Get All Organization
router.post('/getAllOrgList', restrict , function(req, res, next) {
	var allOrg = { _id : req.user.orgId };
	orgService.findOrgs( allOrg, function(error , orgs){
		if(error){
			console.log("Data Not Retrived" , error);
			return res.render('Admin', { error : error });
		}
  		res.send(orgs);
	});
});


//Get All Users
router.post('/getAllUserList', restrict , function(req, res, next) {
	var allUsers = { orgId : req.user.orgId };
	userService.findAllUsers( allUsers, function(error , result){
		if(error){
			console.log("Data Not Retrived" , error);
			return res.render('Admin', { error : error });
		}
  		res.json(result);
	});
});

module.exports = router;