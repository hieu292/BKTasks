var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var DatasetSchema = new Schema({
    comment: String,
    classify: String

});

module.exports = mongoose.model('Dataset', DatasetSchema);