var User = require('../models/users').User;

exports.addUser = function(userData , callback){
	var newUser = new User({
		firstName : userData.firstName,
		lastName : userData.lastName,
		email : userData.email.toLowerCase(),
		organization : userData.organization,
		orgId : userData.orgId,
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
	});
};

exports.findUser = function(email, callback){
	User.findOne({email : email.toLowerCase()} , function(error, user){
		callback(error , user)
	})
}

exports.findAllUsers = function(searchQuery, callback){
	User.find( searchQuery , function(error, user){
		callback(error , user)
	})
}