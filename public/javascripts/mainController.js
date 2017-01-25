var app = angular.module('spartapps', []);

app.controller('mainController', ['common' , '$scope' , '$timeout',function(common , $scope , $timeout) {
	var PATH_NAME = APP_CONSTANT.PATH_NAME;
	var allTemplates = APP_CONSTANT.TEMPLATES;
	var adminRights = {
		"CEO" : "YYYYY",
		"CFO" : "YYYYY",
		"COO" : "YYYYY",
		"Admin" : "YYYYY",
		"Finance Head" : "Y0YY0",
		"Regional Head" : "Y0Y0Y",
		"Centre Head" : "Y0Y0Y",
		"Finance Controller" : "Y0Y0Y",
		"Account Manager" : "Y0Y0Y",
		"National Head" : "Y0Y0Y",
		"Data Entry Ops" : "YY000"
	}

	$scope.orgDivision = ["Marketing","HR","Design","Procurement","Real Estate","Fianance"]
	$scope.orgLocation = ["HR BR","Electonic city","white field","Brigade"]

	common.init( $scope );

	$scope.statusForm = {
		updatedStatus : "",
		status_desc : ""
	};

	$scope.supplier_Model = allTemplates.supplierModel;
	
	$scope.invoice_Model = allTemplates.invoiceModel;

	$scope.initStatusData = APP_CONSTANT.STATUS_MODEL_JSON;

	//Init all Scopes
	$scope.userDetails = "";
	$scope.permissions = {
		"CreateSupplier" : "" ,
		"CreateInvoiceReq" : "",
		"ApprvInvoiceReq" : "",
		"ApprvFinanceReq" : "",
		"ApprvSupplierReq" : ""
	};
	
	//Init Form data of madel
	$scope.supplierFormData = APP_CONSTANT.SUPPLIER_JSON;
	$scope.invoiceFormData = APP_CONSTANT.INVOICE_JSON;
	$scope.isReadOnly = false;

	//Init To get Current User Details on load
	common.asynCall({
		url: PATH_NAME + APP_CONSTANT.GET_CURRENT_USR,
		method: 'post'
	}).then( function(resVal){
		$scope.userDetails= resVal.data;
		var rightsValue = adminRights[$scope.userDetails.role];
		if(rightsValue){
			rightsValue = rightsValue.split('');
			var tmpIndex = 0;
			var tmpValue = null;
			for (var key in $scope.permissions) {
				tmpValue = rightsValue[ tmpIndex ];
				$scope.permissions[key] = isNaN(parseInt(tmpValue)) ? true : false;
				tmpIndex++;
			};
		}
    }, function(error){
    	console.log(error);
    });

	//notificationDetails
	getNotifications();

    function getNotifications(){
    	$scope.notifications = [];
		common.asynCall({
			url: PATH_NAME + "/notifictionDetails",
			method: 'post'
		}).then( function(resVal){
			$scope.notifications = resVal.data;
	    }, function(error){
	    	console.log(error);
	    });	
    }
	
	//distUserDetails
	$scope.notifyUser = [];
	common.asynCall({
		url: PATH_NAME + "/distUserDetails",
		method: 'post'
	}).then( function(resVal){
		$scope.notifyUser = resVal.data;
    }, function(error){
    	console.log(error);
    });

    $scope.selectedByChngUpdate = function(obj){
    	$scope.supplierFormData.vendor_selection.selected_by = obj.selectedByUser._id || "";
    }

    $scope.openNotification = function(notData){
    	var tabs = notData.tabArea;
    	$scope.changeDashBody( tabs , function(){
	    	var thisSupp = $scope.supplierList.filter(function(a){
	    		return a._id == notData.refKey; 
	    	});

	    	if(thisSupp.length > 0){
	    		$scope.openSupplier(thisSupp[0]);
	    		markNotificationAsView(notData);
	    	}else{
	    		alert("Notification reference not found..!")
	    	}
    	});
    	
    	//$scope.openSupplier();
    }

	//Init All events
    $scope.openSupplier = function(suppDatas){
    	resetSupplierModel();
    	$scope.isReadOnly = false;
    	if(suppDatas){
    		$scope.isReadOnly = true;
    		$scope.supplierFormData = angular.copy(suppDatas);
			$scope.divisonModel = $scope.supplierFormData.vendor_selection.division;
			$scope.locationModel = $scope.supplierFormData.budgets_and_approvals.location;
    	}    	
    	$("#mySuppModal").modal('show');
    }

    $scope.supplierForInvoice = [];
    $scope.openInvoice = function(invData){
    	SupplierTemplateLoadData(function(){
    		$scope.isReadOnly = false;
	    	resetInvoiceModel();
	    	$scope.supplierForInvoice = $scope.supplierList.filter(function(obj){
	    		return obj.sa_status.status == "Accept";
	    	});
	    	if(invData){
	    		$scope.isReadOnly = true;

	    		$scope.invoiceFormData = angular.copy(invData);

	    		var tmpObj = $scope.supplierList.filter(function(obj){
	    			return obj._id == $scope.invoiceFormData.supplierId;
	    		})

	    		$scope.suppModel = tmpObj[0]
	    	}
	    	$("#myInvoiceModal").modal('show');	
    	})
    }

    $scope.openStatusModel = function(action , row , statusVal){
    	if($scope.permissions.ApprvSupplierReq){
    		$scope.initStatusData.action = action;
	    	$scope.initStatusData.row = row;
	    	$scope.initStatusData.fieldSet = APP_CONSTANT.SUPPLIER_JSON.sa_status;

	    	$scope.statusForm.updatedStatus = statusVal || "";
	    	$scope.statusForm.status_desc = "";
	    	$("#statusModal").modal('show');
    	}else{
    		alert("You dont have permission to change Status")
    	}
    }

    function markNotificationAsView(notsData){
    	var sendKeys = new FormData();    	
    	sendKeys.append( "primKey" , notsData._id );
    	
    	common.asynCall({
			url: PATH_NAME + "/markNotificationAsViewed",
			method: 'post',
			param : sendKeys
		}).then( function(resVal){
			getNotifications();			
	    }, function(error){
	    	console.log(error);
	    });
    }

    $scope.statusChangeSubmit = function(){
    	common.showLoader();

    	var tempStatus = $scope.initStatusData;
    	var actUrl = PATH_NAME+ APP_CONSTANT.STATUS_CHANGE_URL +'?action='+tempStatus.action;
    	var tmpArray = {};

    	tempStatus.fieldSet.status = $scope.statusForm.updatedStatus;
    	tempStatus.fieldSet.status_description = $scope.statusForm.status_desc;
    	tempStatus.fieldSet.status_changedBy = $scope.userDetails._id;
    	tempStatus.fieldSet.status_changeDate = new Date();
    	
    	var tmpFormData = new FormData();    	
    	tmpFormData.append( "status" , JSON.stringify(tempStatus.fieldSet) );
    	tmpFormData.append( "rowId" , tempStatus.row._id );

    	common.asynCall({
			url: actUrl,
			method:'post',
			param:  tmpFormData
		}).then( function(resVal){
			$("#statusModal").modal('hide');
			$("#mySuppModal").modal('hide');
			$scope.changeDashBody( tempStatus.action );
			common.hideLoader();
	    }, function(error){
	    	console.log(error);
	    });
    }

    //Submit supplier form data
    $scope.supplierCreate = function(){
    	common.showLoader();

    	var tmpData = new FormData();
    	for (var key in $scope.supplierFormData) {
    		if(typeof $scope.supplierFormData[key] == "object"){
    			tmpData.append( key , JSON.stringify($scope.supplierFormData[key]) );
    		}else{
    			tmpData.append( key , $scope.supplierFormData[key] );
    		}
    	};

    	tmpData.append( "statutory_registration_certificates" , $scope.statutory_registration_certificates );
    	tmpData.append( "cancelled_cheque" , $scope.cancelled_cheque );
    	tmpData.append( "quotation" , $scope.quotation );
    	tmpData.append( "agreements" , $scope.agreements );
    	tmpData.append( "vendor_profile" , $scope.vendor_profile );
    	tmpData.append( "other_doc" , $scope.other_doc );

    	common.asynCall({
			url: PATH_NAME+ APP_CONSTANT.CREATE_SUPPLIER,
			method:'post',
			param:  tmpData
		}).then( function(resVal){
			$("#mySuppModal").modal('hide');
			$scope.changeDashBody("supplier");
			common.hideLoader();
	    }, function(error){
	    	console.log(error);
	    });
    }

    $scope.suppModel = "";
    $scope.suppChngUpdate = function(e){
    	if(e.suppModel){
			var supplierName = e.suppModel.supplier_name_address.supplier_name;
			var supplierId = e.suppModel._id;
    		$scope.invoiceFormData.supplier_name = supplierName;
    		$scope.invoiceFormData.supplierId = supplierId;
    	}
    }

    $scope.divisonChngUpdate = function(e){
    	if(e.divisonModel){
			$scope.supplierFormData.vendor_selection.division = e.divisonModel;
    	}
    }

    $scope.locationChngUpdate = function(e){
    	if(e.locationModel){
			$scope.supplierFormData.budgets_and_approvals.location = e.locationModel;
    	}
    }

    //Submit Invoice form data
    $scope.InvoiceCreate = function(){
    	common.showLoader();

    	//invoice_attachment

    	var tmpData = new FormData();
    	for (var key in $scope.invoiceFormData) {
    		if(typeof $scope.invoiceFormData[key] == "object"){
    			tmpData.append( key , JSON.stringify($scope.invoiceFormData[key]) );
    		}else{
    			tmpData.append( key , $scope.invoiceFormData[key] );
    		}
    	};

    	tmpData.append( "invoice" , $scope.invoice );
    	tmpData.append( "PO" , $scope.PO );
    	tmpData.append( "other_doc" , $scope.other_doc );
    	
    	common.asynCall({
			url: PATH_NAME+ APP_CONSTANT.CREATE_INVOICE,
			method:'post',
			param:  tmpData
		}).then( function(resVal){
			$("#myInvoiceModal").modal('hide');
			$scope.changeDashBody("invoice");
			common.hideLoader();
	    }, function(error){
	    	console.log(error);
	    });
    }

    $scope.changeDashBody = function(templateName , callback){
		$scope.dashBody = allTemplates[ templateName ];

		$timeout(function(){
			if( templateName.indexOf('supplier') > -1 ){
				SupplierTemplateLoadData( callback );	
			}else if( templateName.indexOf('invoice') > -1 ){
				InvoiceTemplateLoadData( callback );
			}
			
		} , 300);
    }

    $scope.supplierList = [];
    function SupplierTemplateLoadData(callback){
    	common.showLoader();
    	common.asynCall({
			url: PATH_NAME+ APP_CONSTANT.GET_SUPPLIERS,
			method:'post'
		}).then( function(resVal){
			$scope.supplierList = resVal.data
			if(callback){
				callback();
			}
			common.hideLoader();
	    }, function(error){
	    	console.log(error);
	    });
    }

	$scope.invoiceList = [];
    function InvoiceTemplateLoadData(){
    	common.showLoader();
    	common.asynCall({
			url: PATH_NAME+ APP_CONSTANT.GET_INVOICES,
			method:'post'
		}).then( function(resVal){
			$scope.invoiceList = resVal.data
			common.hideLoader();
	    }, function(error){
	    	console.log(error);
	    });
    }

	//Init Templates
    $scope.changeDashBody("invoice");


    $scope.setFiles = function(element , str){
    	$scope[str] = element.files[0]
    }

    function resetSupplierModel(modelScope){
    	var tmpModelScope = modelScope || $scope.supplierFormData;
    	for (var key in tmpModelScope) {
    		if(typeof tmpModelScope[key] == "object"){
    			resetSupplierModel( tmpModelScope[key] )
    		}else{
    			tmpModelScope[key] = "";
    		}
    	};

    	if(!modelScope){
	    	$scope.statutory_registration_certificates = "";
	    	$scope.cancelled_cheque = "";
	    	$scope.quotation = "";
	    	$scope.agreements = "";
	    	$scope.vendor_profile = "";
	    	$scope.other_doc = "";
    	}
    }

    function resetInvoiceModel(modelScope){
    	var tmpModelScope = modelScope || $scope.invoiceFormData;
    	for (var key in tmpModelScope) {
    		if(typeof tmpModelScope[key] == "object"){
    			resetInvoiceModel( tmpModelScope[key] )
    		}else{
    			tmpModelScope[key] = "";
    		}
    	};

    	if(!modelScope){
	    	$scope.invoice = "";
	    	$scope.PO = "";
	    	$scope.other_doc = "";
    	}
    }
}]);