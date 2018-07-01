module.exports= function(session1){
	var socket = require('socket.io');
	var io = socket();
	io.listen(5555);
	io.use(sharedSession(session1));
	return io;
};