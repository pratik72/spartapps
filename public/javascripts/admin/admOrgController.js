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

	$scope.openOrgMod = function(){
		$('#orgCreateModal').modal('show');
	}

});