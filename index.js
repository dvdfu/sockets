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

io.on('connection', function(socket) {
    console.log('a user connected');

    socket.on('connect', function(user) {
        //load player information from database ie. purchased themes, current theme
        if(user.kikUser) {
            players[socket.id] = {
                username: user.username,
                thumbnail: user.thumbnail,
                kikUser: true,
            };
        } else {
            players[socket.id] = {
                username: faker.name.firstName() + ' (fake)',
                thumbnail: faker.image.avatar(),
                kikUser: false,
            };
        }

        socket.emit('connected', players[socket.id]);
    });

    socket.on('createRoom', function() {
        var id = uuid.v4();
        var room = new Room(id);
        rooms[id] = room;
        socket.roomId = room.id;
        socket.join(socket.roomId);
        room.addPlayer(players[socket.id]);

        // prepare match in room
        room.prepareNewMatch();

        var match = room.match();
        socket.emit('joinedRoom', match);
    });

    // The are 3 scenarios when a user joins
    // 1) The user joins a match during the setupPhase
    // 2) The user joins a match during the playPhase
    // 3) The user leaves and rejoins a match during the playPhase
    socket.on('joinRoom', function(roomId) {
        console.log('join room with Id: ' + roomId);
        if(typeof rooms[roomId] === 'undefined') {
            socket.emit('error');
        } else {
            var room = rooms[roomId];
            socket.roomId = room.id;
            room.addPlayer(players[socket.id]);
            io.to(socket.roomId).emit('playerJoined', room.players[players[socket.id].username]);

            socket.join(socket.roomId);
            var match = room.match();
            socket.emit('joinedRoom', match);
        }
    });

    // There are 3 things that can happen when a user submits a tileSolve request
    // 1) The guess is correct
    //      --- if there are more answers to be solved, the current solve will be sent to users
    //      --- else there are no more answers left and the current match needs to be cleaned up,
    //          and the next match needs to be set up
    // 2) The guess is correct, but the answers has already been solved
    //      --- this is an edge case because verification is done frontend for already solved tiles,
    //          but there is the rare instance that two users will submit at the same time
    // 3) The guess is incorrect
    //      --- also an edge case that needs to be handled
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
                io.to(socket.roomId).emit('matchOver', room.scores());
                // prepare new game
                room.prepareNewMatch();

                var match = room.match();
                io.to(socket.roomId).emit('joinedRoom', match);
            }
        } else if(result) {
            socket.emit('alreadySolved', result);
        } else {
            socket.emit('errorSolve');
        }
    });

    // Once all players are ready, start the next match
    socket.on('ready', function() {
        io.to(socket.roomId).emit('playerReadied', players[socket.id].username);
        var room = rooms[socket.roomId];
        room.playerReady(players[socket.id])
        if(room.arePlayersReady()) {
            room.startNewMatch();
            // send match information to players
            var match = room.match();
            io.to(socket.roomId).emit('joinedRoom', match);
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