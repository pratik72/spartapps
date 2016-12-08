var User = require('../models/users').User;

exports.addUser = function(userData , callback){
	console.log("==== services call ====" , userData)
	var newUser = new User({
		firstName : userData.firstName,
		lastName : userData.lastName,
		email : userData.email.toLowerCase(),
		organization : userData.organization,
		password : userData.password,
		role : userData.role,
		subscriptionId : '1'//userData.subscriptionId
	});

	newUser.save(function (err, product, numAffected) {
		if(err){
			console.log("newUser" , err)
			return callback(err)
		}
		callback(null);
	})
};

exports.findUser = function(email, callback){
	User.findOne({email : email.toLowerCase()} , function(error, user){
		console.log("findUser" , error)
		callback(error , user)
	})
}