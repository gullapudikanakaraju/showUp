module.exports= function(app){
	// app.get('/props', function(request, response){
	// 	console.log('in basic_controller.js /props get');
	// 	if(request.session.email == null || request.session.email == undefined)
	// 	{
	// 		response.status(200);
	// 		response.json({
	// 			success: false,
	// 			message: 'invalid user !'
	// 		});
	// 	}
	// 	else
	// 	{
	// 		var prop_model= require('../models/prop_model.js');
	// 		prop_model(request, response);
	// 	}
	// });

	app.post('/props', function(request, response){
		console.log('in prop_controller.js /props post');
		if(request.session.user_name != null && request.session.member == 'dealer')
		{
			var property_model= require('../models/property_model.js');
			property_model(request, response);
		}	
		else
		{
			response.status(200);
			response.json({
				success: false,
				message: 'invalid user !'
			});
		}
	});
};