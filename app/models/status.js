var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var StatusSchema = new Schema({

	creator: { type: Schema.Types.ObjectId, ref: 'User' },
	content: String,
	created: { type: Date, default: Date.now },
	classify: String

});

module.exports = mongoose.model('Status', StatusSchema);