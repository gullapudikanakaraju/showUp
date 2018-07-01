var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var connec = require('../config/db.js');

var socket_data_schema = new Schema({
    user_name :{
        type : String,
        required : true,
        trim : true,
        unique : true
    },
    socket_id :{
        type : String,
        required : true,
        trim : true,
        unique : true
    }
}); 


var socket_data_model = connec.model('socket_data', socket_data_schema);
module.exports = socket_data_model;