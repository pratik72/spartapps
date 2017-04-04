app.config(function($interpolateProvider) {
	$interpolateProvider.startSymbol("{%");
	return $interpolateProvider.endSymbol("%}");
});

app.service('common',[ '$http' , '$timeout', function($http , $timeout) {

	var objAjaxLoader = null;

	this.init = function(scope){
		scope.ajaxloader = APP_CONSTANT.TEMPLATES.ajaxloader;
		scope.status_Model = APP_CONSTANT.TEMPLATES.statusModel;

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
            transformRequest: angular.identity,

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
		objAjaxLoader = $('#ajaxLoader');
		objAjaxLoader.show();
	}

	this.hideLoader = function(){
		objAjaxLoader = $('#ajaxLoader');
		objAjaxLoader.hide();
	}

	this.formatDate = function(date , format){
		var parseDates = new Date(date);
		switch(format){
			case "dd/mm/yyyy" :
				return parseDates.getDate() + "/" + (parseDates.getMonth()+1) + '/'+ parseDates.getFullYear();
				break;
		}
	}
}]);