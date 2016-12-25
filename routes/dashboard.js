var express = require('express');
var passport = require('passport');
var restrict = require('../auth/restrict');
var supplierService = require('../services/supplier-services');
var InvoiceService = require('../services/invoice-services');

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

//getSupplier
router.post('/getSupplierDetails', restrict , function(req, res, next) {
	console.log(" getSupplierDetails " ,  req.body);
	
	supplierService.findSupplier( req.body, function(error , suppData){
		if(error){
			console.log("Supplier Not Retrived" , error);
			return res.json(error);
		}
		console.log("suppData" , suppData);
  		res.json(suppData);
	});
});

//createSupplier
router.post('/createSupplier', restrict , function(req, res, next) {
	var bodyObject = req.body;
	if (bodyObject) {
		for (var i in bodyObject) {
			bodyObject[i] = JSON.parse(bodyObject[i])
		};
		bodyObject["createdBy"] = req.user._id;
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


router.post('/getInvoicesDetails', restrict , function(req, res, next) {
	console.log(" getInvoicesDetails " ,  req.body);
	
	InvoiceService.findInvoice( req.body, function(error , invData){
		if(error){
			console.log("Invoice Not Retrived" , error);
			return res.json(error);
		}
		console.log("suppData" , invData);
  		res.json(invData);
	});
});

router.post('/createInvoice', restrict , function(req, res, next) {
	var bodyObject = req.body;
	if (bodyObject) {
		for (var i in bodyObject) {
			bodyObject[i] = JSON.parse(bodyObject[i])
		};

		bodyObject["createdBy"] = req.user._id;

		InvoiceService.addInvoice(bodyObject , function(error){
			if(error){
				console.log("Invoice Not Created" , error);
				res.status(400);
				return res.json(error);
			}
			console.log("Data Entered Successfully");
	  		return res.json({ OK : "Invoice Created Successfully" });
		});
	}else{
		res.json({ error : "Invalid data..!!" });
	}
});

module.exports = router;