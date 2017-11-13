module.exports = function(request, response){
	console.log('in home_model.js');
	var users_model = require('../schemas/users_schema.js');
	users_model.findOne({user_name : request.session.user_name}, {_id : 0, groups : 1}, function(error, result){
		if(error)
		{
			console.log('error occurred while fetching the groups of the user ', error);
			response.status(500);
			response.send('Some internal error occurred!\nPlease go back and try again later.');
		}
		else
		{
			console.log('result is ', result);
			if(result.length == 0)
			{
				response.status(200);
				response.render('../views/home', {user_name : request.session.user_name});
			}
			else
			{
				var my_groups = [];
				for(var i=0; i<result.groups.length; i++)
				{
					my_groups.push(result.groups[i].group_name);
				}
				console.log('my_groups is ', my_groups);
				request.session.my_groups = my_groups;
				var groups_model = require('../schemas/groups_schema.js');
				groups_model.find({group_name : {$nin :my_groups}}, {_id : 0, group_name : 1}, function(err, res){
					if(err)
					{
						console.log('error occurred while fetching other groups ', err);
						response.status(500);
						response.send('Some internal error occurred!\nPlease go back and try again later.');
					}
					else
					{
						console.log('res is ', res);
						var other_groups = [];
						for(var i=0; i<res.length; i++)
						{
							other_groups.push(res[i].group_name);
						}
						console.log('other groups are ', other_groups);
						response.status(200);
						console.log({user_name : request.session.user_name, my_groups_names : my_groups, other_groups_names : other_groups});
						response.render('../views/home', {user_name : request.session.user_name, my_groups_names : my_groups, other_groups_names : other_groups});
					}
				});
			}
		}
	});
};