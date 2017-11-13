var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var con = mongoose.createConnection('localhost:27017/showup');
var socket_data_schema = new Schema({
	_id :{
        type : Number,
        required : true,
        unique : true,
        trim : true
	},
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

con.on('error',function(error){
	console.log("error occurred while connecting to the database "+error);
});

con.once('open',function(){
	console.log("connected to the database successfully !");
});

var socket_data_model = con.model('socket_data', socket_data_schema);
module.exports = socket_data_model;