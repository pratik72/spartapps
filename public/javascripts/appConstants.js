//Define all static and Global variables here
var APP_CONSTANT = {
	PATH_NAME: window.location.pathname,
	GET_ORG_LIST: '/getAllOrgList',
	SUBMIT_USERDATA: '/signup',
	GET_CURRENT_USR: '/userDetails',
	SUPPLIER_JSON : {
		"supplier_name_address": {
		    "supplier_name": "",
		    "address1": "",
		    "address2": "",
		    "address3": "",
		    "area": "",
		    "city": "",
		    "district": "",
		    "state": "",
		    "pin": "",
		    "country": "",
		    "country_code": ""
		},
		"contact_person": {
		    "name": "",
		    "cell_no": "",
		    "landline_no": "",
		    "email": "",
		    "fax": "",
		    "website": ""
		},
		"statutory_information": {
		    "PAN": "",
		    "TAN": "",
		    "CST": "",
		    "GST": "",
		    "TIN": "",
		    "service_tax_no": ""
		},
		"product_information": {
		    "product_name": "",
		    "product_discreption": "",
		    "HSN_code": "",
		    "quantity": "",
		    "rate": "",
		    "amount": "",
		    "payment_terms" : ""
		},
		"banking_details": {
		    "bank_name": "",
		    "IFSC_code": "",
		    "MICR_code": "",
		    "account_No": ""
		},
		"vendor_selection": {
		    "suggested_by": "",
		    "selected_by": "",
		    "shortlisted_by": "",
		    "division": ""
		},
		"budgets_and_approvals": {
		    "location": "",
		    "budget_head": "",
		    "period": ""
		},
		"customer_reference": [{
		    "customer_references1": "",
		    "Name": "",
		    "Number": "",
		    "Opinion": ""
		}],
		"doc_attachment": {
		    "statutory_registration_certificates": "",
		    "cancelled_cheque": "",
		    "quotation": "",
		    "agreements": "",
		    "vendor_profile": "",
		    "other_doc": []
		}
	}
}