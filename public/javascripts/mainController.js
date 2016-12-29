var app = angular.module('spartapps', []);

app.controller('mainController', ['common' , '$scope' , '$timeout',function(common , $scope , $timeout) {
	var PATH_NAME = APP_CONSTANT.PATH_NAME;
	var allTemplates = APP_CONSTANT.TEMPLATES;
	var adminRights = {
		"Finance Head" : "Y0YY",
		"Regional Head" : "Y0Y0",
		"Data Entry Ops" : "YY00"
	}

	common.init( $scope );

	$scope.supplier_Model = allTemplates.supplierModel;
	$scope.invoice_Model = allTemplates.invoiceModel;

	//Init all Scopes
	$scope.userDetails = "";
	$scope.permissions = {
		"CreateSupplier" : "" ,
		"CreateInvoiceReq" : "",
		"ApprvInvoiceReq" : "",
		"ApprvFinanceReq" : ""
	};
	
	//Init Form data of madel
	$scope.supplierFormData = APP_CONSTANT.SUPPLIER_JSON;
	$scope.invoiceFormData = APP_CONSTANT.INVOICE_JSON;

	//Init To get Current User Details on load
	common.asynCall({
		url: PATH_NAME + APP_CONSTANT.GET_CURRENT_USR,
		method: 'post'
	}).then( function(resVal){
		$scope.userDetails= resVal.data;
		var rightsValue = adminRights[$scope.userDetails.role];
		if(rightsValue){
			rightsValue = rightsValue.split('');
			var tmpIndex = 0;
			var tmpValue = null;
			for (var key in $scope.permissions) {
				tmpValue = rightsValue[ tmpIndex ];
				$scope.permissions[key] = isNaN(parseInt(tmpValue)) ? true : false;
				tmpIndex++;
			};
		}
    }, function(error){
    	console.log(error);
    });


	//Init All events
    $scope.openSupplier = function(){
    	$("#mySuppModal").modal('show');
    }

    $scope.openInvoice = function(){
    	$("#myInvoiceModal").modal('show');
    }

    //Submit supplier form data
    $scope.supplierCreate = function(){
    	common.showLoader();

    	var tmpData = new FormData();
    	for (var key in $scope.supplierFormData) {
    		if(typeof $scope.supplierFormData[key] == "object"){
    			tmpData.append( key , JSON.stringify($scope.supplierFormData[key]) );
    		}else{
    			tmpData.append( key , $scope.supplierFormData[key] );
    		}
    	};

    	tmpData.append( "statutory_registration_certificates" , $scope.statutory_registration_certificates );
    	tmpData.append( "cancelled_cheque" , $scope.cancelled_cheque );
    	tmpData.append( "quotation" , $scope.quotation );
    	tmpData.append( "agreements" , $scope.agreements );
    	tmpData.append( "vendor_profile" , $scope.vendor_profile );
    	tmpData.append( "other_doc" , $scope.other_doc );

    	common.asynCall({
			url: PATH_NAME+ APP_CONSTANT.CREATE_SUPPLIER,
			method:'post',
			param:  tmpData
		}).then( function(resVal){
			console.log("Create supplier==" , resVal)
			$("#mySuppModal").modal('hide');
			$scope.changeDashBody("supplier");
			common.hideLoader();
	    }, function(error){
	    	console.log(error);
	    });
    }

    //Submit Invoice form data
    $scope.InvoiceCreate = function(){
    	common.showLoader();
    	//invoice_attachment

    	var tmpData = new FormData();
    	for (var key in $scope.invoiceFormData) {
    		tmpData.append( key , $scope.invoiceFormData[key] );
    	};

    	tmpData.append( "invoice" , $scope.invoice );
    	tmpData.append( "PO" , $scope.PO );
    	tmpData.append( "other_doc" , $scope.other_doc );
    	
    	common.asynCall({
			url: PATH_NAME+ APP_CONSTANT.CREATE_INVOICE,
			method:'post',
			param:  tmpData
		}).then( function(resVal){
			console.log("Create Invoice==" , resVal)
			$("#myInvoiceModal").modal('hide');
			$scope.changeDashBody("invoice");
			common.hideLoader();
	    }, function(error){
	    	console.log(error);
	    });
    }

    $scope.changeDashBody = function(templateName){
		$scope.dashBody = allTemplates[ templateName ];

		$timeout(function(){
			if( templateName.indexOf('supplier') > -1 ){
				SupplierTemplateLoadData();	
			}else if( templateName.indexOf('invoice') > -1 ){
				InvoiceTemplateLoadData();
			}
			
		} , 300);
    }

    $scope.supplierList = [];
    function SupplierTemplateLoadData(){
    	common.showLoader();
    	common.asynCall({
			url: PATH_NAME+ APP_CONSTANT.GET_SUPPLIERS,
			method:'post'
		}).then( function(resVal){
			console.log("Get supplier==" , resVal)
			$scope.supplierList = resVal.data
			common.hideLoader();
	    }, function(error){
	    	console.log(error);
	    });
    }

	$scope.invoiceList = [];
    function InvoiceTemplateLoadData(){
    	common.showLoader();
    	common.asynCall({
			url: PATH_NAME+ APP_CONSTANT.GET_INVOICES,
			method:'post'
		}).then( function(resVal){
			console.log("Get Invoice==" , resVal)
			$scope.invoiceList = resVal.data
			common.hideLoader();
	    }, function(error){
	    	console.log(error);
	    });
    }

	//Init Templates
    $scope.changeDashBody("invoice");


    $scope.setFiles = function(element , str){
    	$scope[str] = element.files[0]
    }
}]);