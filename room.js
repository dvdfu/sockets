function Room(id, tiles, answers) {
    this.id = id;
    this.players = {};
    this.gamePhase = 'setupPhase'; // can be either setupPhase or playPhase
    this.tiles = tiles;
    this.answers = answers;
    this.history = [];
};

Room.prototype.match = function() {
    var match = {
        players: this.players,
        gamePhase: this.gamePhase,
        tiles: this.tiles,
        answers: this.answers,
        history: this.history
    };
    return match;
}

Room.prototype.addPlayer = function(player) {
    if(this.players[player.username]) {
        this.players[player.username].socketId = player.socketId;
    } else {
        this.players[player.username] = {
            score: 0,
            thumbnail: player.thumbnail,
            kikUser: player.kikUser,
            socketId: player.socketId,
            ready: false
        };
    }
};

Room.prototype.removePlayer = function(player) {
    this.players[player.username].socketId = null;
};

Room.prototype.checkTiles = function(player, tiles) {
    // check tiles
    // if tile is in answers
        // increment this.players[player.username].score
        // add [player.username, tiles] to history
        // remove tiles from answers
        // return true
    // else 
        // search through history and find the user that answered the tiles
        // return username
};

// Array of users and their scores sorted by score decending
Room.prototype.scores = function() {
    var scores = [];
    for (var player in this.players) {
        if(this.players.hasOwnProperty(player)){
            scores.push([player, this.players[player]]);
        }
    }
    scores.sort(function(a, b) {return a[1].score - b[1].score});
    return scores;
};

// Sets player ready attribute, returns whether all players are ready
Room.prototype.playerReady = function(player) {
    this.players[player.username].ready = true;
    for (var playerName in this.players) {
        if(this.players.hasOwnProperty(playerName) && !this.players[playerName].ready){
            return false;
        }
    }
    return true;
};

Room.prototype.setupPhase = function() {
    // clean up previous game
};

Room.prototype.playPhase = function(tiles, answers) {
    this.tiles = tiles;
    this.answers = answers;
    this.gamePhase = 'playPhase';
};

Room.prototype.setTiles = function(tiles) {
    this.tiles = tiles;
};

Room.prototype.getTiles = function() {
    return this.tiles;
};

Room.prototype.setAnswers = function(answers) {
    this.answers = answers;
};

Room.prototype.getAnswers = function() {
    return this.answers;
};

Room.prototype.getHistory = function() {
    return this.history;
};

Room.prototype.purge = function() {

};

module.exports = Room;