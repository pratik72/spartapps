var mongoose = require('mongoose');
var userService = require('../services/org-services');
var Schema = mongoose.Schema;

var orgSchema = new Schema({
	orgName : {type:String, required: 'Please enter your org name'},
	ceoName : {type:String, required: 'Please enter your ceo name'},
	orgPAN : {type:String, required: 'Please enter your org PAN'},
	orgGST : {type:String, required: 'Please enter your org GST'},
	orgTIN : {type:String, required: 'Please enter your org TIN'},
	service_tax_no : {type:String, required: 'Please enter your org Service Tax No.'},
	export_import_regd_no : {type:String, required: 'Please enter your org Export/Import Regd No.'},
	form_regd_no : {type:String, required: 'Please enter your org Form Regd No.'},	
	orgAddr1 : {type:String, required: 'Please enter your org Address1.'},
	orgAddr2 : {type:String, required: 'Please enter your org Address2.'},
	orgCity : {type:String, required: 'Please enter your org City.'},
	orgDistrict : {type:String, required: 'Please enter your org District.'},
	orgState : {type:String, required: 'Please enter your org State.'},
	orgCountry : {type:String, required: 'Please enter your org Country.'},
	orgStatus : {type:String, required: 'Please select org status.'},
	join_date : {type: Date, default: Date.now},
	subscriptionId : String
});

orgSchema.index({'$**': 'text'});

var Org = mongoose.model('Organizations' , orgSchema);

module.exports = {
	Org: Org
};