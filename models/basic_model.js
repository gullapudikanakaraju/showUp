module.exports = function(){
	return {
		login_check : function(data, request, response){
			console.log('in basic_model.js login_check()');
			var users_model = require('../schemas/users_schema.js');
			users_model.findOne({user_name : data.user_name}, function(error, result){
				if(error)
				{
					console.log('some error occurred while retrieving the username from the database ', error);
					response.status(500);
					response.send('Some internal error occurred...\nPlease go back and try again later.');
				}
				else
				{
					if(result == null)
					{
						console.log('No such User');
						response.render('../views/login', {message : 'No such User !'});
					}
					else
					{
						var hashed_password = result.password;
						var bcrypt = require('bcryptjs');
						bcrypt.compare(data.password, hashed_password, function(err, x){
							if(x == true)
							{
								console.log('login successful ');
								request.session.user_name = data.user_name;
								response.redirect('/home');
							}
							else
							{
								console.log('Invalid password');
								response.render('../views/login', {message : 'Invalid Password !'});
							}
						});
					}
				}
			});
		},

		register : function(data, request, response){
			console.log('in basic_model.js register()');
			console.log('data in model is ', data);
			var users_model = require('../schemas/users_schema.js');
			users_model.findOne({user_name : data.user_name}, function(error, result){
				if(error)
				{
					console.log('some error occurred while checking for the existence of the user_name ', error);
					response.status(500);
					response.render('../views/register', {message : 'Some Internal error occurred !'});
				}
				else
				{
					if(result == null)
					{
						var bcrypt = require('bcryptjs');
						bcrypt.hash(data.password, 10, function(err, hash){
							if(err)
							{
								console.log('some error occurred while generating the hash ', err);
								response.status(500);
								response.render('../views/register', {message : 'Some Internal error occurred !'});
							}
							else
							{
								data.password = hash;
								users_model.create(data, function(e, r){
									if(e)
									{
										console.log('some error occurred while inserting the document ', error);
										response.status(500);
										response.render('../views/register', {message : 'Some Internal error occurred !'});
									}
									else
									{
										console.log('registration successful');
										request.session.user_name = data.user_name;
										response.status(200);
										response.redirect('/home');
									}
								});
							}
						});
					}
					else
					{
						console.log('Username already exists !');
						response.status(200);
						response.render('../views/register', {message : 'Username already exists !'});
					}
				}
			});	
		},

		logout : function(request, response){
			var socket_data_model = require('../schemas/socket_data_schema.js');
			socket_data_model.remove({user_name : request.session.user_name}, function(error, result){
				if(error)
					throw error;
				else
				{
					console.log('successfully removed the documet from the device_datas database', result);
					request.session.destroy();
					response.status(200);
					response.redirect('/');
				}
			});
		}
	};
};