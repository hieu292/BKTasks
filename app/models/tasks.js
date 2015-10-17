var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var autoIncrement = require('mongoose-auto-increment');

var connection = mongoose.createConnection("mongodb://localhost/test1");

autoIncrement.initialize(connection);

var TasksSchema = new Schema({
	creator: { type: Schema.Types.ObjectId, ref: 'User'},
	nameTask: String,
	status: {type: Boolean, default: false, required: true},
	priority: {type: Number, min: 1, max: 4, required: true},
	describe: {type: String, default: '', required: true},
	startTime: { type: Date, default: Date.now, required: true },
	endTime: { type: Date, default: Date.now, required: true },
	completed: {type: Boolean, default: false, required: true},
	timeSub: {type: Number, min: 0, max: 60, default: 25, required: true},
	interrupt: {type: Number, default: 0, required: true},
	workTime: {type: Number, default: 0, required: true},
	progress: {type: Number, min: 0, max: 100, default: 0, required: true}


});

TasksSchema.plugin(autoIncrement.plugin, 'Tasks');

module.exports = connection.model('Tasks', TasksSchema);
