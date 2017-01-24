var Notify = require('../models/notification').notify;

exports.notifyUser = function( tabs , data , callback){


	tabSpecificNotification(tabs , data ,function(notsData){

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
	Notify.findOneAndUpdate(query, updateData, {upsert:true}, function(err, doc){
		console.log("err" , err);
		console.log("doc" , doc);
	    if (err) return callback({ error: err } , null);
	    callback(null , doc)
	});
}

function tabSpecificNotification( tabs , data ,callback){

	switch(tabs) {
	    case "supplier":
	        supplierNoticeDataChanges(data , callback)
	        break;
	    case n:
	        //TODO
	        break;
	}

}

function supplierNoticeDataChanges(data, next){
	if(data){
		var noticeData = {
			sendTo : data.vendor_selection.selected_by, 
			orgId : data.orgId,
			sendBy : data.user_id,
			isViewed : false,
			viewDate : "",
			tabArea : "supplier",
			refKey : data._id,
			title : "PO Approval Request from " + data.userName,
			description : "You have Pending PO Approval Request from" + data.userName + ', against PO001.'
		}

		next(noticeData);
	}
}