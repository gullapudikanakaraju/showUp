module.exports = function(app){
	app.get('/', function(request, response){
		console.log('in basic_controller.js / get');
		if(request.session.user_name == null || request.session.user_name == undefined)
		{
			response.status(200);
			response.render('../views/login', {message : undefined});
		}
		else
		{
			console.log('session data from express is ', request.session);
			response.status(403);
			response.redirect('/home');
		}
	});

	app.post('/', function(request, response){
		console.log('in basic_controller.js / post');
		var basic_model = require('../models/basic_model.js')();
		var data={};
		data.user_name= request.body.user_name;
		data.password= request.body.password;
		basic_model.login_check(data, request, response);
	});


	app.post('/register', function(request, response){
		console.log('in basic_controller.js /register post');
		var basic_model = require('../models/basic_model.js')();
		if(request.body.password == request.body.retype_password)
		{
			delete request.body.retype_password;
			console.log('data is ', request.body);
			basic_model.register(request, response);			
		}
		else
		{
			response.status(200);
			response.json({
				success: false,
				message: 'Password and Retype password fields donot match !'
			});
		}
	});

	app.get('/logout', function(request, response){
		console.log('in basic_controller.js /logout');
		if(request.session.user_name == null || request.session.user_name == undefined)
		{
			response.status(403);
			response.redirect('/');
		}
		else
		{
			var basic_model = require('../models/basic_model.js')();
			basic_model.logout(request, response);
		}
	});
};