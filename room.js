function Room(id) {
    this.id = id;
    this.players = {};
    this.gamePhase = 'setupPhase'; // can be either setupPhase or playPhase
    this.tiles = [];
    this.answers = [];
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
        this.players[player.username].active = true;
    } else {
        this.players[player.username] = {
            score: 0,
            thumbnail: player.thumbnail,
            kikUser: player.kikUser,
            active: true,
            ready: false
        };
    }
};

Room.prototype.removePlayer = function(player) {
    this.players[player.username].active = false;
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
    for(var player in this.players) {
        if(this.players.hasOwnProperty(player)){
            scores.push([player, this.players[player]]);
        }
    }
    scores.sort(function(a, b) {return a[1].score - b[1].score});
    return scores;
};

// Sets player ready attribute
Room.prototype.playerReady = function(player) {
    this.players[player.username].ready = true;
};

Room.prototype.arePlayersReady = function() {
    for(var playerName in this.players) {
        if(!this.players[playerName].ready && this.players[playerName].active) {
            return false;
        }
    }
    return true;
}

Room.prototype.prepareNewMatch = function() {
    // clean up previous game

    this.gamePhase = 'setupPhase';
    for(var playerName in this.players) {
        this.players[playerName].ready = false;
    }
};

Room.prototype.startNewMatch = function(tiles, answers) {
    var purgeArr = [];
    for(var playerName in this.players) {
        if(!this.players[playerName].active){
            purgeArr.push(playerName);
        }
    }
    for(var i = 0; i < purgeArr.length; i++) {
        delete this.players[purgeArr[i]];
    }

    for(var playerName in this.players) {
        if(this.players[playerName].active){
            this.players[playerName].ready = true;
        }
    }

    this.gamePhase = 'playPhase';
    this.tiles = tiles;
    this.answers = answers;
    this.history = [];
}

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