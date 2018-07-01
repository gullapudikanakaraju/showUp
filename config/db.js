var mongoose = require('mongoose');
var connec = mongoose.createConnection('mongodb://localhost:27017/b2dchat_db');

connec.on('error',function(error){
	console.log("error occurred while connecting to the database "+error);
});

connec.once('open',function(){
	console.log("connected to the database successfully !");
});

module.exports = connec;