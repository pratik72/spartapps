app.service('common',[ '$http' , '$timeout', function($http , $timeout) {

	var objAjaxLoader = null;

	this.init = function(scope){
		scope.ajaxloader = APP_CONSTANT.TEMPLATES.ajaxloader;

		$timeout(function(){
			objAjaxLoader = $('#ajaxLoader');
			objAjaxLoader.hide();
		} , 150);
	}

	this.asynCall = function(_subData){
	    return $http({
	        method: _subData.method,
	        url: _subData.url,
	        headers: { 'Content-Type': undefined },
            //transformRequest: angular.identity,

	        //headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			/*transformRequest: function(obj) {
			    var str = [];
			    for(var p in obj)
			    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
			    return str.join("&");
			},*/
	        data: _subData.param
	    })
	}

	this.showLoader = function(){
		objAjaxLoader.show();
	}

	this.hideLoader = function(){
		objAjaxLoader.hide();
	}
}]);