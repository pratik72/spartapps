//Define all static and Global variables here
var APP_CONSTANT = {
	PATH_NAME: window.location.pathname,
	GET_ORG_LIST: '/getAllOrgList',
	GET_USER_LIST: '/getAllUserList',
	SUBMIT_USERDATA: '/signup',
	GET_CURRENT_USR: '/userDetails',
	GET_PAYREQUEST : '/getAllPayReq',
	CREATE_SUPPLIER : '/createSupplier',
	CREATE_INVOICE : '/createInvoice',
	CREATE_PAYREQ : '/createPayRequest',
	GET_ALL_PO : '/getAllPOs',
	SET_MARK_AS_VIEW_NOTIFY: '/markNotificationAsViewed',
	CREATE_PO : '/createPO',
	STATUS_CHANGE_URL : '/statusChanges',
	SEARCH_TAB : '/searchInAllTab',
	GET_SUPPLIERS : '/getSupplierDetails',
	GET_POLIST : '/getPOdetList',
	GET_INVOICES : '/getInvoicesDetails',
	INV_SEARCH_KEY :{
		orgName : 'Organization Name',
		userName : 'Username',
		PO_number : 'PO Nu.',
		bill_number : 'Bill No.',
		Product_Nature : 'Product Nature',
		HSN_Code : 'HSN Code',
		Quantity : 'Quantity',
		Rate : 'Rate',
		Payment_due_date : 'Payment Due Date',
		'vendor_selection.selected_by': 'Selected By',
		'vendor_selection.division': 'Division',
		'iv_status.status' : 'Status',
		'iv_status.status_description' : 'Description'
	},
	TEMPLATES : {
		supplier : "supplier-template.html",
		statusModel : "status-change.html",
		invoice : "invoice-template.html",
		supplierModel : "supplierModel.html",
		invoiceModel : "invoiceModel.html",
		sidebar : "templates/sidebar.html",
		purchaseOrd : "templates/purchase-ord-template.html",
		purchaseOrdModel : "templates/purchaseOrdModel.html",
		pay_req : "templates/finance-template.html",
		financeModel : "templates/financeModel.html",
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
		    "poCategory" : "product",
		    "product_discreption": "",
		    "HSN_code": "",
		    "quantity": "",
		    "rate": "",
		    "VAT": "",
		    "CST": "",
		    "GST": "",
		    "service_tax": "",
		    "excise": "",
		    "amount": "",
		    "payment_terms" : ""
		},
		"vendor_selection": {
		    "selected_by": "",
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
		orgName : "",
		userName : "",
		supplier_name : "",
		PO_number : "",
		bill_number : "",
		isExpense : "false",
		Product_Nature : "",
		HSN_Code : "",
		Quantity : "",
		Rate : "",
		Payment_due_date : "",
		"vendor_selection": {
		    "selected_by": "",
		    "division": ""
		},
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
	PAYREQ_JSON : {
		orgName : "",
		userName : "",
		isPaid : false,
		paymentMode :"",
		bankRefNo : "",
		bank_name : "",
		product_information: {
			PI_number : "",
			PO_number : "",
		    act_amount : 0,
		    TDS_rate: 0,
		    TDS_amount: 0,
		    PF_amount: 0,
		    ECIS_amount: 0,
		    PT_amount: 0,
		    LoanEMI: 0,
		    otherDeductionType : "",
		    otherDeductionAmount : 0,
		    netAmount: 0
		},
		vendor_selection: {
		    selected_by: "",
		    division: ""
		},
		doc_attachment: {
		    other_doc: ""
		},
		pay_status : {
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