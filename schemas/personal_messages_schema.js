var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var connec = require('../config/db.js');

var messages_schema = new Schema({
	_id :{
        type : Number,
        required : true,
        unique : true,
        trim : true
	},
    from :{
        type : String,
        required : true,
        trim : true
    },
    to :{
        type : String,
        required : true,
        trim : true
    },
    message_content :{
        type : String,
        required : true,
        trim : true
    },
    sent_at :{
        type : String,
        required : true,
        trim : true
    }
}); 

var messages_model = connec.model('message', messages_schema);
module.exports = messages_model;