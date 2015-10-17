var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var autoIncrement = require('mongoose-auto-increment');

var connection = mongoose.createConnection("mongodb://localhost/test1");

autoIncrement.initialize(connection);


var EventsSchema = new Schema({

	creator: { type: Schema.Types.ObjectId, ref: 'User'},
	title: String,
	info: String,
	start: Date,
	end: Date,
	allDay: Boolean
	
});



EventsSchema.plugin(autoIncrement.plugin, 'Events');

module.exports = connection.model('Events', EventsSchema);