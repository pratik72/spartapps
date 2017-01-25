app.controller('admUserController', function($scope , common) {
    
    var PATH_NAME = APP_CONSTANT.PATH_NAME;
    $scope.usrcreate_Model = "templates/admin/userCreateModel.html";
    $scope.AllUserRoles = APP_CONSTANT.USER_ROLES;
    $scope.userForm = APP_CONSTANT.USER_JSON;
    $scope.orgModel = "";

    LoadUserList()

    //This function returns all organizations
	common.asynCall({
		url: PATH_NAME + APP_CONSTANT.GET_ORG_LIST,
		method: 'post'
	}).then( function(resVal){
		$scope.AllOrgsData= resVal.data;
    }, function(error){
    	console.log(error);
    });

	function LoadUserList(){
		common.asynCall({
			url: PATH_NAME + APP_CONSTANT.GET_USER_LIST,
			method: 'post'
		}).then( function(resVal){
			$scope.AllUsersData= resVal.data;
		}, function(error){
			console.log(error);
		});
	}

    $scope.submitSignUp = function(){
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
				$("#userCreateModal").modal('hide');
				LoadUserList()
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
    $scope.orgUpdate = function(scpModel){
    	if(scpModel.orgModel){
    		var orgId = scpModel.orgModel._id;
	    	var orgName = scpModel.orgModel.orgName;
	    	$scope.userForm.organization = orgName;
	    	$scope.userForm.orgId = orgId;	
    	}    	
    }

    //This function used to update userForm data for roles
    $scope.roleUpdate = function(scpModel){
    	if(scpModel.userRole){
	    	var roleName = scpModel.userRole.name;
	    	$scope.userForm.role = roleName;
    	}    	
    }


    $scope.openUserMod = function(){
    	$("#userCreateModal").modal('show');
    }
});