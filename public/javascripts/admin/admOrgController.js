app.controller('admOrgController', function($scope , common) {

    common.init($scope);
    
    var PATH_NAME = APP_CONSTANT.PATH_NAME;
    $scope.orgcreate_Model = "templates/admin/orgCreateModel.html";
    $scope.AllUserRoles = APP_CONSTANT.USER_ROLES;
    $scope.userForm = APP_CONSTANT.USER_JSON;
    $scope.orgFormData = angular.copy( APP_CONSTANT.ORG_JSON );
    $scope.orgModel = "";

    LoadOrgList()

    //This function returns all organizations
	function LoadOrgList(){
        common.showLoader();
		common.asynCall({
			url: PATH_NAME + APP_CONSTANT.GET_ORG_LIST,
			method: 'post'
		}).then( function(resVal){
			$scope.AllOrgsData= resVal.data;
            common.hideLoader();
	    }, function(error){
            common.hideLoader();
	    	console.log(error);
	    });
	}

	$scope.submitOrgCreate = function(){
        common.showLoader();

        var tmpData = new FormData();
        for (var key in $scope.orgFormData) {
            tmpData.append( key , $scope.orgFormData[key] );
        };
        
        common.asynCall({
            url: PATH_NAME+ APP_CONSTANT.SUBMIT_ORGDATA,
            method:'post',
            param: tmpData
        }).then( function(resVal){
            if(resVal.data && resVal.data.OK){
                alert("Hurrey... \n\n"+resVal.data.OK);
                $scope.orgFormData = angular.copy( APP_CONSTANT.ORG_JSON );
                common.hideLoader();
                $("#orgCreateModal").modal('hide');
                LoadOrgList()

            }
        }, function(error){
            var servError = error.data.errors;
            var valMsg = "Failed.. \n\n Organizations not created..!!";
            if(servError && servError.email){
                valMsg = servError.email.name + '\n\n' + servError.email.message;
            }

            alert( valMsg );
            common.hideLoader();
        });
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