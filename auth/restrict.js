module.exports = function( req, res , callback){
	if( req.isAuthenticated() ){
		return callback();
	}
	res.redirect('/');
}