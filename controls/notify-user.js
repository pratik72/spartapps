var Notify = require('../models/notification').notify;

exports.notifyUser = function( notfyObj , callback){


	tabSpecificNotification( notfyObj ,function(notsData){

	    var newNotify = new Notify(notsData);

		newNotify.save(function (err, product, numAffected) {
			if(err){
				console.log("newNotify" , err)
				return callback(err)
			}
			callback(null , product);
		})
	});
};

exports.getNotifications = function(data , callback){
	Notify.find( data , function(error, result){
		callback(error , result)
	})
}

exports.setNotificationsViewed = function(query , updateData , callback){
	Notify.findOneAndUpdate(query, updateData, {new: true} , function(err, doc){
	    if (err) return callback({ error: err } , null);
	    callback(null , doc)
	});
}

function tabSpecificNotification(tmpNotifyObj ,next){
	
	var data = tmpNotifyObj.data;
	if(data){

		var tabs = tmpNotifyObj.tabs;
		var notifyType = tmpNotifyObj.notifyType;
		var userData = tmpNotifyObj.userData;
		var userName = userData.firstName + " " +userData.lastName;

		var tmpSendTo = data.vendor_selection.selected_by;
		var tmpSendBy = userData._id;

		var tabAreaStr = "";

		notifyType = parseInt(notifyType);
		var tmpTitle = "" ,
			tmpStatus = null,
			tmpDesc = "";

		switch(tabs){
			case "supplier" : 
				tabAreaStr = tabs;
				tmpStatus = data.sa_status;
				break;
			case "purchaseOrd" : 
				tabAreaStr = "purchase order";
				tmpStatus = data.po_status;
				break;
			case "invoice" : 
				tabAreaStr = "payment intimation";
				tmpStatus = data.iv_status;
				break;
			case "pay_req" : 
				tabAreaStr = "audit";
				tmpStatus = data.pay_status;
		}
		
		tmpStatus = tmpStatus[ tmpStatus.length -1] .status;

		switch(notifyType){
			case 1 : //For Any Form createtion
				tmpTitle = "New " + tabAreaStr+" Approval Request from " + userName;
				tmpDesc = "You have Pending " + tabAreaStr+ "Approval Request from" + userName;
				break;
			case 2 : //For Any Form Update
				tmpTitle = "Update " + tabAreaStr+" Approval Request from " + userName;
				tmpDesc = "You have Pending " + tabAreaStr+ "Approval Request from" + userName;
				break;
			case 3 : //For Any Form Status Update
				tmpTitle = tabAreaStr+" Request " + tmpStatus + " by " + userName;
				tmpDesc = "Your " + tabAreaStr+ " Request " + tmpStatus + " by " + userName;
				tmpSendTo = data.user_id;
				break;
		}
		var noticeData = {
			sendTo : tmpSendTo, 
			notifyType : notifyType,
			orgId : data.orgId,
			sendBy : tmpSendBy,
			isViewed : false,
			viewDate : "",
			tabArea : tabs,
			refKey : data._id,
			title : tmpTitle,
			description : tmpDesc
		}

		next(noticeData);
	}
}