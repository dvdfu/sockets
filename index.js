var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var uuid = require('node-uuid');
var Match = require('./match.js')
var _ = require('underscore');

app.use(express.static(__dirname+'/public'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

var players = {};
var matches = {}; //gamePhase is a property of each match

function remove(socket) {

}

io.on('connection', function(socket) {
    console.log('a user connected');

    socket.on('connect', function() {
        //load player information from database ie. purchased themes
    });

    socket.on('disconnect', function() {
        remove(socket);
        console.log('user disconnected');
    });
    
    socket.on('joinMatch', function(user) {
        console.log('message: ' + msg);
    });

    socket.on('solveRequest', function(tiles) {

    });

    socket.on('createMatch', function() {
        var id = uuid.v4();
        //var tiles = ;
        //var answers = ;
        var match = new Match(id, tiles, answers);
        match.addPlayer(players[socket.id]);
        matches[id] = match;

    });
});

http.listen(process.env.PORT || 3000, function() {
    console.log('listening on *:3000');
});