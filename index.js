var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var async = require('async');
var path = require('path');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var socket = require('socket.io');
var sharedSession = require('express-socket.io-session');

var app = express();

app.set('port', process.env.PORT || 8787);
var server = app.listen(app.get('port'), function(err){
	if(err)
	{
		console.log('some error occurred while listening on port ', app.get('port'));
	}
	else
	{
		console.log('server listening on port ', app.get('port'));
	}
});

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname,'/public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.use(cookieParser());

 var session1 = session({
	secret : 'raju',
	resave : false,
	saveUninitialized : false,
	cookie : {
		httpOnly : true,
		maxAge : 1*60*60*1000
	},
	rolling : true,
	store : new MongoStore({
		url : 'mongodb://localhost:27017/showup'
	})
});
app.use(session1);

var io = socket();
io.listen(5555);
io.use(sharedSession(session1));


require('./controllers/basic_controller.js')(app);

require('./controllers/home_controller.js')(app);

require('./controllers/property_controller.js')(app);

io.on('connection', function(socket){
	console.log('one connection established ', socket.id);
	socket.handshake.session.socket_id = socket.id;
	socket.handshake.session.save();
	var rooms = socket.handshake.session.my_groups;
	console.log('rooms are ', rooms);
	for(var i=0; i<rooms.length; i++)
	{
		socket.join(rooms[i]);
		console.log(socket.id, ' joined the room ', rooms[i]);
	}

	var socket_data_model = require('./schemas/socket_data_schema.js');
	var data = {};
	data.user_name = socket.handshake.session.user_name;
	data.socket_id = socket.id;
	socket_data_model.findOne({user_name : data.user_name}, function(error, result){
		if(error)
			throw error;
		else
		{
			if(result == null)
			{
				socket_data_model.create(data, function(error, result){
					if(error)
						throw error;
					else
						console.log('successfully inserted user_name and socket_id in the database ', result);
				});
			}
			else
			{
				socket_data_model.update({user_name : data.user_name}, {socket_id : data.socket_id}, function(err, res){
					if(err)
						throw err;
					else
						console.log('successfully updated socket_id in the database ', res);
				});
			}
		}
	});
	console.log('socket id from session data is ', socket.handshake.session.socket_id);
	console.log('session data from socket is ', socket.handshake.session.user_name);

	socket.broadcast.emit('joiningMessage', {user_name : socket.handshake.session.user_name});

	socket.on('getOnlinePeople', function(){
		io.clients(function(error, clients){
			if(error)
				throw error;
			else
			{
				console.log('clients are ', clients);
				var pos = clients.indexOf(socket.handshake.session.socket_id);
				console.log('position is ', pos);
				clients.splice(pos, 1);
				//console.log('clients are ', x);

				console.log('clients are ', clients);
				var socket_data_model = require('./schemas/socket_data_schema.js');
				socket_data_model.find({socket_id : {$in : clients}}, {_id : 0, __v : 0, socket_id : 0}, function(e, res){
					if(e)
						throw e;
					else
					{
						socket.emit('onlinePeople', res);
					}
				});
			}
		});
	});

	socket.on('disconnect', function(){
		socket.broadcast.emit('leavingMessage', {user_name : socket.handshake.session.user_name});
		console.log(socket.id + ' disconnected!');
		var socket_data_model = require('./schemas/socket_data_schema.js');
		socket_data_model.remove({user_name : socket.handshake.session.user_name}, function(error, result){
			if(error)
				throw error;
			else
			{
				console.log('successfully removed the documet from the device_datas database', result);
			}
		});
	});

	socket.on('create_group', function(data){
		console.log('in create_group handler');
		var groups_model = require('./schemas/groups_schema.js');
		groups_model.findOne({group_name : data.group_name}, function(error, result){
			console.log('inside first method');
			if(error)
				throw error;
			else
			{
				console.log('result while creating a group is ', result);
				if(result == null)
				{
					var temp = {};
					temp._id = new Date().getTime();
					temp.group_name = data.group_name;
					temp.created_on = new Date();
					temp.created_by = socket.handshake.session.user_name;
					temp.members = [{
						_id : new Date().getTime(),
						member_name : socket.handshake.session.user_name,
						joined_on : new Date()
					}];
					async.parallel({
						insert_into_groups_collection : function(callback){
							console.log('temp is ', temp);
							groups_model.create(temp, callback);
						},
						insert_into_users_collection : function(callback){
							var users_model = require('./schemas/users_schema.js');
							var x = {};
							x._id = new Date().getTime();
							x.group_name = data.group_name;
							x.joined_on = new Date();
							console.log('x is ', x);
							users_model.update({user_name : socket.handshake.session.user_name}, {$push : {groups : x}}, callback);
						}
					}, function(err, res){
						if(err)
						{
							console.log('error occurred ', err);
						}
						else
						{
							console.log('group created successfully', data.group_name);
							socket.handshake.session.my_groups.push(data.group_name);
							socket.join(data.group_name);
							console.log('my groups are ', socket.handshake.session.my_groups);
							console.log(socket.id, ' joined the room ', data.group_name);
							socket.emit('create_group_reply', {success : true, group_name : data.group_name});
							socket.broadcast.emit('newGroupCreated', {group_name : data.group_name});
						}
					});
				}
				else
				{
					console.log('group already exists ', data.group_name);
					socket.emit('create_group_reply', {success : false, group_name : data.group_name});
				}
			}
		});
	});

	socket.on('getMessages', function(data){
		if(data.type == 'personal')
		{
			var personal_messages_model = require('./schemas/personal_messages_schema.js');
			var temp = [];
			temp.push(socket.handshake.session.user_name);
			temp.push(data.name);
			console.log('temp is ', temp);
			personal_messages_model.find({$and : [{from : {$in : temp}}, {to : {$in : temp}}]}, function(error, result){
				if(error)
				{
					console.log('error occurred while getting the messages ', error);
					socket.emit('getMessages_reply', { status : 'Some internal error occurred ...'});
				}
				else
				{
					console.log('successfully fetched the messages ', result);
					socket.emit('getMessages_reply', { data : result});
				}
			});
		}
		if(data.type == 'group')
		{
			var groups_model = require('./schemas/groups_schema.js');
			groups_model.find({group_name : data.name}, {_id : 0, messages : 1}, function(error, result){
				if(error)
				{
					console.log('error occurred while fetching the group messages ', error);
					socket.emit('getGroupMessages_reply', { status : 'Some internal error occurred ...'});
				}
				else
				{
					console.log('successfully fetched the messages ', result);
					socket.emit('getGroupMessages_reply', { data : result });
				}
			});
		}
	});

	socket.on('newGroupMessage', function(data){
		var temp = {};
		temp._id = new Date().getTime();
		temp.from = data.message.from;
		temp.sent_at = new Date();
		temp.message_content = data.message.message_content;
		var groups_model = require('./schemas/groups_schema.js');
		groups_model.update({group_name : data.message.to}, { $push : {messages : temp}}, function(error, result){
			if(error)
			{
				console.log('some internal error occurred ', error);
			}
			else
			{
				console.log('successfully inserted the message into the database ', result);
				socket.broadcast.to(data.message.to).emit('newGroupMessage', {from : temp.from, group_name : data.message.to, message_content : temp.message_content, to : data.message.to});
				console.log('successfully broadcasted the message');
			}
		});
	});

	socket.on('join_group', function(data){
		console.log('in join_group ', data);
		var temp = {};
		temp._id = new Date().getTime();
		temp.group_name = data.group_name;
		temp.joined_on = new Date();
		var users_model = require('./schemas/users_schema.js');
		async.parallel({
			update_users_collection : function(callback)
			{
				var users_model = require('./schemas/users_schema.js');
				users_model.update({user_name : socket.handshake.session.user_name }, { $push : {groups : temp}}, callback);
			},
			update_groups_collection : function(callback)
			{
				var groups_model = require('./schemas/groups_schema.js');
				var tem = {};
				tem._id = new Date().getTime();
				tem.joined_on = new Date();
				tem.member_name = socket.handshake.session.user_name; 
				groups_model.update({group_name : data.group_name}, { $push : {members : tem}}, callback);
			}
		}, function(error, result){
			if(error)
			{
				console.log('some error occurred ', error);
				socket.emit('join_group_reply', { success : false, group_name : data.group_name});
			}
			else
			{
				console.log(socket.id,' successfully joined the group ', temp.group_name);
				socket.handshake.session.my_groups.push(data.group_name);
				socket.handshake.session.save();
				socket.join(data.group_name);
				socket.emit('join_group_reply', { success : true, group_name : data.group_name});
			}
		});
	});

	socket.on('newPersonalMessage', function(data){
		var temp = {};
		temp._id = new Date().getTime();
		temp.sent_at = new Date();
		temp.from = data.message.from;
		temp.to = data.message.to;
		temp.message_content = data.message.message_content;
		console.log('in newPersonalMessage');
		console.log('message received is ', temp);

		async.parallel({
			insert_message : function(callback)
			{
				var personal_messages_model = require('./schemas/personal_messages_schema.js');
				personal_messages_model.create(temp, callback);
			},
			fetch_socket_id : function(callback)
			{
				var socket_data_model = require('./schemas/socket_data_schema.js');
				socket_data_model.findOne({user_name : temp.to}, {_id : 0, socket_id : 1}, callback);
			}
		}, function(error, result){
			if(error)
			{
				console.log('some internal error occurred ', error);
			}
			else
			{
				console.log('successfully inserted the message into the database ', result.insert_message);
				console.log('socket id of receiver is ', result.fetch_socket_id.socket_id);
				socket.broadcast.to(result.fetch_socket_id.socket_id).emit('newPersonalMessage', {from : temp.from, to : temp.to, message_content : temp.message_content});
			}
		});
	});
});


