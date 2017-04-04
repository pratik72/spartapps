app.controller('admUserController', function($scope , common) {

	common.init($scope);
    
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


    $scope.openUserMod = function(userData){
    	resetUserMod();
    	$scope.isReadOnly = false;
    	if(userData){
    		$scope.isReadOnly = true;
    		$scope.userForm = angular.copy(userData);
			var selOrg = $scope.AllOrgsData.filter(function(a){
				return $scope.userForm.orgId == a._id
			});

			var selUsrRole = $scope.AllUserRoles.filter(function(a){
				return $scope.userForm.role == a.name
			});
			
			$scope.orgModel = selOrg[0];
			$scope.userRole = selUsrRole[0];
    	}

    	$("#userCreateModal").modal('show');

    }

    function resetUserMod(modelScope){
    	var tmpModelScope = modelScope || $scope.userForm;
    	for (var key in tmpModelScope) {
    		if(typeof tmpModelScope[key] == "object"){
    			resetUserMod( tmpModelScope[key] )
    		}else{
    			tmpModelScope[key] = "";
    		}
    	};

    	if(!modelScope){
	    	$scope.orgModel = "";
			$scope.userRole = "";
    	}
    }
});