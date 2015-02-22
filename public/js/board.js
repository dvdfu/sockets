console.log(getNewBoard());

function getNewBoard() {
	var allTiles = makeAllTiles(),
		tiles = shuffle(allTiles).slice(0, 9),
		answers = solveBoard(tiles);

	return {
		tiles: tiles,
		answers: answers,
	};

	function makeAllTiles() {
		var tiles = [];
		for (var i = 0; i < 6; i++) {
			for (var j = 0; j < 3; j++) {
				tiles.push({
					color: j,
					number: i + 1
				});
			}
		}
		return tiles;
	}

	function solveBoard(tiles) {
		var sets = [];
		for (var i = 0; i < 9; i++) {
			getAnswers(i, 0, []);
		}

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

		return sets;
	}

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
}