var purchase_Order = require('../models/purchaseOrder').po;

exports.addPO = function(poData , callback){
	var newPO = new purchase_Order({
		orgId : poData.orgId,
		user_id : poData.user_id,
		orgName : poData.orgName,
		po_status : {
			status: poData.po_status.status,
			status_description : poData.po_status.status_description,
			status_changedBy: poData.po_status.status_changedBy,
			status_changeDate : poData.po_status.status_changeDate
		},
		userName : poData.userName,
		product_information: {
		    product_name: poData.product_information.product_name,
		    product_discreption: poData.product_information.product_discreption,
		    HSN_code: poData.product_information.HSN_code,
		    quantity: poData.product_information.quantity,
		    rate: poData.product_information.rate,
		    amount: poData.product_information.amount,
		    payment_terms : poData.product_information.payment_terms
		},
		vendor_selection: {
		    suggested_by: poData.vendor_selection.suggested_by,
		    selected_by: poData.vendor_selection.selected_by,
		    shortlisted_by: poData.vendor_selection.shortlisted_by,
		    division: poData.vendor_selection.division
		},
		budgets_and_approvals: {
		    location: poData.budgets_and_approvals.location,
		    budget_head: poData.budgets_and_approvals.budget_head,
		    period: poData.budgets_and_approvals.period
		},
		doc_attachment: {
		    cancelled_cheque: poData.doc_attachment.cancelled_cheque,
		    quotation: poData.doc_attachment.quotation,
		    other_doc: poData.doc_attachment.other_doc
		}
	});

	newPO.save(function (err, result, numAffected) {
		if(err){
			console.log("newPO" , err)
			return callback(err)
		}
		callback(null , result);
	})
};

exports.findPO = function(po_id, callback){
	var poIdParam = po_id || {};
	
	purchase_Order.find( poIdParam , function(error, org){
		callback(error , org)
	})
}

exports.updatePO = function(po_query, updateData ,callback){
	var query = po_query || {};
	if(!updateData){
		return callback({error : "Update Data not Provided"} , null);
	}

	purchase_Order.findOneAndUpdate(query, updateData, {upsert:true}, function(err, doc){
	    if (err) return callback({ error: err } , null);
	    callback(null , doc)
	});
}