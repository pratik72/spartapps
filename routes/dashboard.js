var express = require('express');
var passport = require('passport');
var restrict = require('../auth/restrict');
var supplierService = require('../services/supplier-services');
var InvoiceService = require('../services/invoice-services');
var uploadService = require('../services/upload-services');

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
	res.send( req.user );
});

//getSupplier
router.post('/getSupplierDetails', restrict , function(req, res, next) {
	
	supplierService.findSupplier( req.body, function(error , suppData){
		if(error){
			console.log("Supplier Not Retrived" , error);
			return res.json(error);
		}
  		res.json(suppData);
	});
});

//createSupplier
router.post('/createSupplier', restrict , function(req, res, next) {
	var bodyObject = req.body;
	if (bodyObject) {

		uploadService.uploadFiles(req, res, null , function(uplErr){

			if(uplErr){
				res.json({error : "File not Uploaded..!"});	
			}

			bodyObject = req.body;

			for (var i in bodyObject) {
				if(typeof bodyObject[i] == 'string' && bodyObject[i] != "undefined"){
					bodyObject[i] = JSON.parse(bodyObject[i]);
				}
			};

			bodyObject = mergeSupplierUploadData(req.files , bodyObject);
			bodyObject = mergeUserDetailsData(bodyObject , req.user);

			
			supplierService.addSupplier(bodyObject , function(error){
				if(error){
					console.log("Supplier Not Created" , error);
					res.status(400);
					return res.json(error);
				}
				console.log("Data Entered Successfully");
		  		return res.json({ OK : "User Entered Successfully" });
			});
		});

	}else{
		res.json({ error : "Invalid data..!!" });
	}
});


router.post('/getInvoicesDetails', restrict , function(req, res, next) {
	
	InvoiceService.findInvoice( req.body, function(error , invData){
		if(error){
			console.log("Invoice Not Retrived" , error);
			return res.json(error);
		}
  		res.json(invData);
	});
});

router.post('/createInvoice', restrict , function(req, res, next) {
	var bodyObject = req.body;
	//uploadFiles
	if (bodyObject) {

		uploadService.uploadFiles(req, res, null , function(uplErr){
			
			if(uplErr){
				res.json({error : "File not Uploaded..!"});	
			}

			var tmpInvData = mergeInvoiceUploadData(req.files , req.body)

			tmpInvData = mergeUserDetailsData(tmpInvData , req.user);
			
			InvoiceService.addInvoice( tmpInvData , function(error){
				if(error){
					console.log("Invoice Not Created" , error);
					res.status(400);
					return res.json(error);
				}
				console.log("Data Entered Successfully");
		  		return res.json({ OK : "Invoice Created Successfully" });
			});
		});
	}else{
		res.json({ error : "Invalid data..!!" });
	}
});


function mergeInvoiceUploadData(files , tmpObj){
	
	tmpObj.doc_attachment = {};
	tmpObj.doc_attachment.invoice = files[0] ? files[0].filename : "";
	tmpObj.doc_attachment.PO = files[1] ? files[1].filename : "";
	tmpObj.doc_attachment.other_doc = files[2] ? files[2].filename : "";

	var allAttachParam = [ "invoice" , "PO" , "other_doc"];
	for (var k = 0; k < allAttachParam.length; k++) {
		tmpObj.doc_attachment[ allAttachParam[k] ] = "";
		for (var i = 0; i < files.length; i++) {
			if(files[i].fieldname == allAttachParam[k] ){
				tmpObj.doc_attachment[ allAttachParam[k] ] = files[i] ? files[i].filename : "";
			}
		};
	};

	return tmpObj;
}

function mergeSupplierUploadData(files , tmpObj){
	
	tmpObj.doc_attachment = {};
	
	var allAttachParam = [ "statutory_registration_certificates" , "cancelled_cheque" , "quotation" , "agreements" , "vendor_profile" , "other_doc"];

	for (var k = 0; k < allAttachParam.length; k++) {
		tmpObj.doc_attachment[ allAttachParam[k] ] = "";
		for (var i = 0; i < files.length; i++) {
			if(files[i].fieldname == allAttachParam[k] ){
				tmpObj.doc_attachment[ allAttachParam[k] ] = files[i] ? files[i].filename : "";
			}
		};
	};

	return tmpObj;
}

function mergeUserDetailsData( mobjData , user){
	mobjData["user_id"] = user._id;
	mobjData["userName"] = user.firstName + " "+ user.lastName;
	mobjData["orgId"] = user.orgId;
	mobjData["orgName"] = user.organization;

	return mobjData;
}

module.exports = router;