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
			isPaid : false,
			paymentMode : poData.paymentMode,
			bankRefNo : poData.bankRefNo,
			bank_name : poData.bank_name,
			product_information: {
				PI_number : poData.product_information.PI_number,
				PI_id : poData.product_information.PI_id,
				PO_id : poData.product_information.PO_id,
				PO_number : poData.product_information.PO_number,
			    act_amount : poData.product_information.act_amount,
			    TDS_rate: poData.product_information.TDS_rate,
			    TDS_amount: poData.product_information.TDS_amount,
			    PF_amount: poData.product_information.PF_amount,
			    ECIS_amount: poData.product_information.ECIS_amount,
			    PT_amount: poData.product_information.PT_amount,
			    LoanEMI: poData.product_information.LoanEMI,
			    otherDeductionType : poData.product_information.otherDeductionType,
			    otherDeductionAmount : poData.product_information.otherDeductionAmount,
			    netAmount: poData.product_information.netAmount
			},
			vendor_selection: {
			    selected_by: poData.vendor_selection.selected_by,
			    division: poData.vendor_selection.division
			},
			doc_attachment: {
			    other_doc: poData.doc_attachment.other_doc
			},
			pay_status : [{
				status: poData.pay_status[0].status,
				status_description : poData.pay_status[0].status_description,
				status_changedBy: poData.pay_status[0].status_changedBy,
				status_changeDate : poData.pay_status[0].status_changeDate
			}]
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