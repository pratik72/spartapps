var Organization = require('../models/organization').Org;

exports.addOrganization = function(orgData , callback){
	console.log("==== services call ====" , orgData)
	var newOrg = new Organization({
		orgName : orgData.orgName,
		ceoName : orgData.ceoName,
		orgPAN : orgData.orgPAN,
		orgGST : orgData.orgGST,
		orgTIN : orgData.orgTIN,
		service_tax_no : orgData.service_tax_no,
		export_import_regd_no : orgData.export_import_regd_no,
		form_regd_no : orgData.form_regd_no,		
		orgAddr1 : orgData.orgAddr1,
		orgAddr2 : orgData.orgAddr2,
		orgCity : orgData.orgCity,
		orgDistrict : orgData.orgDistrict,
		orgState : orgData.orgState,
		orgCountry : orgData.orgCountry,
		orgStatus : orgData.orgStatus,
		subscriptionId : 1
	});

	newOrg.save(function (err, product, numAffected) {
		if(err){
			console.log("newUser" , err)
			return callback(err)
		}
		callback(null);
	})
};

exports.findOrgs = function(orgid, callback){
	var orgIdParam = orgid;
	if(orgIdParam.length > 2){
		orgIdParam = { _id : orgid }
	}
	Organization.find( orgIdParam , function(error, org){
		console.log("findOrg" , error)
		callback(error , org)
	})
}