var mongoose = require('mongoose');
//var supplierService = require('../services/supplier-services');
var Schema = mongoose.Schema;

var supplierSchema = new Schema({
	orgId : Schema.Types.ObjectId,
	createdBy : Schema.Types.ObjectId,
	supplier_name_address: {
	    supplier_name: String,
	    address1: String,
	    address2: String,
	    address3: String,
	    area: String,
	    city: String,
	    district: String,
	    state: String,
	    pin: String,
	    country: String,
	    country_code: String
	},
	contact_person: {
	    name: String,
	    cell_no: String,
	    landline_no: String,
	    email: String,
	    fax: String,
	    website: String
	},
	statutory_information: {
	    PAN: String,
	    TAN: String,
	    CST: String,
	    GST: String,
	    TIN: String,
	    service_tax_no: String
	},
	product_information: {
	    product_name: String,
	    product_discreption: String,
	    HSN_code: String,
	    quantity: String,
	    rate: String,
	    amount: String,
	    payment_terms : String
	},
	banking_details: {
	    bank_name: String,
	    IFSC_code: String,
	    MICR_code: String,
	    account_No: String
	},
	vendor_selection: {
	    suggested_by: String,
	    selected_by: String,
	    shortlisted_by: String,
	    division: String
	},
	budgets_and_approvals: {
	    location: String,
	    budget_head: String,
	    period: String
	},
	/*customer_reference: [{
	    customer_references1: String,
	    Name: String,
	    Number: String,
	    Opinion: String
	}],*/
	doc_attachment: {
	    statutory_registration_certificates: String,
	    cancelled_cheque: String,
	    quotation: String,
	    agreements: String,
	    vendor_profile: String,
	    other_doc: String
	}
});

var supplier = mongoose.model('supplier_dir' , supplierSchema);

module.exports = {
	supplier: supplier
};