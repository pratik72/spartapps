//Define all static and Global variables here
var APP_CONSTANT = {
	PATH_NAME: window.location.pathname,
	GET_ORG_LIST: '/getAllOrgList',
	GET_USER_LIST: '/getAllUserList',
	SUBMIT_USERDATA: '/signup',
	GET_CURRENT_USR: '/userDetails',
	CREATE_SUPPLIER : '/createSupplier',
	CREATE_INVOICE : '/createInvoice',
	STATUS_CHANGE_URL : '/statusChanges',
	GET_SUPPLIERS : '/getSupplierDetails',
	GET_INVOICES : '/getInvoicesDetails',
	TEMPLATES : {
		supplier : "supplier-template.html",
		statusModel : "status-change.html",
		invoice : "invoice-template.html",
		supplierModel : "supplierModel.html",
		invoiceModel : "invoiceModel.html",
		sidebar : "templates/sidebar.html",
		purchaseOrd : "templates/purchase-ord-template.html",
		purchaseOrdModel : "templates/purchaseOrdModel.html",
		ajaxloader : "ajax-loader.html"
	},
	SUPPLIER_JSON : {
		sa_status : {
			status:"",
			status_description : "",
			status_changedBy: "",
			status_changeDate : "",
		},
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
		"customer_reference": [{
		    "customer_references1": "",
		    "Name": "",
		    "Number": "",
		    "Opinion": ""
		}],
		"doc_attachment": {
		    "statutory_registration_certificates": "",
		    "agreements": "",
		    "vendor_profile": "",
		    "other_doc": []
		}
	},
	PO_JSON : {
		po_status : {
			status:"",
			status_description : "",
			status_changedBy: "",
			status_changeDate : "",
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
		"doc_attachment": {
		    "cancelled_cheque": "",
		    "quotation": "",
		    "other_doc": []
		}
	},
	USER_JSON : {
		"firstName" : "",
		"lastName" : "",
		"email" : "",
		"password" : "",
		"organization" : "",
		"role" : ""
	},
	STATUS_MODEL_JSON : {
		action : "",
		row : "",
		fieldSet : "",
	},
	INVOICE_JSON : {
		supplier_name : "",
		PO_number : "",
		bill_number : "",
		Product_Nature : "",
		HSN_Code : "",
		Quantity : "",
		Rate : "",
		Payment_due_date : "",
		doc_attachment: {
		    invoice: "",
		    PO: "",
		    other_doc: ""
		},
		iv_status : {
			status: "",
			status_description : "",
			status_changedBy: "",
			status_changeDate : ""
		}
	},
	USER_ROLES : [
		{ name : "CEO"},
		{ name : "CFO"},
		{ name : "COO"},
		{ name : "Admin"},
		{ name : "Regional Head"},
		{ name : "Centre Head"},
		{ name : "Finance Controller"},
		{ name : "Account Manager"},
		{ name : "Data Entry Ops"},
		{ name : "National Head"},
	]
}