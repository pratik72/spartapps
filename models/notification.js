var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var notifySchema = new Schema({
	sendTo : Schema.Types.ObjectId, 
	orgId : Schema.Types.ObjectId,
	sendBy : Schema.Types.ObjectId,
	refKey : Schema.Types.ObjectId,
	isViewed : Boolean,
	viewDate : Date,
	tabArea : String,
	title : String,
	description : String,
	join_date : {type: Date, default: Date.now}
});

var notify = mongoose.model('notification_mod' , notifySchema);

module.exports = {
	notify: notify
};