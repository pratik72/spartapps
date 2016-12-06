var app = angular.module('spartapps', []);
app.controller('mainController', function($scope) {

	$scope.dashBody = "dashboard.html"
    $scope.openCreateUser = function(){
    	alert('Call openCreateUser')
    }

    $scope.openCreateOrg = function(){
    	alert('Call openCreateOrg')
    }
});