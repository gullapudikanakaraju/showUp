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
		basic_model.login_check(request.body, request, response);
	});

	app.get('/register', function(request, response){
		console.log('in basic_controller.js /register get');
		if(request.session.user_name == null || request.session.user_name == undefined)
		{
			response.status(200);
			response.render('../views/register', {message : undefined});
		}
		else
		{
			response.status(403);
			response.redirect('/home');
		}
	});

	app.post('/register', function(request, response){
		console.log('in basic_controller.js /register post');
		var basic_model = require('../models/basic_model.js')();
		var data = {};
		if(request.body.password == request.body.retype_password)
		{
			data.user_name = request.body.user_name;
			data.password = request.body.password;
			data._id = new Date().getTime();
			data.created_at = new Date();
			console.log('data is ', data);
			basic_model.register(data, request, response);			
		}
		else
		{
			response.status(200);
			response.render('../views/register', {message : 'Password and Retype password fields donot match !'});
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