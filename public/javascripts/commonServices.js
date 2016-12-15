app.service('common',[ '$http',  function($http) {

	this.asynCall = function(_subData){
	    return $http({
	        method: _subData.method,
	        url: _subData.url,
	        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			transformRequest: function(obj) {
			    var str = [];
			    for(var p in obj)
			    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
			    return str.join("&");
			},
	        data: _subData.param
	    })
	}
}]);