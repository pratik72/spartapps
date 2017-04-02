var app = angular.module('spartapps', []);

app.controller('mainController', ['common' , '$rootScope','$scope' , '$timeout',function(common , $rootScope, $scope , $timeout) {
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

	$scope.orgDivision = ["Marketing","HR","Design","Procurement","Real Estate","Fianance" , "Operations"]
	$scope.orgLocation = ["HR BR","Electonic city","white field","Brigade"]

	common.init( $scope );

	$scope.statusForm = {
		updatedStatus : "",
		status_desc : ""
	};

	$scope.sidebar = allTemplates.sidebar;
	$scope.purchaseOrd = allTemplates.purchaseOrd;
	
	$scope.purchaseOrd_Model = allTemplates.purchaseOrdModel;

	$scope.supplier_Model = allTemplates.supplierModel;
	
	$scope.invoice_Model = allTemplates.invoiceModel;
	$scope.finance_Model = allTemplates.financeModel;

	$scope.initStatusData = APP_CONSTANT.STATUS_MODEL_JSON;
	$scope.allActivePOs = [];

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
	$scope.supplierFormData = angular.copy( APP_CONSTANT.SUPPLIER_JSON );
	$scope.invoiceFormData = angular.copy( APP_CONSTANT.INVOICE_JSON );
	$scope.poFormData = angular.copy( APP_CONSTANT.PO_JSON );
	$scope.payFormData = angular.copy( APP_CONSTANT.PAYREQ_JSON );

	$scope.isReadOnly = false;
	$scope.hasEditSupplier = false;

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

    $scope.selectedByChngUpdate = function(obj, comeFrom){
    	var tmpKey = FORM_MAPPING_KEY[ comeFrom ];
    	$scope[ tmpKey ].vendor_selection.selected_by = obj.selectedByUser._id || "";
    }

    $scope.openNotification = function(notData){
    	var tabs = notData.tabArea;
    	$scope.changeDashBody( tabs , function(){
    		var tmpKey = LIST_MAPPING_KEY[ tabs ];
	    	var thisSupp = $scope[tmpKey].filter(function(a){
	    		return a._id == notData.refKey; 
	    	});

	    	if(thisSupp.length > 0){
	    		openModelForm( tabs , thisSupp[0]);
	    		markNotificationAsView(notData);
	    	}else{
	    		alert("Notification reference not found..!")
	    	}
    	});
    	
    	//$scope.openSupplier();
    }

    function openModelForm(modelName , data) {
    	switch(modelName){
    		case "purchaseOrd" : 
    			$scope.openPurchaseOrd(data);
    			break;
    		case "supplier" : 
    			$scope.openSupplier(data);
    			break;
    		case "invoice" : 
    			$scope.openInvoice(data);
    			break;
    		case "pay_req" : 
    			$scope.openPrePayment(data);
    			break;
    	}
    }

	//Init All events
    $scope.openSupplier = function(suppDatas){
    	resetSupplierModel();
    	$scope.isReadOnly = false;
    	if(suppDatas){
    		$scope.isReadOnly = true;
    		$scope.supplierFormData = angular.copy(suppDatas);
			$scope.divisonModel = $scope.supplierFormData.vendor_selection.division;
			var selUser = $scope.notifyUser.filter(function(a){
				return $scope.supplierFormData.vendor_selection.selected_by == a._id
			});
			$scope.selectedByUser = selUser[0]
    	}
    	$("#mySuppModal").modal('show');
    	$('.main-panel').scrollTop(0);
    }

    $scope.openPurchaseOrd = function(poDatas){
    	resetPOModel();
    	$scope.isReadOnly = false;
    	if(poDatas){
    		$scope.isReadOnly = true;
    		$scope.poFormData = angular.copy(poDatas);
    		var selSuppObj = $scope.supplierForInvoice.filter(function(e){
    			return $scope.poFormData.supplierId == e._id
    		});
    		$scope.suppModel = selSuppObj[0];
			$scope.divisonModel = $scope.poFormData.vendor_selection.division;
			
			var selUser = $scope.notifyUser.filter(function(a){
				return $scope.poFormData.vendor_selection.selected_by == a._id
			});
			$scope.selectedByUser = selUser[0]

			$scope.locationModel = $scope.poFormData.budgets_and_approvals.location;
    	} 
    	$("#myPOModal").modal('show');
    	$('.main-panel').scrollTop(0);
    }

    $scope.openPrePayment = function(preData){
    	$("#myFinanceModal").modal('show');
    	TMP_PI_AMOUNT = 0;
    	$('.main-panel').scrollTop(0);

    	$scope.isReadOnly = false;
    	if(preData){
    		$scope.isReadOnly = true;

    		$scope.payFormData = angular.copy(preData);

    		var selPI = $scope.invoiceList.filter(function(a){
				return $scope.payFormData.product_information.PI_id == a._id
			});

			var selUser = $scope.notifyUser.filter(function(a){
				return $scope.payFormData.vendor_selection.selected_by == a._id
			});


			$scope.piModel = selPI[0];

			$scope.selectedByUser = selUser[0];
		    $scope.divisonModel = $scope.payFormData.vendor_selection.division;
    	}
    }


    $scope.supplierForInvoice = [];
    $scope.openInvoice = function(invData){
    	SupplierTemplateLoadData(function(){
    		$scope.isReadOnly = false;
	    	resetInvoiceModel();
	    	
	    	getAllActivePO(function(){
	    		$scope.supplierForInvoice = $scope.supplierList.filter(function(obj){
		    		return obj.sa_status.status == "Accept";
		    	});

		    	if(invData){
		    		$scope.isReadOnly = true;

		    		$scope.invoiceFormData = angular.copy(invData);
		    		$scope.invoiceFormData.isExpense = $scope.invoiceFormData.isExpense.toString();
		    		var tmpObj = $scope.supplierList.filter(function(obj){
		    			return obj._id == $scope.invoiceFormData.supplierId;
		    		})

		    		var tmpPoObj = $scope.allActivePOs.filter(function(obj){
		    			return obj._id == $scope.invoiceFormData.PO_id;
		    		})

		    		var selUser = $scope.notifyUser.filter(function(a){
						return $scope.supplierFormData.vendor_selection.selected_by == a._id
					});

					$scope.selectedByUser = selUser[0];
		    		$scope.ddPoModel = tmpPoObj[0];
		    		$scope.suppModel = tmpObj[0];
		    	}
	    		$("#myInvoiceModal").modal('show');
	    		$('.main-panel').scrollTop(0);
	    	});
    	})
    }

    $scope.calculatePoAmount = function(){
    	var strQuantity = $scope.poFormData.product_information.quantity;
    	var strRate = $scope.poFormData.product_information.rate;

    	var strVAT = $scope.poFormData.product_information.VAT;
    	var strCST = $scope.poFormData.product_information.CST;
    	var strGST = $scope.poFormData.product_information.GST;
    	var strServiceTax = $scope.poFormData.product_information.service_tax;
    	var strExcise = $scope.poFormData.product_information.excise;


    	var strAmount = parseFloat(strRate || 0 ) * parseFloat(strQuantity || 0);

    	strAmount += parseFloat(strVAT || 0);
    	strAmount += parseFloat(strCST || 0);
    	strAmount += parseFloat(strGST || 0);
    	strAmount += parseFloat(strServiceTax || 0);
    	strAmount += parseFloat(strExcise || 0);

    	$scope.poFormData.product_information.amount = strAmount.toFixed(2) || "0.00";
    }

    $scope.calculatePiAmount = function(){
    	var strQuantity = $scope.poFormData.product_information.quantity;
    	var strRate = $scope.poFormData.product_information.rate;

    	var strVAT = $scope.poFormData.product_information.VAT;
    	var strCST = $scope.poFormData.product_information.CST;
    	var strGST = $scope.poFormData.product_information.GST;
    	var strServiceTax = $scope.poFormData.product_information.service_tax;
    	var strExcise = $scope.poFormData.product_information.excise;


    	var strAmount = parseFloat( $scope.piModel.amount || 0 );

    	strAmount += parseFloat(strVAT || 0);
    	strAmount += parseFloat(strCST || 0);
    	strAmount += parseFloat(strGST || 0);
    	strAmount += parseFloat(strServiceTax || 0);
    	strAmount += parseFloat(strExcise || 0);

    	$scope.poFormData.product_information.amount = strAmount.toFixed(2) || "0.00";
    }

    $scope.calculatePayReqAmount = function(){

    	var strTDS_rate = $scope.payFormData.product_information.TDS_rate;
    	var strTDS_amnt = $scope.payFormData.product_information.TDS_amount;
    	var strPF_amount = $scope.payFormData.product_information.PF_amount;
    	var strECIS_amount = $scope.payFormData.product_information.ECIS_amount;
    	var strPT_amount = $scope.payFormData.product_information.PT_amount;
    	var strLoanEMI = $scope.payFormData.product_information.LoanEMI;
    	var strOtherDeductionAmount = $scope.payFormData.product_information.otherDeductionAmount;

    	var strAmount = parseFloat( TMP_PI_AMOUNT || 0 );

    	strAmount -= parseFloat(strTDS_rate || 0);
    	strAmount -= parseFloat(strTDS_amnt || 0);
    	strAmount -= parseFloat(strPF_amount || 0);
    	strAmount -= parseFloat(strECIS_amount || 0);
    	strAmount -= parseFloat(strPT_amount || 0);
    	strAmount -= parseFloat(strLoanEMI || 0);
    	strAmount -= parseFloat(strOtherDeductionAmount || 0);

    	$scope.payFormData.product_information.netAmount = strAmount.toFixed(2) || "0.00";
    }


    $scope.calculateInvAmount = function(){
    	var strQuantity = $scope.invoiceFormData.Quantity;
    	var strRate = $scope.invoiceFormData.Rate;
    	var strAddRate = $scope.invoiceFormData.additionalRate;    	

    	var strVAT = $scope.invoiceFormData.VAT;
    	var strCST = $scope.invoiceFormData.CST;
    	var strGST = $scope.invoiceFormData.GST;
    	var strServiceTax = $scope.invoiceFormData.service_tax;
    	var strExcise = $scope.invoiceFormData.excise;


    	var strAmount = parseFloat(strRate || 0 ) * parseFloat(strQuantity || 0);

    	strAmount += parseFloat(strAddRate || 0);
    	strAmount += parseFloat(strVAT || 0);
    	strAmount += parseFloat(strCST || 0);
    	strAmount += parseFloat(strGST || 0);
    	strAmount += parseFloat(strServiceTax || 0);
    	strAmount += parseFloat(strExcise || 0);

    	$scope.invoiceFormData.amount = strAmount.toFixed(2) || "0.00";
    }

    function getAllActivePO(callback){
    	common.showLoader();
    	common.asynCall({
			url: PATH_NAME + APP_CONSTANT.GET_ALL_PO,
			method: 'post'
		}).then( function(resVal){
			$scope.allActivePOs = resVal.data;
			callback();
			common.hideLoader();
	    }, function(error){
	    	console.log(error);
	    });
    }

    $scope.enableToEdit = function(){
    	$scope.isReadOnly = false;
    	$scope.hasEditSupplier = true;
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
			url: PATH_NAME + APP_CONSTANT.SET_MARK_AS_VIEW_NOTIFY,
			method: 'post',
			param : sendKeys
		}).then( function(resVal){
			getNotifications();
	    }, function(error){
	    	console.log(error);
	    });
    }

    var MODEL_ID_MAP = {
    	purchaseOrd : "myPOModal",
    	invoice : "myInvoiceModal",
    	supplier : "mySuppModal"
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
			$("#"+ MODEL_ID_MAP[ tempStatus.action ] ).modal('hide');
			$scope.changeDashBody( tempStatus.action );
			common.hideLoader();
	    }, function(error){
	    	console.log(error);
	    });
    }

    //Submit supplier form data
    $scope.supplierCreate = function(){
    	common.showLoader();

    	var suppURL = APP_CONSTANT.CREATE_SUPPLIER;

    	var tmpData = new FormData();
    	for (var key in $scope.supplierFormData) {
    		if(typeof $scope.supplierFormData[key] == "object"){
    			tmpData.append( key , JSON.stringify($scope.supplierFormData[key]) );
    		}else{
    			tmpData.append( key , $scope.supplierFormData[key] );
    		}
    	};

    	tmpData.append( "statutory_registration_certificates" , $scope.statutory_registration_certificates );
    	tmpData.append( "agreements" , $scope.agreements );
    	tmpData.append( "vendor_profile" , $scope.vendor_profile );
    	tmpData.append( "other_doc" , $scope.other_doc );

    	if($scope.hasEditSupplier){
    		suppURL += '?action=1';
    		$scope.hasEditSupplier = false;
    	}

    	common.asynCall({
			url: PATH_NAME+ suppURL,
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

    $scope.resetSearch = function(){
    	InvoiceTemplateLoadData();
    }

    $scope.searchText = ""
    $scope.searchTab = function(obj , tabs){

    	var sendKeys = new FormData();
    	sendKeys.append( "searchText" , obj.searchText );
    	sendKeys.append( "searchModel" , obj.searchModel );
    	
    	common.asynCall({
			url: PATH_NAME + APP_CONSTANT.SEARCH_TAB,
			method: 'post',
			param : sendKeys
		}).then( function(resVal){
			$scope.invoiceList = resVal.data;
	    }, function(error){
	    	console.log(error);
	    	alert("Data Not found")
	    });
    }


    //Submit po form data
    $scope.poCreate = function(){
    	common.showLoader();

    	var tmpData = new FormData();
    	for (var key in $scope.poFormData) {
    		if(typeof $scope.poFormData[key] == "object"){
    			tmpData.append( key , JSON.stringify($scope.poFormData[key]) );
    		}else{
    			tmpData.append( key , $scope.poFormData[key] );
    		}
    	};

    	tmpData.append( "cancelled_cheque" , $scope.cancelled_cheque );
    	tmpData.append( "quotation" , $scope.quotation );
    	tmpData.append( "other_doc" , $scope.other_doc );

    	common.asynCall({
			url: PATH_NAME+ APP_CONSTANT.CREATE_PO,
			method:'post',
			param:  tmpData
		}).then( function(resVal){
			$("#myPOModal").modal('hide');
			$scope.changeDashBody("purchaseOrd");
			common.hideLoader();
	    }, function(error){
	    	console.log(error);
	    });
    }

    var FORM_MAPPING_KEY = {
    	po : "poFormData",
    	invoice : "invoiceFormData",
    	supplier : "supplierFormData",
    	finance : "payFormData"
    }

    var LIST_MAPPING_KEY = {
    	purchaseOrd : "poList",
    	invoice : "invoiceList",
    	supplier : "supplierList",
    	pay_req : "payReqList"
    }

    var TMP_BACKUP = {};
    function customSelectOnChange(e , tabs){
    	switch(tabs){
    		case "invoice" :
    			if( !TMP_BACKUP["allActivePOs"] ){
    				TMP_BACKUP["allActivePOs"] = $scope.allActivePOs;
    			}

    			if(e.suppModel){
					$scope.allActivePOs = $scope.allActivePOs.filter(function(obj){
						return obj.supplierId == e.suppModel._id
					});
    			}else{
    				$scope.allActivePOs = TMP_BACKUP["allActivePOs"];
    			}
    			break;
    	}
    }

    $scope.suppModel = "";
    $scope.suppChngUpdate = function(e , comeFrom){
    	if(e.suppModel){
			var supplierName = e.suppModel.supplier_name_address.supplier_name;
			var supplierId = e.suppModel._id;
			var tmpKey = FORM_MAPPING_KEY[ comeFrom ];

			$scope[ tmpKey ].supplier_name = supplierName;
    		$scope[ tmpKey ].supplierId = supplierId;

    	}
    	customSelectOnChange(e, comeFrom);
    }

    $scope.ddPoModel = "";
    $scope.invPoChngUpdate = function(e , comeFrom){
    	if(e.ddPoModel){
			var poNumber = e.ddPoModel.PO_number;
			var poId = e.ddPoModel._id;
			var tmpKey = FORM_MAPPING_KEY[ comeFrom ];

			$scope[ tmpKey ].PO_number = poNumber;
    		$scope[ tmpKey ].PO_id = poId;

    		$scope[ tmpKey ].Quantity = e.ddPoModel.product_information.quantity;
    		$scope[ tmpKey ].Rate = e.ddPoModel.product_information.rate;

    		$scope[ tmpKey ].HSN_Code = e.ddPoModel.product_information.HSN_Code;
    		$scope[ tmpKey ].Product_Nature = e.ddPoModel.product_information.product_discreption;

    	}
    }

    $scope.divisonChngUpdate = function(e , comeFrom){
    	if(e.divisonModel){
    		var tmpKey = FORM_MAPPING_KEY[ comeFrom ];
			$scope[ tmpKey ].vendor_selection.division = e.divisonModel;
    	}
    }

    $scope.locationChngUpdate = function(e , comeFrom){
    	if(e.locationModel){
    		var tmpKey = FORM_MAPPING_KEY[ comeFrom ];
    		$scope[ tmpKey ].budgets_and_approvals.location = e.locationModel;
    	}
    }

    var TMP_PI_AMOUNT = 0;
    $scope.PiChngUpdate = function(e , comeFrom){
    	if(e.piModel){
    		var tmpKey = FORM_MAPPING_KEY[ comeFrom ];
    		TMP_PI_AMOUNT = e.piModel.amount;
    		
    		$scope[ tmpKey ].product_information.act_amount = TMP_PI_AMOUNT;
    		$scope[ tmpKey ].product_information.PI_number = e.piModel.inv_no;
			$scope[ tmpKey ].product_information.PI_id = e.piModel._id;
			$scope[ tmpKey ].product_information.PO_id = e.piModel.PO_id;
			$scope[ tmpKey ].product_information.PO_number = e.piModel.PO_number;

			$scope.calculatePayReqAmount();
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

    $scope.prePaymentCreate = function(){
    	common.showLoader();

    	var tmpData = new FormData();
    	for (var key in $scope.payFormData) {
    		if(typeof $scope.payFormData[key] == "object"){
    			tmpData.append( key , JSON.stringify($scope.payFormData[key]) );
    		}else{
    			tmpData.append( key , $scope.payFormData[key] );
    		}
    	};

    	tmpData.append( "other_doc" , $scope.other_doc );
    	
    	common.asynCall({
			url: PATH_NAME+ APP_CONSTANT.CREATE_PAYREQ,
			method:'post',
			param:  tmpData
		}).then( function(resVal){
			$("#myFinanceModal").modal('hide');
			$scope.changeDashBody("finance");
			common.hideLoader();
	    }, function(error){
	    	console.log(error);
	    });
    }

    $scope.downloadReports = function(){
        common.asynCall({
            url: PATH_NAME+ '/downloadRepors',
            method:'post'   
        }).then( function(resVal){
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
			}else if( templateName.indexOf('purchaseOrd') > -1 ){
				POTemplateLoadData( callback );
			}else if( templateName.indexOf('pay_req') > -1 ){
				FMTemplateLoadData( callback );
			}else if( templateName.indexOf('reports') > -1 ){
                FMTemplateLoadData( callback );
            }
			
		} , 300);
    }

    $scope.payReqList = [];
    function FMTemplateLoadData(callback){
    	InvoiceTemplateLoadData(function(){
    		$scope.piModel = "";
    		$scope.invoiceList = $scope.invoiceList.filter(function(obj){
	    		return obj.iv_status.status == "Accept";
	    	});
    	});

    	common.showLoader();
    	common.asynCall({
			url: PATH_NAME+ APP_CONSTANT.GET_PAYREQUEST,
			method:'post'
		}).then( function(resVal){
			$scope.payReqList = resVal.data
			if(callback){
				callback();
			}
			common.hideLoader();
	    }, function(error){
	    	console.log(error);
	    });
    }

    $scope.supplierList = [];
    $scope.piModel = "";

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


    $scope.poList = [];
    function POTemplateLoadData(callback){
    	common.showLoader();

		SupplierTemplateLoadData(function(){
    		$scope.supplierForInvoice = $scope.supplierList.filter(function(obj){
	    		return obj.sa_status.status == "Accept";
	    	});
    	});
    	
    	common.asynCall({
			url: PATH_NAME+ APP_CONSTANT.GET_POLIST,
			method:'post'
		}).then( function(resVal){
			$scope.poList = resVal.data
			if(callback){
				callback();
			}
			common.hideLoader();
	    }, function(error){
	    	console.log(error);
	    });
    }

    $scope.searchAttrChange = function(obj , tabs){
    	console.log(obj)
    }

    $scope.searchAttr = angular.copy(APP_CONSTANT.INV_SEARCH_KEY);
	$scope.invoiceList = [];
    function InvoiceTemplateLoadData(callback){
    	common.showLoader();
    	common.asynCall({
			url: PATH_NAME+ APP_CONSTANT.GET_INVOICES,
			method:'post'
		}).then( function(resVal){
			$scope.invoiceList = resVal.data;
			$scope.searchAttr = angular.copy(APP_CONSTANT.INV_SEARCH_KEY);
			if(callback){
				callback();
			}
			common.hideLoader();
	    }, function(error){
	    	console.log(error);
	    });
    }

    $scope.copyAndCreateNewPO = function(){
    	$scope.isReadOnly = false;
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
		$scope.selectedByUser = "";
		$scope.divisonModel = "";
    	
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

    	$scope.invoiceFormData.isExpense = angular.copy( APP_CONSTANT.INVOICE_JSON ).isExpense;
	    $scope.ddPoModel = "";
    	if(!modelScope){
	    	$scope.invoice = "";
	    	$scope.PO = "";
	    	$scope.other_doc = "";
    	}
    }

    function resetPOModel(modelScope){
    	var tmpModelScope = modelScope || $scope.poFormData;
    	for (var key in tmpModelScope) {
    		if(typeof tmpModelScope[key] == "object"){
    			resetInvoiceModel( tmpModelScope[key] )
    		}else{
    			tmpModelScope[key] = "";
    		}
    	};

    	$scope.poFormData.product_information.poCategory = angular.copy( APP_CONSTANT.PO_JSON ).product_information.poCategory;
	    $scope.divisonModel = "";
	    $scope.selectedByUser = "";
	    $scope.suppModel = "";
    	if(!modelScope){
	    	$scope.cancelled_cheque = "";
	    	$scope.quotation = "";
	    	$scope.other_doc = "";
    	}
    }
}]);