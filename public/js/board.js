var allTiles = makeAllTiles();
var tiles = shuffle(allTiles).slice(0, 9);
printBoard(tiles);
solveBoard(tiles);

function shuffle(array) {
	var index = array.length,
		temp,
		rand;
	while (index) {
		rand = Math.floor(Math.random() * index--);
		temp = array[index];
		array[index] = array[rand];
		array[rand] = temp;
	}
	return array;
}

function makeAllTiles() {
	var tiles = [];
	for (var i = 0; i < 6; i++) {
		for (var j = 0; j < 3; j++) {
			var colorName;
			switch (j) {
				case 0: colorName = 'RED'; break;
				case 1: colorName = 'BLU'; break;
				case 2: colorName = 'YEL'; break;
			}
			tiles.push({
				color: colorName,
				number: i + 1
			});
		}
	}
	return tiles;
}

function getTile() {
	var num, color, colorName;
	num = Math.floor((Math.random() * 5) + 2);
	color = Math.floor((Math.random() * 3));
	switch (color) {
		case 0: colorName = 'RED'; break;
		case 1: colorName = 'BLU'; break;
		case 2: colorName = 'YEL'; break;
	}

	return {
		color: colorName,
		number: num
	};
}

function solveBoard(tiles) {
	var sets = [];
	for (var i = 0; i < 9; i++) {
		getAnswers(i, 0, []);
	}
	console.log(sets.length + ' answers:');
	sets.forEach(function(set) {
		console.log(set);
	});

	function getAnswers(index, sum, set) {
		var num = tiles[index].number;
		set.push(tiles[index].color + ' ' + num);
		sum += num;

		if (sum < 10) {
			for (var j = index + 1; j < 9; j++) {
				getAnswers(j, sum, set);
			}
		} else if (sum == 10 && set.length > 2) {
			sets.push(set.slice());
		}

		set.pop(num);
		sum -= num;
	}
}

function printBoard(tiles) {
	tiles.forEach(function(tile) {
		console.log(tile.color + " " + tile.number);
	});
}