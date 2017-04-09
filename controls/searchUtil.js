var supplierService = require('../services/supplier-services');
var poService = require('../services/po-services');
var payReqService = require('../services/payreq-services');
var InvoiceService = require('../services/invoice-services');
var ObjectId = require('mongoose').Types.ObjectId;

exports.searchTabArea = function(tabArea , searchString , userOrgId , callback){

	switch(tabArea){
		case 'invoice' :
			InvoiceService.searchInvEs( searchString , userOrgId , function(error , suppData){
				if(error){
					console.log("Data Not Retrived" , error);
					return callback(error);
				}
		  		callback(suppData);
			});
			break;
		case 'pay_req' :
			payReqService.searchPayReqEs( searchString , userOrgId ,function(error , suppData){
				if(error){
					console.log("Data Not Retrived" , error);
					return callback(error);
				}
		  		callback(suppData);
			});
			break;
		case 'supplier' :
			supplierService.searchSupplierEs( searchString , userOrgId ,function(error , suppData){
				if(error){
					console.log("Data Not Retrived" , error);
					return callback(error);
				}
		  		callback(suppData);
			});
			break;
		case 'purchaseOrd' :
			poService.searchPOEs( searchString , userOrgId ,function(error , suppData){
				if(error){
					console.log("Data Not Retrived" , error);
					return callback(error);
				}
		  		callback(suppData);
			});
			break;				
	}
}

exports.searchTrackReport = function( searchArray , userOrgId , callback){

	var stepVar =  {
		"supplier_name" :  {tab :'supplier' , index : 1},
		"PO_number" : {tab :'purchaseOrd', index : 2},
		"HSN_Code" : {tab :'purchaseOrd', index : 2},
		"bill_number" : {tab :'invoice', index : 3},
		"PI_number" : {tab :"invoice", index : 3}
	};

	var tempSeachReport = [];
	var currStage = stepVar[ searchArray[0] ];
	var revIndex = currStage.index;
	var forwIndex = currStage.index;
	var tmpRevReport = [];
	var self = this;

	reverseSearch( searchArray[1] , currStage , function(data){
		callback(tmpRevReport);
	});

	function reverseSearch(value , stage , rnext){
		var keyTypes = 1;

		switch(revIndex){
			case 1 : // search for Supplier
				self.searchTabArea( stage.tab , value , userOrgId , function(data){
					if(data.length > 0){
						tmpRevReport = ForwCheckAndInsertData(tmpRevReport , data , stage.tab , keyTypes);
					}
					console.log('--R1-----');
					forwardSearch(searchArray[1] , currStage , rnext);
				});
				break;
			case 2 : // search for PO
				self.searchTabArea( stage.tab , value , userOrgId , function(data){
					if(data.length > 0){
						tmpRevReport = ForwCheckAndInsertData(tmpRevReport , data , stage.tab , keyTypes);
						revIndex--;
						reverseSearch(data[0].supplier_Number , { tab : 'supplier'}, rnext);
					}else{
						forwardSearch(searchArray[1] , currStage , rnext);
					}
					console.log('--R2-----');
				});
				break;
			case 3 : // search for PI
				self.searchTabArea( stage.tab , value , userOrgId , function(data){
					if(data.length > 0){
						tmpRevReport = ForwCheckAndInsertData(tmpRevReport , data , stage.tab , keyTypes);
						revIndex--;
						reverseSearch( data[0].PO_number , { tab : 'purchaseOrd' }, rnext);
					}else{
						forwardSearch(searchArray[1] , currStage , rnext);
					}
					console.log('--R3-----');
				});
				break;
		}

	}

	function forwardSearch( value , stage , rnext ){
		var keyTypes = 0;
		switch(forwIndex){
			case 1 : // search for Supplier
				self.searchTabArea( stage.tab , value , userOrgId , function(data){
					if(data.length > 0){
						tmpRevReport = ForwCheckAndInsertData(tmpRevReport , data , stage.tab , keyTypes);
						forwIndex++;
						forwardSearch(data[0].PO_number , { tab : 'purchaseOrd'}, rnext);
					}else{
						rnext(data);
					}
					console.log('--F1-----');
				});
				break;
			case 2 : // search for PO
				self.searchTabArea( stage.tab , value , userOrgId , function(data){
					if(data.length > 0){
						tmpRevReport = ForwCheckAndInsertData(tmpRevReport , data , stage.tab , keyTypes);
						forwIndex++;
						forwardSearch(data[0].PO_number , { tab : 'invoice'}, rnext);
					}else{
						rnext(data);
					}
					console.log('--F2-----');
				});
				break;
			case 3 : // search for PI
				self.searchTabArea( stage.tab , value , userOrgId , function(data){
					if(data.length > 0){
						tmpRevReport = ForwCheckAndInsertData(tmpRevReport , data , stage.tab , keyTypes);
					}
					rnext(data);					
					console.log('--F3-----' , data.length);
				});
				break;
		}
	}

}


function ForwCheckAndInsertData(retArray , allData , matchKey , type){

	for (var i = 0; i < allData.length; i++) {
		if(retArray.filter(its => its[ Object.keys(its)[0] ]._id.toString() == allData[i]._id.toString()  ).length == 0){

			if(type == 1){//To Check Reverse or forward method
				retArray.push({ [matchKey] : allData[i] });
			}else{
				retArray.unshift({ [matchKey] : allData[i] });
			}
		}
	}

	return retArray;
}