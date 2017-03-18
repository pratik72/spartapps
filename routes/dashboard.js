var express = require('express');
var passport = require('passport');
var ObjectId = require('mongoose').Types.ObjectId;
var restrict = require('../auth/restrict');
var supplierService = require('../services/supplier-services');
var poService = require('../services/po-services');
var InvoiceService = require('../services/invoice-services');
var userService = require('../services/user-services');
var uploadService = require('../services/upload-services');
var notify = require('../controls/notify-user');

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


router.post('/distUserDetails', restrict , function(req, res, next) {
	var serach = { orgId : req.user.orgId }
	userService.findAllUsers( serach, function(error , result){
		if(error){
			console.log("User Not Retrived" , error);
			return res.json(error);
		}
  		res.json(result);
	});
});


router.post('/statusChanges' , restrict , function(req, res, next){
	
	uploadService.uploadFiles(req, res, null , function(uplErr){

		if(uplErr){
			res.json({error : "File not Uploaded..!"});	
		}

		changeActionStatus(req , res , function(msg){
			res.json(msg)
		});
	});
});

//getSupplier
router.post('/getSupplierDetails', restrict , function(req, res, next) {
	
	var userOrgId = req.user.orgId;
	supplierService.findSupplier( { orgId : new ObjectId(userOrgId) }, function(error , suppData){
		if(error){
			console.log("Supplier Not Retrived" , error);
			return res.json(error);
		}
  		res.json(suppData);
	});
});

//getAllPOs
router.post('/getAllPOs', restrict , function(req, res, next) {
	
	var userOrgId = req.user.orgId;
	poService.findPO( { orgId : new ObjectId(userOrgId) , "po_status.status" : "Accept" }, function(error , poData){
		if(error){
			console.log("PO Not Retrived" , error);
			return res.json(error);
		}
  		res.json(poData);
	});
});

//getPOdetList
router.post('/getPOdetList', restrict , function(req, res, next) {
	
	var userOrgId = req.user.orgId;
	poService.findPO( { orgId : new ObjectId(userOrgId) }, function(error , suppData){
		if(error){
			console.log("PO Not Retrived" , error);
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

			bodyObject = mergeSupplierUploadStatusData(req.files , bodyObject , "supplier");
			bodyObject = mergeUserDetailsData(bodyObject , req.user);

			supplierService.addSupplier(bodyObject , function(error , result){
				if(error){
					console.log("Supplier Not Created" , error);
					res.status(400);
					return res.json(error);
				}

				//console.log("Data Entered Successfully" , result);
				notify.notifyUser( "supplier" , result , function(error , nots_data){

					if(error){
						return res.json( { error : "Notification Not added "+error});
					}
		  			return res.json({ OK : "User Entered Successfully" });
				});
			});
		});

	}else{
		res.json({ error : "Invalid data..!!" });
	}
});


//createPO
router.post('/createPO', restrict , function(req, res, next) {
	var bodyObject = req.body;
	if (bodyObject) {

		uploadService.uploadFiles(req, res, null , function(uplErr){

			if(uplErr){
				res.json({error : "File not Uploaded..!"});	
			}

			bodyObject = req.body;

			bodyObject = mergeSupplierUploadStatusData(req.files , bodyObject , 'po');
			bodyObject = mergeUserDetailsData(bodyObject , req.user);

			poService.addPO(bodyObject , function(error , result){
				if(error){
					console.log("PO Not Created" , error);
					res.status(400);
					return res.json(error);
				}

				notify.notifyUser( "purchaseOrd" , result , function(error , nots_data){
					if(error){
						return res.json( { error : "Notification Not added for PO"+error});
					}
		  			return res.json({ OK : "PO Created And Notice Done" });
				});
			});
		});

	}else{
		res.json({ error : "Invalid data..!!" });
	}
});


router.post('/notifictionDetails', restrict , function(req, res, next) {
	
	var userOrgId = req.user.orgId;
	var userId = req.user._id;
	var searchQuery = { 
		orgId : new ObjectId(userOrgId),
		sendTo : new ObjectId(userId),
		isViewed : false
	}
	notify.getNotifications( searchQuery , function(error , notifData){
		if(error){
			console.log("Notification Not Retrived" , error);
			return res.json(error);
		}
  		res.json(notifData);
	});
});

