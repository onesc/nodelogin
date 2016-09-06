var mongoose = require('mongoose'), Schema = mongoose.Schema;

var ImageSchema = mongoose.Schema({
	path: {
		type: String,
		index:true
	},
	imagetype: {
		type: String
	},
	artistid: {
		type: Schema.Types.ObjectId,
    ref: 'User'
	}
});

var Image = module.exports = mongoose.model('Image', ImageSchema);

module.exports.createImage = function(newImage, callback){
	        newImage.save(callback);
};

// artid = db.images.find()[3].artistid
// db.users.find({_id: artid})
