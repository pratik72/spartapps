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
	var tmpNotifyType = 3;
	uploadService.uploadFiles(req, res, null , function(uplErr){

		var currUser = req.user;

		if(uplErr){
			res.json({error : "File not Uploaded..!"});	
		}

		changeActionStatus(req , res , function(msg){
			var actQuery = req.query.action && req.query.action;

			if(msg.ok){
				var tmpNotifyObj = {
					tabs : actQuery ,
					data : msg.ok , 
					notifyType : tmpNotifyType,
					userData : currUser
				}
				notify.notifyUser( tmpNotifyObj, function(error , nots_data){
					if(error){
						return res.json( { error : "Notification Not added for status change. "+error});
					}
		  			return res.json(msg)
				});
			}else{
				return res.json(msg)
			}
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

//searchInAllTab
router.post('/searchInAllTab', restrict , function(req, res, next) {
	

	uploadService.uploadFiles(req, res, null , function(uplErr){

			if(uplErr){
				res.json({error : "File not Uploaded..!"});	
			}

		var userOrgId = req.user.orgId;

		var searchString = req.body.searchText;
		var searchModel = req.body.searchModel;

		var searchQuery = { 
			orgId : new ObjectId(userOrgId),
		}

		searchQuery[ searchModel ] = searchString

		InvoiceService.findInvoice( searchQuery, function(error , suppData){
			if(error){
				console.log("PO Not Retrived" , error);
				return res.json(error);
			}
	  		res.json(suppData);
		});
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

			var tmpNotifyType = 1;
			var currUser = req.user;
			
			if(req.query && req.query.action == 1){
				var rowId = req.body._id;
				rowId = rowId ? new ObjectId(rowId) : {};

				var rowQuery = { _id : rowId };
				var rowData = bodyObject;
				tmpNotifyType = 2;

				if (!rowData) return callback({error : "Bad data structure..!"});

				supplierService.updateSupplier(rowQuery , rowData , function(error , data){
					if(error){
						console.log("Supplier Not Updated" , error);
						res.status(400);
						return res.json(error);
					}

					var searchQuery = {
						refKey : new ObjectId(data._id),
						isViewed : false
					}

					var setValue = { 
						isViewed : true,
						description : "Auto marked due to record Updated",
						viewDate : new Date()
					};
					notify.setNotificationsViewed( searchQuery , setValue , function(error , nData){
						if(error){
							console.log("Notification Not Mark as view" , error);
						}

						var tmpNotifyObj = {
							tabs : "supplier",
							data : data , 
							notifyType : tmpNotifyType,
							userData : currUser
						}

						notify.notifyUser( tmpNotifyObj , function(error , nots_data){
							if(error){
								return res.json( { error : "Notification Not added "+error});
							}
				  			return res.json({ OK : "Supplier Updated Successfully" });
						});
					});
				});
			}else{
				supplierService.addSupplier(bodyObject , function(error , result){
					if(error){
						console.log("Supplier Not Created" , error);
						res.status(400);
						return res.json(error);
					}

					var tmpNotifyObj = {
						tabs : "supplier",
						data : result , 
						notifyType : tmpNotifyType,
						userData : currUser
					}

					notify.notifyUser( tmpNotifyObj , function(error , nots_data){

						if(error){
							return res.json( { error : "Notification Not added "+error});
						}
			  			return res.json({ OK : "Supplier Created Successfully" });
					});
				});
			}
		});

	}else{
		res.json({ error : "Invalid data..!!" });
	}
});


//createPO
router.post('/createPO', restrict , function(req, res, next) {
	var bodyObject = req.body;
	var tmpNotifyType = 1;
	if (bodyObject) {

		uploadService.uploadFiles(req, res, null , function(uplErr){

			if(uplErr){
				res.json({error : "File not Uploaded..!"});	
			}

			bodyObject = req.body;

			bodyObject = mergeSupplierUploadStatusData(req.files , bodyObject , 'po');
			bodyObject = mergeUserDetailsData(bodyObject , req.user);


			var currUser = req.user;

			poService.addPO(bodyObject , function(error , result){
				if(error){
					console.log("PO Not Created" , error);
					res.status(400);
					return res.json(error);
				}

				var tmpNotifyObj = {
					tabs : "purchaseOrd",
					data : result , 
					notifyType : tmpNotifyType,
					userData : currUser
				}

				notify.notifyUser( tmpNotifyObj , function(error , nots_data){
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
	var tmpNotifyType = 1;
	//uploadFiles
	if (bodyObject) {
		uploadService.uploadFiles(req, res, null , function(uplErr){
			if(uplErr){
				res.json({error : "File not Uploaded..!"});	
			}

			var currUser = req.user;
			var tmpInvData = mergeInvoiceUploadData(req.files , req.body);
			tmpInvData = mergeUserDetailsData(tmpInvData , req.user);

			if( tmpInvData.isExpense == "true" ){
				delete tmpInvData.PO_id;
				tmpInvData.PO_number = "E";
			}
			
			//return res.json(tmpInvData);
			InvoiceService.addInvoice( tmpInvData , function(error , result){
				if(error){
					console.log("Invoice Not Created" , error);
					res.status(400);
					return res.json(error);
				}

				var tmpNotifyObj = {
					tabs : "invoice",
					data : result , 
					notifyType : tmpNotifyType,
					userData : currUser
				}

				notify.notifyUser( tmpNotifyObj , function(error , nots_data){
					if(error){
						return res.json( { error : "Notification Not added for invoice"+error});
					}
		  			return res.json({ OK : "Invoice Created And Notice Done" });
				});
			});
		});
	}else{
		res.json({ error : "Invalid data..!!" });
	}
});


function mergeInvoiceUploadData(files , tmpObj){

	tmpObj.vendor_selection = JSON.parse(tmpObj.vendor_selection);
	
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
		tmpObj["po_status"].status_description = "";
		tmpObj["po_status"].status_changedBy = ""
	}else{
		tmpObj["sa_status"].status = "pending";
		tmpObj["sa_status"].status_changeDate = "";
		tmpObj["sa_status"].status_description = "";
		tmpObj["sa_status"].status_changedBy = ""
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
	var actQuery = req.query.action && req.query.action.toLowerCase();
	if(!actQuery ){
		return callback({error : "Action required..!"})
	}else if(actQuery == 'supplier'){
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
	}else if(actQuery == 'invoice'){
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
	}else if(actQuery == 'purchaseord'){
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