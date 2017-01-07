var Supplier = require('../models/supplier').supplier;

exports.addSupplier = function(suppData , callback){
	var newSupplier = new Supplier({
		orgId : suppData.orgId,
		user_id : suppData.user_id,
		orgName : suppData.orgName,
		userName : suppData.userName,
		sa_status : {
			status: suppData.sa_status.status,
			status_description : suppData.sa_status.status_description,
			status_changedBy: suppData.sa_status.status_changedBy,
			status_changeDate : suppData.sa_status.status_changeDate
		},
		supplier_name_address: {
		    supplier_name: suppData.supplier_name_address.supplier_name,
		    address1: suppData.supplier_name_address.address1,
		    address2: suppData.supplier_name_address.address2,
		    address3: suppData.supplier_name_address.address3,
		    area: suppData.supplier_name_address.area,
		    city: suppData.supplier_name_address.city,
		    district: suppData.supplier_name_address.district,
		    state: suppData.supplier_name_address.state,
		    pin: suppData.supplier_name_address.pin,
		    country: suppData.supplier_name_address.country,
		    country_code: suppData.supplier_name_address.country_code
		},
		contact_person: {
		    name: suppData.contact_person.name,
		    cell_no: suppData.contact_person.cell_no,
		    landline_no: suppData.contact_person.landline_no,
		    email: suppData.contact_person.email,
		    fax: suppData.contact_person.fax,
		    website: suppData.contact_person.website
		},
		statutory_information: {
		    PAN: suppData.statutory_information.PAN,
		    TAN: suppData.statutory_information.TAN,
		    CST: suppData.statutory_information.CST,
		    GST: suppData.statutory_information.GST,
		    TIN: suppData.statutory_information.TIN,
		    service_tax_no: suppData.statutory_information.service_tax_no
		},
		product_information: {
		    product_name: suppData.product_information.product_name,
		    product_discreption: suppData.product_information.product_discreption,
		    HSN_code: suppData.product_information.HSN_code,
		    quantity: suppData.product_information.quantity,
		    rate: suppData.product_information.rate,
		    amount: suppData.product_information.amount,
		    payment_terms : suppData.product_information.payment_terms
		},
		banking_details: {
		    bank_name: suppData.banking_details.bank_name,
		    IFSC_code: suppData.banking_details.IFSC_code,
		    MICR_code: suppData.banking_details.MICR_code,
		    account_No: suppData.banking_details.account_No
		},
		vendor_selection: {
		    suggested_by: suppData.vendor_selection.suggested_by,
		    selected_by: suppData.vendor_selection.selected_by,
		    shortlisted_by: suppData.vendor_selection.shortlisted_by,
		    division: suppData.vendor_selection.division
		},
		budgets_and_approvals: {
		    location: suppData.budgets_and_approvals.location,
		    budget_head: suppData.budgets_and_approvals.budget_head,
		    period: suppData.budgets_and_approvals.period
		},
		/*customer_reference: [{
		    customer_references1: suppData.customer_reference.customer_references1,
		    Name: suppData.customer_reference.Name,
		    Number: suppData.customer_reference.Number,
		    Opinion: suppData.customer_reference.Opinion
		}],*/
		doc_attachment: {
		    statutory_registration_certificates: suppData.doc_attachment.statutory_registration_certificates,
		    cancelled_cheque: suppData.doc_attachment.cancelled_cheque,
		    quotation: suppData.doc_attachment.quotation,
		    agreements: suppData.doc_attachment.agreements,
		    vendor_profile: suppData.doc_attachment.vendor_profile,
		    other_doc: suppData.doc_attachment.other_doc
		}
	});

	newSupplier.save(function (err, product, numAffected) {
		if(err){
			console.log("newSupplier" , err)
			return callback(err)
		}
		callback(null);
	})
};

exports.findSupplier = function(supp_id, callback){
	var suppIdParam = supp_id || {};
	/*if(suppIdParam.length > 2){
		suppIdParam = { _id : supp_id }
	}*/
	Supplier.find( suppIdParam , function(error, org){
		callback(error , org)
	})
}

exports.updateSupplier = function(supp_query, updateData ,callback){
	var query = supp_query || {};
	console.log("query"  ,query)
	console.log("updateData"  ,updateData)
	if(!updateData){
		return callback({error : "Update Data not Provided"} , null);
	}

	Supplier.findOneAndUpdate(query, updateData, {upsert:true}, function(err, doc){
	    if (err) return callback({ error: err } , null);
	    callback(null , doc)
	});
}