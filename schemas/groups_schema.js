var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var con = mongoose.createConnection('localhost:27017/showup');
var groups_schema = new Schema({
	_id :{
        type : Number,
        required : true,
        unique : true,
        trim : true
	},
    group_name :{
    	type: String,
    	required: true,
    	trim : true
    },
    messages :{
        type : [{
            _id :{
                type : Number,
                required : true,
                trim : true
            },
            from :{
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
        }],
        default : []
    },
    members :{
        type : [{
            _id :{
                type : Number,
                required : true,
                trim : true
            },
            member_name :{
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
    created_by :{
        type : String,
        required : true,
        trim : true
    },
    created_on :{
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

var groups_model = con.model('group', groups_schema);
module.exports = groups_model;