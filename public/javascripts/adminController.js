var app = angular.module('spartapps', []);

app.controller('adminController', ['common' , '$scope',function(common , $scope) {
	var PATH_NAME = APP_CONSTANT.PATH_NAME;
	var adminRights = {
		"Finance Head" : "Y0YY",
		"Regional Head" : "Y0Y0",
		"Data Entry Ops" : "YY00"
	}

	$scope.AllUserRoles = APP_CONSTANT.USER_ROLES

	var userDetails = null;
	$scope.isUserform = true;
	$scope.userForm = APP_CONSTANT.USER_JSON;
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
    	console.log($scope.userForm)

    	var tmpData = new FormData();
    	for (var key in $scope.userForm) {
    		tmpData.append( key , $scope.userForm[key] );
    	};
    	
    	common.asynCall({
			url: PATH_NAME+ APP_CONSTANT.SUBMIT_USERDATA,
			method:'post',
			param: tmpData
		}).then( function(resVal){
			console.log("Create User==" , resVal)
			if(resVal.data && resVal.data.OK){
				alert("Hurrey... \n\n"+resVal.data.OK);
				$scope.userForm = APP_CONSTANT.USER_JSON;
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

    //This function used to update userForm data for roles
    $scope.roleUpdate = function(){
    	if($scope.userRole){
	    	var roleName = $scope.userRole.name;
	    	$scope.userForm.role = roleName;
    	}    	
    }
}]);