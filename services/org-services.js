var Organization = require('../models/organization').Org;

exports.addOrganization = function(orgData , callback){
	console.log("==== services call ====" , orgData)
	var newOrg = new Organization({
		orgName : orgData.orgName,
		ceoName : orgData.ceoName,
		orgPAN : orgData.orgPAN,
		numRegHead : orgData.numRegHead,
		numFinHead : orgData.numFinHead,
		numDataEntryOps : orgData.numDataEntryOps,
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