var multer  = require('multer');

var storage = multer.diskStorage({
    destination: function (request, file, callback) {
        callback(null, './public/upload');
    },
    filename: function (request, file, callback) {
        callback(null, file.fieldname + '_' + Date.now() +'_'+ file.originalname)
    }
});

exports.uploadFiles = function(req , res , filename , callback){
	var upload = multer({ storage: storage }).any();

	upload(req , res , function(error){
		if(error){
			callback(error)
		}
		callback();
	});
}