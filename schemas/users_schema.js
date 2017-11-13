var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var con = mongoose.createConnection('localhost:27017/showup');
var users_schema = new Schema({
	_id :{
        type : Number,
        required : true,
        unique : true,
        trim : true
	},
    user_name :{
    	type: String,
    	required: true,
    	trim : true
    },
    password :{
    	type: String,
    	required: true,
    	trim : true
    },
    groups :{
        type : [{
            _id : {
                type : Number,
                required : true,
                trim : true,
                unique : true
            },
            group_name :{
                type : String,
                required : true,
                trim : true
            },
            joined_on :{
                type : String,
                required : true,
                trim : true
            }
        }],
        default : []
    },
    created_at :{
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

var users_model = con.model('user', users_schema);
module.exports = users_model;