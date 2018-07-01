var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var connec = require('../config/db.js');

var groups_schema = new Schema({
    group_name :{
    	type: String,
    	required: true,
    	trim : true,
        unique: true
    },
    city :{
        type: String,
        required: true
    },
    locality :{
        type: String,
        required: true
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
            member_name :{
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
        type : Date,
        default: new Date()
    }
}); 

groups_schema.index({city: 1, locality: 1}, {unique: true});

var groups_model = connec.model('group', groups_schema);
module.exports = groups_model;