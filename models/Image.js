var mongoose = require('mongoose');

var ImageSchema = mongoose.Schema({
	path: {
		type: String,
		index:true
	},
	imagetype: {
		type: String
	},
	_artist: {
		type: Number,
    ref: 'User'
	}
});

var Image = mongoose.model('Image', ImageSchema);
