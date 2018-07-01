var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var connec = require('../config/db.js');

var buyer_schema = new Schema({
    user_name :{
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password :{
        type: String,
        required: true,
        trim: true
    },
    created_at :{
        type: Date,
        default: Date.now
    },
    updated_at :{
        type: Date,
        default: Date.now
    }
}); 

var buyer_model = connec.model('buyer', buyer_schema);
module.exports = buyer_model;