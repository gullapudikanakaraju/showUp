module.exports = function(request, response){
	console.log('in home_model.js');
	var users_model;

	if(request.session.member == 'dealer')
	{
		var dealer_model= require('../schemas/dealer_schema.js');
		dealer_model.findOne({user_name : request.session.user_name}, {_id : 0, groups : 1}, function(error, result){
			if(error)
			{
				console.log('error occurred while fetching the groups of the user ', error);
				response.status(500);
				response.send('Some internal error occurred!\nPlease go back and try again later.');
			}
			else
			{
				console.log('result is ', result);
				if(result.groups.length == 0)
				{
					response.status(200);
					// if(request.session.member == 'dealer')
					response.render('../views/home_dealer', {user_name : request.session.user_name, my_groups_names: []});
					// if(request.session.member == 'buyer')
					// 	response.render('../views/home_buyer', {user_name : request.session.user_name, my_groups_names: []});
				}
				else
				{
					var my_groups = result.groups;
					// for(var i=0; i<result.groups.length; i++)
					// {
					// 	my_groups.push(result.groups[i]);
					// }
					console.log('my_groups is ', my_groups);
					request.session.my_groups = my_groups;
					
					response.status(200);
					console.log({user_name : request.session.user_name, my_groups_names : my_groups});

					if(request.session.member == 'dealer')
						response.render('../views/home_dealer', {user_name : request.session.user_name, my_groups_names : my_groups});
				}
			}
		});
	}

	if(request.session.member == 'buyer')
	{
		var group_model= require('../schemas/groups_schema.js');
		group_model.find({}, {_id : 0, group_name : 1, city: 1, locality: 1}, function(error, result){
			if(error)
			{
				console.log('error occurred while fetching all groups ', error);
				response.status(500);
				response.send('Some internal error occurred!\nPlease go back and try again later.');
			}
			else
			{
				console.log('result is ', result);
				if(result.length == 0)
				{
					response.status(200);
					response.render('../views/home_buyer', {user_name : request.session.user_name, my_groups_names: []});
				}
				else
				{
					var my_groups = [];
					for(var i=0; i<result.length; i++)
					{
						my_groups.push(result[i].group_name);
					}
					console.log('my_groups is ', my_groups);
					request.session.my_groups = my_groups;
					
					response.status(200);
					console.log({user_name : request.session.user_name, my_groups_names : my_groups});

					response.render('../views/home_buyer', {user_name : request.session.user_name, my_groups_names : my_groups});
				}
			}
		});
	}
	
};