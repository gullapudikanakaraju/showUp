module.exports= function(city, request, response){
	console.log('in locality_model.js ');
	var locality_model= require('../schemas/property_schema.js');
	locality_model.aggregate([{
		"$match": {
			"city": city
		}
	},
	{
		"$group":
         {
           "_id": { "city": "$city"},
           localities: { $addToSet: "$locality" }
         }
	}], function(error, result){
		if(error)
		{
			console.log('some internal error occurred while fetching the localities ', error);
			response.status(500);
			response.json({
				success: false,
				message: "some internal error occurred !"
			});
		}
		else
		{
			if(result.length == 0)
			{
				console.log('no localities available ');
				response.status(200);
				response.json({
					success: false,
					message: 'no localities found !'
				});
			}
			else
			{
				console.log('localities are ', result);
				response.status(200);
				response.json({
					success: true,
					localities: result
				});
			}
		}
	});
};