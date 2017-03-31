var payment_request = require('../models/paymentRequest').payReq;
var nextSeq = require('../services/po-services').getNextSequence;
var ObjectId = require('mongoose').Types.ObjectId;

exports.addPayReq = function(poData , callback){
	nextSeq( poData.orgId , 'pay_req' , function(poNum){

		var newPayReq = new payment_request({
			orgId : poData.orgId,
			user_id : poData.user_id,
			orgName : poData.orgName,
			PayReq_number : "AUDR"+poNum.count,
			userName : poData.userName,
			product_information: {
				PI_number : poData.product_information.PI_number,
				PI_id : poData.product_information.PI_id,
				PO_id : poData.product_information.PO_id,
				PO_number : poData.product_information.PO_number,
			    VAT: poData.product_information.VAT,
			    CST: poData.product_information.CST,
			    GST: poData.product_information.GST,
			    service_tax: poData.product_information.service_tax,
			    excise: poData.product_information.excise,
			    amount: poData.product_information.amount
			},
			vendor_selection: {
			    selected_by: poData.vendor_selection.selected_by,
			    division: poData.vendor_selection.division
			},
			doc_attachment: {
			    other_doc: poData.doc_attachment.other_doc
			},
			pay_status : {
				status: poData.pay_status.status,
				status_description : poData.pay_status.status_description,
				status_changedBy: poData.pay_status.status_changedBy,
				status_changeDate : poData.pay_status.status_changeDate
			}
		});

		newPayReq.save(function (err, result, numAffected) {
			if(err){
				console.log("newPayReq" , err)
				return callback(err)
			}
			callback(null , result);
		})
	});

};

exports.findPayReq = function(po_id, callback){
	var poIdParam = po_id || {};
	
	payment_request.find( poIdParam , function(error, org){
		callback(error , org)
	})
}

exports.updatePayReq = function(po_query, updateData ,callback){
	var query = po_query || {};
	if(!updateData){
		return callback({error : "Update Data not Provided"} , null);
	}

	payment_request.findOneAndUpdate(query, updateData, {new: true, upsert:true}, function(err, doc){
	    if (err) return callback({ error: err } , null);
	    callback(null , doc)
	});
}