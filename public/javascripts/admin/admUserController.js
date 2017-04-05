app.controller('admUserController', function($scope , common , $window , $route ,$rootScope) {

	common.init($scope);
    
    var PATH_NAME = APP_CONSTANT.PATH_NAME;
    $scope.usrcreate_Model = "templates/admin/userCreateModel.html";
    $scope.AllUserRoles = APP_CONSTANT.USER_ROLES;
    $scope.userForm = angular.copy(APP_CONSTANT.USER_JSON);

    LoadUserList()

    //This function returns all organizations
	common.asynCall({
		url: PATH_NAME + APP_CONSTANT.GET_ORG_LIST,
		method: 'post'
	}).then( function(resVal){
		$scope.AllOrgsData= resVal.data;
		$("#userCreateModal").modal('hide');
    }, function(error){
    	console.log(error);
    });

	function LoadUserList(){
		common.asynCall({
			url: PATH_NAME + APP_CONSTANT.GET_USER_LIST,
			method: 'post'
		}).then( function(resVal){
			$scope.AllUsersData= resVal.data;
			$("#userCreateModal").modal('show');
			
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
			if(resVal.data && resVal.data.OK){
				alert("Hurrey... \n\n"+resVal.data.OK);
				
				$scope.userForm = angular.copy(APP_CONSTANT.USER_JSON);
				$("#userCreateModal").modal('hide');

				$route.reload();
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
    	if(this.orgModel){
    		var orgId = this.orgModel._id;
	    	var orgName = this.orgModel.orgName;
	    	$scope.userForm.organization = orgName;
	    	$scope.userForm.orgId = orgId;	
    	}    	
    }

    //This function used to update userForm data for roles
    $scope.roleUpdate = function(){
    	if(this.userRole){
	    	var roleName = this.userRole.name;
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
			
			this.orgModel = selOrg[0];
			this.userRole = selUsrRole[0];
    	}

    	$("#userCreateModal").modal('show');

    	if(!userData){
    		$('#userCreateModal form')[0].reset()
    	}
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

	    this.orgModel = new Object();
		this.userRole = new Object();

    }
});