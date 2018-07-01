var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var connec = require('../config/db.js');

var property_schema = new Schema({
    city :{
        type: String,
        required: true,
        trim: true
    },
    locality :{
        type: String,
        required: true,
        trim: true
    },
    posted_by :{
        type: String,
        required: true,
        trim: true
    },
    prop_info :{
        type: {
            price: {
                type: Number,
                required: true
            },
            facilities: {
                type: [String],
                required: false,
                default: []
            }
        }
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

var property_model = connec.model('property', property_schema);
module.exports = property_model;