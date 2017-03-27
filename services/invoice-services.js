var Invoice = require('../models/invoice').invoice;
var nextSeq = require('../services/po-services').getNextSequence;

exports.addInvoice = function(invoiceData , callback){
	
	nextSeq( invoiceData.orgId , 'invoice' , function(invNum){

		var newInvoice = new Invoice({
			orgId : invoiceData.orgId,
			user_id : invoiceData.user_id,
			orgName : invoiceData.orgName,
			inv_no : "PI"+invNum.count,
			userName : invoiceData.userName,
			supplier_name : invoiceData.supplier_name,
			supplierId : invoiceData.supplierId,
			PO_number : invoiceData.PO_number,
			PO_id : invoiceData.PO_id,
			bill_number : invoiceData.bill_number,
			isExpense : invoiceData.isExpense,
			Product_Nature : invoiceData.Product_Nature,
			HSN_Code : invoiceData.HSN_Code,
			Quantity : invoiceData.Quantity,
			Rate : invoiceData.Rate,
			
			additionalRate : invoiceData.additionalRate,
			VAT : invoiceData.VAT,
		    CST: invoiceData.CST,
		    GST: invoiceData.GST,
		    service_tax : invoiceData.service_tax,
		    excise: invoiceData.excise,
		    amount: invoiceData.amount,

			Payment_due_date : invoiceData.Payment_due_date,
			vendor_selection: {
			    selected_by: invoiceData.vendor_selection.selected_by,
			    division: invoiceData.vendor_selection.division
			},
			doc_attachment: {
			    invoice: invoiceData.doc_attachment.invoice,
			    PO: invoiceData.doc_attachment.PO,
			    other_doc: invoiceData.doc_attachment.other_doc
			},
			iv_status : {
				status: invoiceData.iv_status.status,
				status_description : invoiceData.iv_status.status_description,
				status_changedBy: invoiceData.iv_status.status_changedBy,
				status_changeDate : invoiceData.iv_status.status_changeDate
			}
		});

		newInvoice.save(function (err, product, numAffected) {
			if(err){
				console.log("newInvoice" , err)
				return callback(err)
			}
			callback(null , product);
		})
	});
};

exports.findInvoice = function(inv_id, callback){
	var invIdParam = inv_id || {};
	/*if(invIdParam.length > 2){
		invIdParam = { _id : inv_id }
	}*/
	Invoice.find( invIdParam , function(error, org){
		callback(error , org)
	})
}

exports.updateInvoice = function(inv_query, updateData ,callback){
	var query = inv_query || {};
	if(!updateData){
		return callback({error : "Update Data not Provided"} , null);
	}

	Invoice.findOneAndUpdate(query, updateData, {new: true, upsert:true}, function(err, doc){
	    if (err) return callback({ error: err } , null);
	    callback(null , doc)
	});
}