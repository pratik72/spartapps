app.service('common',[ '$http',  function($http) {

	this.getAppData = function(url , param){
	    return $http({
	        method: "post",
	        url: url,
	        params: param
	    })
	}
}]);