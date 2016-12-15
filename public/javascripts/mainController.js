var app = angular.module('spartapps', []);

app.controller('mainController', ['common' , '$scope',function(common , $scope) {
	var PATH_NAME = APP_CONSTANT.PATH_NAME;
	var adminRights = {
		"Finance Head" : "Y0YY",
		"Regional Head" : "Y0Y0",
		"Data Entry Ops" : "YY00"
	}

	$scope.dashBody = "dashboard.html"
	$scope.userDetails = "";
	$scope.permissions = {
		"CreateSupplier" : "" ,
		"CreateInvoiceReq" : "",
		"ApprvInvoiceReq" : "",
		"ApprvFinanceReq" : ""
	}
	//To get Current User Details
	common.asynCall({
		url: PATH_NAME + "/userDetails",
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

		console.log("$scope.permissions" , $scope.permissions)
    }, function(error){
    	console.log(error);
    });

}]);