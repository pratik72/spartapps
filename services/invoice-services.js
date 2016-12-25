var Invoice = require('../models/invoice').invoice;

exports.addInvoice = function(invoiceData , callback){
	console.log("==== Invoice data ====" , invoiceData)
	var newInvoice = new Invoice({
		createdBy : invoiceData.createdBy,
		supplier_name : invoiceData.supplier_name,
		PO_number : invoiceData.PO_number,
		bill_number : invoiceData.bill_number,
		Product_Nature : invoiceData.Product_Nature,
		HSN_Code : invoiceData.HSN_Code,
		Quantity : invoiceData.Quantity,
		Rate : invoiceData.Rate,
		Payment_due_date : invoiceData.Payment_due_date,
		doc_attachment: {
		    invoice: invoiceData.doc_attachment.invoice,
		    PO: invoiceData.doc_attachment.PO,
		    other_doc: invoiceData.doc_attachment.other_doc
		}
	});

	newInvoice.save(function (err, product, numAffected) {
		if(err){
			console.log("newInvoice" , err)
			return callback(err)
		}
		callback(null);
	})
};

exports.findInvoice = function(inv_id, callback){
	var invIdParam = inv_id || {};
	if(invIdParam.length > 2){
		invIdParam = { _id : inv_id }
	}
	Invoice.find( invIdParam , function(error, org){
		console.log("findInvoice" , error)
		callback(error , org)
	})
}