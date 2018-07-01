module.exports= function(app){
	app.get('/localities/:city', function(request, response){
		console.log('in locality_controller.js /localities/:city post');
		// if(request.session.email != null && request.session.member == 'buyer')
		// {
			var locality_model= require('../models/locality_model.js');
			locality_model(request.params.city, request, response);
		// }	
		// else
		// {
		// 	response.status(200);
		// 	response.json({
		// 		success: false,
		// 		message: 'invalid user !'
		// 	});
		// }
	});
};