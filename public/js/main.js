// Kik login integration

var user;
if (kik.enabled) {
	kik.getUser(function (response) {
		if (response) {
			user = {
				username: response.username,
				thumbnail: response.thumbnail,
				kikUser: true,
			};
			console.log(user);
			document.querySelector('.log-head .log-name').innerHTML = user.username;
			document.querySelector('.log-head .log-icon').innerHTML = '<img src="' + user.thumbnail + '"></img>';
		}
	});
}

// 

var board = JSON.stringify({
	tiles: [
		{ color: 0, number: 1 },
		{ color: 1, number: 2 },
		{ color: 2, number: 3 },
		{ color: 1, number: 4 },
		{ color: 2, number: 5 },
		{ color: 0, number: 6 },
		{ color: 2, number: 7 },
		{ color: 0, number: 8 },
		{ color: 1, number: 9 },
	],
	answers: [],
});

loadTiles(board);

function loadTiles(boardJSON) {
	var board = JSON.parse(boardJSON);
	var tiles = board.tiles;

	for (var i = 0; i < 9; i++) {
		var $tile = document.getElementsByClassName('tile')[i];

		var $tileText = document.createElement('div');
		$tileText.className = 'tile-text text';
		$tileText.innerHTML = tiles[i].number;

		var color;
		switch(tiles[i].color) {
			case 0: color = '#f34'; break;
			case 1: color = '#fc3'; break;
			case 2: color = '#33f'; break;
		}
		$tile.style.backgroundColor = color;
		$tile.appendChild($tileText);
	}
}