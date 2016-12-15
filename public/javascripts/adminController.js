var app = angular.module('spartapps', []);

app.controller('adminController', ['common' , '$scope',function(common , $scope) {
	var PATH_NAME = APP_CONSTANT.PATH_NAME;
	var adminRights = {
		"Finance Head" : "Y0YY",
		"Regional Head" : "Y0Y0",
		"Data Entry Ops" : "YY00";
	}

	var userDetails = null;
	$scope.isUserform = true;
	$scope.userForm = [];
	$scope.orgModel = "";

	//This function returns all organizations
	common.asynCall({
		url: PATH_NAME + APP_CONSTANT.GET_ORG_LIST,
		method: 'post'
	}).then( function(resVal){
		$scope.AllOrgsData= resVal.data;
    }, function(error){
    	console.log(error);
    });

    $scope.submitSignUp = function(){
    	common.asynCall({
			url: PATH_NAME+ APP_CONSTANT.SUBMIT_USERDATA,
			method:'post',
			param: $scope.userForm
		}).then( function(resVal){
			console.log("Create User==" , resVal)
			if(resVal.data && resVal.data.OK){
				alert("Hurrey... \n\n"+resVal.data.OK);
			}
	    }, function(error){
	    	var servError = error.data.errors;
	    	var valMsg = "Failed.. \n\n User not created..!!";
	    	if(servError && servError.email){
	    		valMsg = servError.email.name + '\n\n' + servError.email.message;
	    	}

	    	alert( valMsg );
	    });
    }

    //This function used to update userForm data for organization
    $scope.orgUpdate = function(){
    	if($scope.orgModel){
    		var orgId = $scope.orgModel._id;
	    	var orgName = $scope.orgModel.orgName;
	    	$scope.userForm.organization = orgName;
	    	$scope.userForm.orgId = orgId;	
    	}    	
    }
}]);