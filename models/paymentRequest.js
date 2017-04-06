var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var payReqSchema = new Schema({
	create_date : {type: Date, default: Date.now},
	orgId : Schema.Types.ObjectId,
	user_id : Schema.Types.ObjectId,
	orgName : String,
	PayReq_number : String,
	userName : String,
	isPaid : Boolean,
	paymentMode : String,
	bankRefNo : String,
	bank_name : String,
	product_information: {
		PI_number : String,
		PI_id : Schema.Types.ObjectId,
		PO_id : Schema.Types.ObjectId,
		PO_number : String,
		act_amount : String,
	    TDS_rate: Number,
	    TDS_amount: Number,
	    PF_amount: Number,
	    ECIS_amount: Number,
	    PT_amount: Number,
	    LoanEMI: Number,
	    otherDeductionType : String,
	    otherDeductionAmount : Number,
	    netAmount: String
	},
	vendor_selection: {
	    selected_by: String,
	    division: String
	},
	doc_attachment: {
	    other_doc: String
	},
	pay_status : [{
		status: String,
		status_description : String,
		status_changedBy: String,
		status_changeDate : String
	}]
});

var payReq = mongoose.model('paymentRequest_list' , payReqSchema);

module.exports = {
	payReq: payReq
};