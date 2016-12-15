var mongoose = require('mongoose');
var userService = require('../services/user-services');
var Schema = mongoose.Schema;

var userSchema = new Schema({
	firstName : {type:String, required: 'Please enter your first name'},
	lastName : String,
	email : {type:String, required: 'Please enter your email'},
	password : {type:String, required: 'Please enter your password.'},
	organization : {type:String, required: 'Please enter your organization.'},
	orgId : String,
	role : {type:String, required: 'Please enter your role.'},
	join_date : {type: Date, default: Date.now},
	subscriptionId : String
});

userSchema.path('email').validate(function(value , callback) {
	userService.findUser(value , function(error , user){
		if(error){
			console.log("Email validate" , error);
			return callback(false);
		}
		callback(!user)
	})
} , 'This email is already in use...!')

var User = mongoose.model('User' , userSchema);

module.exports = {
	User: User
};