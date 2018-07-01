var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var connec = require('../config/db.js');

var dealer_schema = new Schema({
    user_name :{
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    email :{
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password :{
        type: String,
        required: true,
        trim: true
    },
    mobile :{
        type: String,
        required: false,
        trim: true
    },
    dealer_type :{
        type: String,
        enum: ['a','b','c'],
        default: null
    },
    posted_props :{
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'property',
        default: []
    },
    subscr_notification :{
        type: [Number],
        required: true
    },
    groups :{
        type: [String],
        default: []
    },
    created_at :{
        type: Date,
        default: new Date()
    },
    updated_at :{
        type: Date,
        default: new Date()
    }
}); 

var dealer_model = connec.model('dealer', dealer_schema);
module.exports = dealer_model;