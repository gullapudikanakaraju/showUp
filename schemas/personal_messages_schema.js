var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var con = mongoose.createConnection('localhost:27017/showup');
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

con.on('error',function(error){
	console.log("error occurred while connecting to the database "+error);
});

con.once('open',function(){
	console.log("connected to the database successfully !");
});

var messages_model = con.model('message', messages_schema);
module.exports = messages_model;