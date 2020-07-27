var express = require('express');
var path = require('path');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', function(req, res) {
    res.render('index');
});
var number_of_client = 0;
var user = [];
io.on('connection', function(socket) {
    // when any client get connected
    number_of_client++;
    console.log('A user connected');
    //Whenever someone disconnects this piece of code executed
    socket.on('disconnect', function() {
        // when any client get disconnected
        number_of_client--
        console.log('A user disconnected');
    });

    // registration of the new client
    socket.on('client_name', function(data) {
        if (user.indexOf(data.client_name) > -1) {
            socket.emit('client_result_accept', { result: 0 })
        } else {
            socket.emit('client_result_accept', { result: 1, name: data.client_name });
            user.push(data.client_name);
        }
    });

    socket.on('client_msg', function(data) {
        io.sockets.emit('client_msg_server_to_client', { msg_client: data.new_client_msg, client_name: data.client_name });
    });

});

http.listen(process.env.PORT||3000, function() {
    console.log('server is started');
});