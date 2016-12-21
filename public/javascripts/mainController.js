var app = angular.module('spartapps', []);

app.controller('mainController', ['common' , '$scope',function(common , $scope) {
	var PATH_NAME = APP_CONSTANT.PATH_NAME;
	var allTemplates = APP_CONSTANT.TEMPLATES;
	var adminRights = {
		"Finance Head" : "Y0YY",
		"Regional Head" : "Y0Y0",
		"Data Entry Ops" : "YY00"
	}

	common.init( $scope );

	//Init Templates
	$scope.dashBody = allTemplates.invoice;//supplier template display on load
	$scope.supplier_Model = allTemplates.supplierModel;


	//Init all Scopes
	$scope.userDetails = "";
	$scope.permissions = {
		"CreateSupplier" : "" ,
		"CreateInvoiceReq" : "",
		"ApprvInvoiceReq" : "",
		"ApprvFinanceReq" : ""
	};
	$scope.supplierFormData = APP_CONSTANT.SUPPLIER_JSON;


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
    	$("#myModal").modal('show');
    }


    //Submit supplier form data
    $scope.supplierCreate = function(){
    	common.showLoader();
    	var tmpData = [];
    	for (var key in $scope.supplierFormData) {
    		tmpData[key] = JSON.stringify( $scope.supplierFormData[key])
    	};
    	common.asynCall({
			url: PATH_NAME+ APP_CONSTANT.CREATE_SUPPLIER,
			method:'post',
			param:  tmpData
		}).then( function(resVal){
			console.log("Create User==" , resVal)
			$("#myModal").hide();
			common.hideLoader();
	    }, function(error){
	    	console.log(error);
	    });
    }

    $scope.changeDashBody = function(templateName){
		$scope.dashBody = allTemplates[ templateName ];
    }

}]);