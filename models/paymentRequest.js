var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var payReqSchema = new Schema({
	create_date : {type: Date, default: Date.now},
	orgId : Schema.Types.ObjectId,
	user_id : Schema.Types.ObjectId,
	orgName : String,
	PayReq_number : String,
	userName : String,
	product_information: {
		PI_number : String,
		PI_id : Schema.Types.ObjectId,
		PO_id : Schema.Types.ObjectId,
		PO_number : String,
	    VAT: Number,
	    CST: Number,
	    GST: Number,
	    service_tax: Number,
	    excise: Number,
	    amount: String,
	},
	vendor_selection: {
	    selected_by: String,
	    division: String
	},
	doc_attachment: {
	    other_doc: String
	},
	pay_status : {
		status: String,
		status_description : String,
		status_changedBy: String,
		status_changeDate : String
	}
});

var payReq = mongoose.model('paymentRequest_list' , payReqSchema);

module.exports = {
	payReq: payReq
};