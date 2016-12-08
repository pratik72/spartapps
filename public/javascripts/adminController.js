var app = angular.module('spartapps', []);

app.controller('adminController', ['common' , '$scope',function(common , $scope) {
	var PATH_NAME = window.location.pathname
	$scope.isUserform = true;
	common.getAppData( PATH_NAME+'getAllOrgList').then( function(resVal){
		console.log("resVal==" , resVal)
		$scope.AllOrgsData= resVal.data;
    }, function(error){
    	console.log(error);
    });
}]);