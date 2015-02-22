function Match(id, tiles, answers) {
    this.id = id;
    this.players = {};
    this.gamePhase = 'setupPhase'; // can be either setupPhase or playPhase
    this.tiles = tiles;
    this.answers = answers;
};

Match.prototype.addPlayer = function(user) {
    this.players[user.username] = {
        score: 0,
        thumbnail: user.thumbnail,
        kikUser = user.kikUser
    };
};

// Array of users and their scores sorted by score decending
Match.prototype.scores = function() {
    var scores = [];
    for (var player in this.players) {
        if(this.players.hasOwnProperty(player)){
            scores.push([player, this.players[player]]);
        }
    }
    scores.sort(function(a, b) {return a[1].score - b[1].score});

    return scores;
};

Match.prototype.setupPhase = function() {

};

Match.prototype.playPhase = function(tiles, answers) {
    this.tiles = tiles;
    this.answers = answers;
    this.gamePhase = 'playPhase';
};

Match.prototype.setTiles = function(tiles) {
    this.tiles = tiles;
};

Match.prototype.getTiles = function() {
    return this.tiles;
};

Match.prototype.setAnswers = function(answers) {
    this.answers = answers;
};

Match.prototype.getAnswers = function() {
    return this.answers;
};

module.exports = Match;