var mongoose = require('mongoose'), Schema = mongoose.Schema;

var PaintingSchema = mongoose.Schema({
	imagepath: {
		type: String,
		index:true
	},
	title: {
			type: String,
			index:true
	},
	description: {
				type: String
	},
	price: {
				type: Number
	},
	quantity: {
				type: Number
	},
	available: {
				type: Boolean
	},
	artistid: {
		type: Schema.Types.ObjectId,
    ref: 'User'
	}
});

var Painting = module.exports = mongoose.model('Painting', PaintingSchema);

module.exports.createPainting = function(newPainting, callback){
	        newPainting.save(callback);
};

module.exports.deletePainting = function(Painting, callback){
	        newPainting.remove(callback);
};

module.exports.getPainting = function(paintingid, callback){
				
				var painting =	Painting.find({_id: paintingid}).exec(function (err, image) {
			    if (err) return handleError(err);
			    // var imagepaths = [];
			    // image.forEach(function(i){
			    //   imagepaths.push(i.path);
			    // });
			    callback(image);
			  });

};
//
// module.exports.getUsersImages = function(idpassed, callback){
//   mypic = Image.find({artistid: idpassed}).exec(function (err, image) {
//     if (err) return handleError(err);
//     var imagepaths = [];
//     image.forEach(function(i){
//       imagepaths.push(i.path);
//     });
//     callback(imagepaths);
//   });
//
// };
