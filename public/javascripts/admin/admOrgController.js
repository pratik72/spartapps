app.controller('admOrgController', function($scope , common) {
    
    var PATH_NAME = APP_CONSTANT.PATH_NAME;
    $scope.orgcreate_Model = "templates/admin/orgCreateModel.html";
    $scope.AllUserRoles = APP_CONSTANT.USER_ROLES;
    $scope.userForm = APP_CONSTANT.USER_JSON;
    $scope.orgModel = "";

    LoadOrgList()

    //This function returns all organizations
	function LoadOrgList(){
		common.asynCall({
			url: PATH_NAME + APP_CONSTANT.GET_ORG_LIST,
			method: 'post'
		}).then( function(resVal){
			$scope.AllOrgsData= resVal.data;
	    }, function(error){
	    	console.log(error);
	    });
	}

	$scope.submitOrgSignUp = function(){

	}


	$scope.openOrgMod = function(orgData){
    	resetOrgMod();
    	$scope.isReadOnly = false;
    	if(orgData){
    		return;//return because we did not provice org EDIT
    		$scope.isReadOnly = true;
    		$scope.userForm = angular.copy(orgData);
			var selOrg = $scope.AllOrgsData.filter(function(a){
				return $scope.userForm.orgId == a._id
			});

			var selUsrRole = $scope.AllUserRoles.filter(function(a){
				return $scope.userForm.role == a.name
			});
			
			$scope.orgModel = selOrg[0];
			$scope.userRole = selUsrRole[0];
    	}

    	$("#orgCreateModal").modal('show');

    }

    function resetOrgMod(modelScope){
    	/*var tmpModelScope = modelScope || $scope.userForm;
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
    	}*/
    }

});