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

		switch(revIndex){
			case 1 : // search for Supplier
				self.searchTabArea( stage.tab , value , userOrgId , function(data){
					if(data[0]){
						tmpRevReport.push({ [stage.tab] : data[0] });
					}
					console.log('--1-----' , data);
					rnext(data);
					//forwardSearch(searchArray[1] , currStage , rnext);
				});
				break;
			case 2 : // search for PO
				self.searchTabArea( stage.tab , value , userOrgId , function(data){
					if(data[0]){
						tmpRevReport.push({ [stage.tab] : data[0] });
						revIndex--;
						reverseSearch(data[0].supplier_Number , { tab : 'supplier'}, rnext);
					}else{
						rnext(data);
					}
					console.log('--2-----' , data);
				});
				break;
			case 3 : // search for PI
				self.searchTabArea( stage.tab , value , userOrgId , function(data){
					if(data[0]){
						tmpRevReport.push({ [stage.tab] : data[0] });
						revIndex--;
						reverseSearch( data[0].PO_number , { tab : 'purchaseOrd' }, rnext);
					}else{
						rnext(data);
					}
					console.log('--3-----' , data);
				});
				break;
		}

	}

	function forwardSearch( value , stage , rnext ){
		switch(revIndex){
			case 1 : // search for Supplier
				self.searchTabArea( stage.tab , value , userOrgId , function(data){
					if(data[0]){
						tmpRevReport.push({ [stage.tab] : data[0] });
					}else{
						rnext(data);
					}
					console.log('--1-----' , data);
				});
				break;
			case 2 : // search for PO
				self.searchTabArea( stage.tab , value , userOrgId , function(data){
					if(data[0]){
						tmpRevReport.push({ [stage.tab] : data[0] });
						revIndex++;
						reverseSearch(data[0].supplier_Number , { tab : 'supplier'}, rnext);
					}else{
						rnext(data);
					}
					console.log('--2-----' , data);
				});
				break;
			case 3 : // search for PI
				self.searchTabArea( stage.tab , value , userOrgId , function(data){
					if(data[0]){
						tmpRevReport.push({ [stage.tab] : data[0] });
						revIndex++;
						reverseSearch( data[0].PO_number , { tab : 'purchaseOrd' }, rnext);
					}
					rnext(data);
					console.log('--3-----' , data);
				});
				break;
		}
	}

}