router.post('/markNotificationAsViewed', restrict , function(req, res, next) {

	uploadService.uploadFiles(req, res, null , function(uplErr){
		if(uplErr){
			res.json({error : "File not Uploaded..!"});	
		}

		var uniqID = req.body.primKey;
		var searchQuery = {
			_id : new ObjectId(uniqID),
		}

		var setValue = { 
			isViewed : true,
			viewDate : new Date()
		};
		notify.setNotificationsViewed( searchQuery , setValue , function(error , nData){
			if(error){
				console.log("Notification Not Retrived" , error);
				return res.json(error);
			}
	  		res.json(nData);
		});
		
	});
});


router.post('/getInvoicesDetails', restrict , function(req, res, next) {
	
	var userOrgId = req.user.orgId;
	InvoiceService.findInvoice( { orgId : new ObjectId(userOrgId) }, function(error , invData){
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

			var tmpInvData = mergeInvoiceUploadData(req.files , req.body);
			tmpInvData = mergeUserDetailsData(tmpInvData , req.user);
			
			//return res.json(tmpInvData);
			InvoiceService.addInvoice( tmpInvData , function(error , result){
				if(error){
					console.log("Invoice Not Created" , error);
					res.status(400);
					return res.json(error);
				}

				poService.findPO( { _id : new ObjectId(result.PO_id) }, function(error , jPoData){
					if(error){
						console.log("PO Not Retrived And Invoice Notice Fail" , error);
						return res.json(error);
					}
					
					result["vendor_selection"] = new Object();
					result["vendor_selection"]["selected_by"] = "";
					result["vendor_selection"]["selected_by"] = jPoData[0].vendor_selection.selected_by;
					notify.notifyUser( "invoice" , result , function(error , nots_data){
						if(error){
							return res.json( { error : "Notification Not added for invoice"+error});
						}
			  			return res.json({ OK : "Invoice Created And Notice Done" });
					});
				});

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

	tmpObj["iv_status"] = JSON.parse( tmpObj["iv_status"] );
	tmpObj["iv_status"].status = "pending";

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

function mergeSupplierUploadStatusData(files , tmpObj , comeFrom){
	for (var i in tmpObj) {
		if(typeof tmpObj[i] == 'string' && tmpObj[i] != "undefined" && tmpObj[i] != ""){
			try{
				tmpObj[i] = JSON.parse(tmpObj[i]) || tmpObj[i];
			}catch(e){
				tmpObj[i] = tmpObj[i];
			}
		}
	};

	if(comeFrom == "po"){
		tmpObj["po_status"].status = "pending";
	}else{
		tmpObj["sa_status"].status = "pending";
	}
	tmpObj.doc_attachment = {};
	
	var allAttachParam = [ "statutory_registration_certificates" , "cancelled_cheque" , "quotation" , "agreements" , "vendor_profile" , "other_doc"];

	for (var k = 0; k < allAttachParam.length; k++) {
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

function changeActionStatus(req , res , callback){
	var query = req.query.action && req.query.action.toLowerCase();
	if(!req.query.action ){
		return callback({error : "Action required..!"})
	}else if(req.query.action == 'supplier'){
		var rowId = req.body.rowId;
		rowId = rowId ? new ObjectId(rowId) : {};

		var rowQuery = { _id : rowId };
		delete req.body.rowId;
		var rowData = req.body && req.body.status;
		if (!rowData) return callback({error : "Bad data structure..!"});
		rowData = {
			sa_status : JSON.parse( rowData )
		};

		supplierService.updateSupplier(rowQuery , rowData , function(error , data){
			if(error){
				return callback({error : error});
			}
			return callback({ ok : data})
		});
	}else if(req.query.action == 'invoice'){
		var rowId = req.body.rowId;
		rowId = rowId ? new ObjectId(rowId) : {};

		var rowQuery = { _id : rowId };
		delete req.body.rowId;
		var rowData = req.body && req.body.status;
		if (!rowData) return callback({error : "Bad data structure..!"});
		rowData = {
			iv_status : JSON.parse( rowData )
		};

		InvoiceService.updateInvoice(rowQuery , rowData , function(error , data){
			if(error){
				return callback({error : error});
			}
			return callback({ ok : data})
		});
	}else if(req.query.action == 'purchaseOrd'){
		var rowId = req.body.rowId;
		rowId = rowId ? new ObjectId(rowId) : {};

		var rowQuery = { _id : rowId };
		delete req.body.rowId;
		var rowData = req.body && req.body.status;
		if (!rowData) return callback({error : "Bad data structure..!"});
		rowData = {
			po_status : JSON.parse( rowData )
		};

		poService.updatePO(rowQuery , rowData , function(error , data){
			if(error){
				return callback({error : error});
			}
			return callback({ ok : data})
		});
	}else{
		return callback({error : "Wrong action...!"})
	}

}

module.exports = router;