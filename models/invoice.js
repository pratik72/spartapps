var mongoose = require('mongoose');
//var invvoiceService = require('../services/invoice-services');
var Schema = mongoose.Schema;

var invoiceSchema = new Schema({
	createdBy : String,
	supplier_name : String,
	PO_number : String,
	bill_number : String,
	Product_Nature : String,
	HSN_Code : String,
	Quantity : String,
	Rate : String,
	Payment_due_date : String,
	doc_attachment: {
	    invoice: String,
	    PO: String,
	    other_doc: String
	}
});

var invoice = mongoose.model('invoice_docs' , invoiceSchema);

module.exports = {
	invoice: invoice
};