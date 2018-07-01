module.exports= function(request, response){
	console.log('in prop_model.js');
	var prop_model= require('../schemas/property_schema.js');
	var data= request.body;
	data.posted_by= request.session._id;
	prop_model.create(data, function(error, result){
		if(error)
		{
			console.log('some internal error occurred while creating a prop ', error);
			response.status(500);
			response.json({
				success: false,
				message: 'some internal error occurred !'
			});
		}
		else
		{
			console.log('prop created successfully !', result);
			var groups_model= require('../schemas/groups_schema.js');

			groups_model.findOne({city: result.city, locality: result.locality}, function(e1, r1){
				if(e1)
				{
					console.log('error occurred ', e1);
					response.json({
						success: false,
						message: 'some internal error occurred !'
					});
				}
				else
				{
					var async= require('async');
					if(r1 != null)
					{
						console.log('adding to the chat room !');
						async.parallel({
							update_dealers_collection : function(callback)
							{
								var dealer_model = require('../schemas/dealer_schema.js');
								var y= {};
								y.group_name= r1.group_name;
								dealer_model.update({email : request.session.email }, { $push : {groups : y}}, callback);
							},
							update_groups_collection : function(callback)
							{
								var groups_model = require('../schemas/groups_schema.js');
								var x= {};
								x.member_name= request.session.user_name;
								x.member_id= request.session._id;
								groups_model.findOneAndUpdate({group_name : r1.group_name}, { $push : {members : x}}, callback);
							}
						}, function(e2, r2){
							if(error)
							{
								console.log('error occurred ', e2);
								response.json({
									success: false,
									message: 'some internal error occurred !'
								});
							}
							else
							{
								console.log('added successfully to the chat room ');
								response.status(200);
								response.json({
									success: true,
									message: 'prop created and added to room successfully'
								});
							}
						});
					}
					else
					{
						console.log('no chat room found, creating one !');
						var y= {};
						var members= [];
						members.push({
							member_id: request.session._id,
							member_name: request.session.user_name
						});
						
						console.log('members are ', members);
						y.group_name= Date.now().toString();
						y.city= result.city;
						y.locality= result.locality;
						y.members= members;
						y.created_by= request.session._id;
						console.log('y is ', y);
					
						var async= require('async');
						async.parallel({
							create_chatroom: function(callback){
								var groups_model = require('../schemas/groups_schema.js');
								groups_model.create(y, callback);
							},
							update_dealers_collection: function(callback){
								var dealer_model = require('../schemas/dealer_schema.js');
								dealer_model.update({email : request.session.email }, { $push : {groups : y.group_name}}, callback);
							}
						}, function(e3, r3){
							if(e3)
							{
								console.log('error occurred ', e3);
								response.json({
									success: false,
									message: 'some internal error occurred !'
								});
							}
							else
							{
								console.log('prop added and room created successfully !');
								response.status(200);
								response.json({
									success: true,
									message: 'prop created and room created successfully !'
								});
							}
						});
					}
				}
			});
		}
	});
};