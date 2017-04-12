var express = require('express');
var passport = require('passport');
var ObjectId = require('mongoose').Types.ObjectId;
var restrict = require('../auth/restrict');
var supplierService = require('../services/supplier-services');
var poService = require('../services/po-services');
var payReqService = require('../services/payreq-services');
var InvoiceService = require('../services/invoice-services');
var userService = require('../services/user-services');
var uploadService = require('../services/upload-services');
var notify = require('../controls/notify-user');
var search_util = require('../controls/searchUtil');

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

//downloadRepors
	var PythonShell = require('python-shell');
router.post('/downloadRepors', restrict , function(req, res, next) {


	PythonShell.run('../reports/po_reports.py', function (err) {
		  if (err) return res.json(err);
		  console.log('finished');
		  res.json( { success : req.user} );
		});
	
});

router.post('/distUserDetails', restrict , function(req, res, next) {

	uploadService.uploadFiles(req, res, null , function(uplErr){
		var serach = { orgId : req.user.orgId }

		if( req.body.users ){
			var tmpArrayOfUser = req.body.users.split(',');
			serach._id = { $in : tmpArrayOfUser}
		}

		userService.findAllUsers( serach, function(error , result){
			if(error){
				console.log("User Not Retrived" , error);
				return res.json(error);
			}
	  		res.json(result);
		});
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

//getAllPayReq
router.post('/getAllPayReq', restrict , function(req, res, next) {
	
	var userOrgId = req.user.orgId;
	payReqService.findPayReq( { orgId : new ObjectId(userOrgId) }, function(error , poData){
		if(error){
			console.log("pay_req Not Retrived" , error);
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
		var tabArea = req.body.searchTab;
		var searchString = req.body.searchText;

		search_util.searchTabArea(tabArea , searchString , userOrgId , function(args){
			res.json(args);
		});

	});
});

//getTrackPaymentReport
router.post('/getTrackPaymentReport', restrict , function(req, res, next) {

	uploadService.uploadFiles(req, res, null , function(uplErr){

		if(uplErr){
			res.json({error : "File not Uploaded..!"});	
		}

		var userOrgId = req.user.orgId;
		var searchString = req.body.searchText;
		var searchType = req.body.searchKey
		var searchArray = [ searchType , searchString ];

		search_util.searchTrackReport( searchArray , userOrgId , function(args){
			res.json(args);
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

			bodyObject = mergeUserDetailsData(bodyObject , req.user);
			bodyObject = mergeSupplierUploadStatusData(req.files , bodyObject , "supplier");

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

//createPayRequest
router.post('/createPayRequest', restrict , function(req, res, next) {
	var bodyObject = req.body;
	var tmpNotifyType = 1;
	if (bodyObject) {

		uploadService.uploadFiles(req, res, null , function(uplErr){

			if(uplErr){
				res.json({error : "File not Uploaded..!"});	
			}

			bodyObject = req.body;

			bodyObject = mergeUserDetailsData(bodyObject , req.user);
			bodyObject = mergeSupplierUploadStatusData(req.files , bodyObject , 'pay_req');

			var currUser = req.user;

			payReqService.addPayReq(bodyObject , function(error , result){
				if(error){
					console.log("Pay Req Not Created" , error);
					res.status(400);
					return res.json(error);
				}

				var tmpNotifyObj = {
					tabs : "pay_req",
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

			bodyObject = mergeUserDetailsData(bodyObject , req.user);
			bodyObject = mergeSupplierUploadStatusData(req.files , bodyObject , 'po');


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
			var tmpInvData = mergeUserDetailsData(req.body , req.user);
			tmpInvData = mergeInvoiceUploadData(req.files , tmpInvData);

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
	var invStutusKey = "iv_status";

	tmpObj.vendor_selection = JSON.parse(tmpObj.vendor_selection);
	
	tmpObj.doc_attachment = {};
	tmpObj.doc_attachment.invoice = files[0] ? files[0].filename : "";
	tmpObj.doc_attachment.PO = files[1] ? files[1].filename : "";
	tmpObj.doc_attachment.other_doc = files[2] ? files[2].filename : "";

	if( typeof tmpObj[  invStutusKey  ] == "undefined"){
		tmpObj[  invStutusKey  ] = [];
	}

	var tmpUserId = tmpObj.user_id;
	var distUserId = tmpObj.vendor_selection.selected_by;
	var newStatusObj = {
		status : "pending",
		status_changeDate : Date.now(),
		distributeTo : distUserId,
		status_changedBy : tmpUserId,
		status_description : ""
	}
	
	tmpObj[  invStutusKey  ].push(newStatusObj)

	/*var allAttachParam = [ "invoice" , "PO" , "other_doc"];
	for (var k = 0; k < allAttachParam.length; k++) {
		tmpObj.doc_attachment[ allAttachParam[k] ] = "";
		for (var i = 0; i < files.length; i++) {
			if(files[i].fieldname == allAttachParam[k] ){
				tmpObj.doc_attachment[ allAttachParam[k] ] = files[i] ? files[i].filename : "";
			}
		};
	};*/

	return tmpObj;
}

function mergeSupplierUploadStatusData(files , tmpObj , comeFrom){
	var statusKey = {
		po : "po_status",
		supplier : "sa_status",
		pay_req : "pay_status",
	}

	var tmpStatus = 'pending';

	if( comeFrom == 'pay_req' ){
		tmpStatus = 'pending for Audit';
	}

	for (var i in tmpObj) {
		if(typeof tmpObj[i] == 'string' && tmpObj[i] != "undefined" && tmpObj[i] != ""){
			try{
				tmpObj[i] = JSON.parse(tmpObj[i]) || tmpObj[i];
			}catch(e){
				tmpObj[i] = tmpObj[i];
			}
		}
	};

	if( typeof tmpObj[ statusKey[comeFrom] ] == "undefined"){
		tmpObj[ statusKey[comeFrom] ] = [];
	}

	var tmpUserId = tmpObj.user_id;
	var distUserId = tmpObj.vendor_selection.selected_by;
	var newStatusObj = {
		status : tmpStatus,
		status_changeDate : Date.now(),
		status_changedBy : tmpUserId,
		distributeTo : distUserId,
		status_description : ""
	}

	tmpObj[ statusKey[comeFrom] ].push(newStatusObj)

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

		var newQuery = {
			$push : rowData
		}

		supplierService.updateSupplier(rowQuery , newQuery , function(error , data){
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

		var newQuery = {
			$push : rowData
		}

		InvoiceService.updateInvoice(rowQuery , newQuery , function(error , data){
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

		var newQuery = {
			$push : rowData
		}

		poService.updatePO(rowQuery , newQuery , function(error , data){
			if(error){
				return callback({error : error});
			}
			return callback({ ok : data})
		});
	}else if(actQuery == 'pay_req'){
		var rowId = req.body.rowId;
		rowId = rowId ? new ObjectId(rowId) : {};

		var rowQuery = { _id : rowId };
		delete req.body.rowId;
		var rowData = req.body && req.body.status;
		if (!rowData) return callback({error : "Bad data structure..!"});
		rowData = {
			pay_status : JSON.parse( rowData )
		};

		var newQuery = {
			$push : rowData
		}

		payReqService.updatePayReq(rowQuery , newQuery , function(error , data){
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