var express     = require('express'),
    app         = express(),
    http        = require('http').Server(app),
    io          = require('socket.io')(http),
    uuid        = require('node-uuid'),
    faker       = require('faker'),
    Room        = require('./room.js',
    _           = require('underscore');

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

var players = {},
    rooms = {}; //gamePhase is a property of each room

function remove(socket) {
    var room = rooms[socket.roomId];
    room.removePlayer(players[socket.id]);
    io.to(socket.roomId).emit('playerLeft', players[socket.id].username);
    delete players[socket.id];
    // rooms handle their own cleaning up at the end of each round
}

function newGame(roomId) {
    var room = rooms[roomId];

    // prepare new game

    io.to(socket.roomId).emit('matchOver', room.scores());
}

io.on('connection', function(socket) {
    console.log('a user connected');

    socket.on('connect', function(user) {
        //load player information from database ie. purchased themes, current theme
        if(user.kikUser) {
            players[socket.id] = {
                username: user.username,
                thumbnail: user.thumbnail,
                kikUser: true,
                socketId: socket.id
            };
        } else {
            players[socket.id] = {
                username: faker.name.firstName() + ' (fake)',
                thumbnail: faker.image.avatar(),
                kikUser: false,
                socketId: socket.id
            };
        }

        socket.emit('connected', players[socket.id]);
    });

    socket.on('createRoom', function() {
        var id = uuid.v4();
        //var tiles = ;
        //var answers = ;
        var room = new Room(id, tiles, answers);
        rooms[id] = room;
        socket.roomId = room.id;
        socket.join(socket.roomId);
        room.addPlayer(players[socket.id]);

        // create match in room

        var match = room.match();
        socket.emit('createdRoom', match);
    });

    socket.on('joinRoom', function(roomId) {
        console.log('join room with Id: ' + roomId);
        if(typeof rooms[roomId] === 'undefined') {
            socket.emit('error');
        } else {
            var room = rooms[roomId];
            socket.roomId = room.id;
            socket.join(socket.roomId);
            room.addPlayer(players[socket.id]);

            var match = room.match();
            socket.emit('joinedRoom', match);
        }
    });

    socket.on('tileSolve', function(tiles) {
        var room = rooms[socket.roomId];
        var result = room.checkTiles(players[socket.id], tiles);
        if(result === true) {
            if(room.answers.length > 0) {
                var resObj = {
                    username: players[socket.id].username,
                    tiles: tiles
                };
                io.to(socket.roomId).emit('tileSolved', resObj);
            } else {
                newGame(socket.roomId);
            }
        } else if(result) {
            socket.emit('alreadySolved', result);
        } else {
            socket.emit('errorSolve');
        }
    });

    socket.on('ready', function() {
        io.to(socket.roomId).emit('playerReadied', players[socket.id].username);
        
        var room = rooms[socket.roomId];
        if(room.playerReady(players[socket.id])) {

        } else {

        }

    });

    socket.on('playerLeave', function() {
        remove(socket);
    });

    socket.on('disconnect', function() {
        remove(socket);
        console.log('user disconnected');
    });
});

http.listen(process.env.PORT || 3000, function() {
    console.log('listening on *:3000');
});