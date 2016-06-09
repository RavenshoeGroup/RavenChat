var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var numUsers = 0;
var port = process.env.PORT || 3000;

app.get('/', function(req, res){
	res.sendFile('/app/index.html');
});


io.on('connection', function(socket){

	var addedUser = false;

	socket.on('new message', function(data){
		socket.broadcast.emit('new message', {
			username: socket.username,
			message: data
		});
	});

	socket.on('add user', function(username){
		if(addedUser) return;

		socket.username = username;
		++numUsers;
		addedUser = true;
		console.log(username + ' connected')

		socket.emit('login', {
	      numUsers: numUsers
	    });
		socket.broadcast.emit('user joined',{
			username: socket.username,
			numUsers: numUsers
		});
	});

	socket.on('disconnect', function(){
		if(addedUser){
			--numUsers;

			socket.broadcast.emit('user left', {
				username: socket.username,
				numUsers:numUsers
			});
		}
	});
	
});


http.listen(process.env.PORT || 3000, function(){
  console.log('listening on', http.address().port);
});
