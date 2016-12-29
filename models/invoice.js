var mongoose = require('mongoose');
//var invvoiceService = require('../services/invoice-services');
var Schema = mongoose.Schema;

var invoiceSchema = new Schema({
	orgId : Schema.Types.ObjectId,
	user_id : Schema.Types.ObjectId,
	orgName : String,
	userName : String,
	supplier_name : String,
	PO_number : String,
	bill_number : String,
	Product_Nature : String,
	HSN_Code : String,
	Quantity : String,
	Rate : String,
	create_date : {type: Date, default: Date.now},
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