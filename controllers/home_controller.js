module.exports = function(app){
	app.get('/home', function(request, response){
		console.log('in home_controller.js /home get');
		if(request.session.user_name == null || request.session.user_name == undefined)
		{
			response.status(403);
			response.redirect('/');
		}
		else
		{
			var home_model = require('../models/home_model.js');
			home_model(request, response);
			//response.render('../views/home', {user_name : request.session.user_name});
		}
	});
};