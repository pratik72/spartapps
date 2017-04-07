var purchase_Order = require('../models/purchaseOrder').po;
var poCount = require('../models/purchaseOrder').poCount;
var ObjectId = require('mongoose').Types.ObjectId;

exports.addPO = function(poData , callback){
	this.getNextSequence( poData.orgId , 'purchaseOrd' , function(poNum){

		var newPO = new purchase_Order({
			orgId : poData.orgId,
			user_id : poData.user_id,
			orgName : poData.orgName,
			supplier_name : poData.supplier_name,
			supplierId : poData.supplierId,
			PO_number : "PO"+poNum.count,
			po_status : [{
				status: poData.po_status[0].status,
				status_description : poData.po_status[0].status_description,
				status_changedBy: poData.po_status[0].status_changedBy,
				distributeTo: poData.po_status[0].distributeTo,
				status_changeDate : poData.po_status[0].status_changeDate
			}],
			userName : poData.userName,
			product_information: {
			    product_name: poData.product_information.product_name,
			    poCategory : poData.product_information.poCategory,
			    product_discreption: poData.product_information.product_discreption,
			    HSN_code: poData.product_information.HSN_code,
			    quantity: poData.product_information.quantity,
			    rate: poData.product_information.rate,
			    VAT : poData.product_information.VAT,
			    CST: poData.product_information.CST,
			    GST: poData.product_information.GST,
			    service_tax : poData.product_information.service_tax,
			    excise: poData.product_information.excise,
			    amount: poData.product_information.amount,
			    payment_terms : poData.product_information.payment_terms
			},
			vendor_selection: {
			    selected_by: poData.vendor_selection.selected_by,
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
	});

};

exports.searchPOEs = function(searchStr, userOrgId, callback){
	
	purchase_Order.find({$text: {$search: searchStr} , orgId :userOrgId})
       .exec(function(err, docs) {
			callback(err , docs)
       });
}

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

	purchase_Order.findOneAndUpdate(query, updateData, {new: true, upsert:true}, function(err, doc){
	    if (err) return callback({ error: err } , null);
	    callback(null , doc)
	});
}

exports.getNextSequence = function(orgId , formName , next) {
	var tmpQuery = { 
		orgId : new ObjectId(orgId),
		form_name : formName
	};
	poCount.find( tmpQuery , function(error, data){
		if(data.length == 0){
			var newCount = new poCount({
				orgId : orgId,
				form_name : formName,
				count : 1
			});
			newCount.save(function (err, result, numAffected) {
				if(err){
					return err;
				}
				next(result);
			})
		}else if(data.length > 0){
			var updCnt = data[0].count;
			updCnt++;
			var updateCount = { count : updCnt };
			poCount.findOneAndUpdate( tmpQuery , updateCount, {new: true, upsert:true}, function(err, doc){
			    if (err) return err;
			    next(doc);
			});
		}
	});
}