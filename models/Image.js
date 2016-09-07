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

module.exports.getUsersImages = function(idpassed, callback){
  mypic = Image.find({artistid: idpassed}).exec(function (err, image) {
    if (err) return handleError(err);
    var imagepaths = [];
    image.forEach(function(i){
      imagepaths.push(i.path);
    });
    callback(imagepaths);
  });

};
