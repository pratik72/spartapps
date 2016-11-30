module.exports = function(){
	var passport = require('passport');
	var passportLocal = require('passport-local');
	var userServices = require('../services/user-services');

	passport.use( new passportLocal.Strategy( {usernameField: 'email'}, function(email, password , callback){
		userServices.findUser(email , function(err , user){
			console.log("Auth error" , err , user)
			if(err){
				return callback(err);
			}
			if(!user || user.password !== password){
				return callback(null , null);
			}
			callback(null , user);
		})
	}));

	passport.serializeUser(function(user, callback){
		callback(null , user.email);
	})

	passport.deserializeUser(function(email , callback){
		userServices.findUser( email , function(error , user){
			callback(error , user);
		});
	});
}