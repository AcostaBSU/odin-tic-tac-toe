function Player(m) {
  return {
    getM() {
      return m;
    }
  }
}

function TicTacToe() {
  const board = (function () {
    let board = [["-", "-", "-"],
                 ["-", "-", "-"],
                 ["-", "-", "-"]];
  
    return {
      getBoard() {
        return JSON.parse(JSON.stringify(board));
      },

      getRow(x) {
	return JSON.parse(JSON.stringify(board[x]));
      },

      getCol(y) {
	let col = new Array();

	for (const row of board) {
	  col.push(row[y]);
	}
        return JSON.parse(JSON.stringify(col));
      },

      
      getDiags() {
        let firstDiag = new Array();
	let secondDiag = new Array();

	for (let i = 0; i < 3; i++) {
	  firstDiag.push(board[i][i]);
	  secondDiag.push(board[2-i][i]);
	}

	return [firstDiag,secondDiag];
      },

      updateBoard(m, x, y) {
        board[x][y] = m;
      }
    }
  })();
  const p1 = Player("x");
  const p2 = Player("o");
  let winner = false;

  const controller = (function(p1, p2) {
    let turn = 0;
    let allPlayers = [p1, p2];

    return {
      currentTurn() {
	let curr = turn % allPlayers.length;
	return allPlayers[curr];
      },
      incrementTurn() {
        turn++;
      }
    }
  })(p1, p2);

  const verifier = (function(board) {
    
    function isRowWin(x) {
      const row = board.getRow(x);

      return row[0] === row[1] && row[1]  === row[2] && row[0] !== "-";
    }

    function isColWin(y) {
      const col = board.getCol(y);

      return col[0] === col[1] && col[1] === col[2] && col[0] !== "-";
    }

    function isDiagWin() {
      const diags = board.getDiags();

      console.log(diags);
      for (const diag of diags) {
	console.log(diag);

	if (diag[0] === diag[1] && diag[1] === diag[2] && diag[0] !== "-") {
	  return true;
	}
      }

      return false;
    }

    return {
      isValid(x, y) {
        return board.getBoard()[x][y] === "-";
      },

      isWin(x, y) {
        if (x == y ||
           (x == 0 && (y == 0 || y == 2)) || 
           (x == 2 && (y == 0 || y == 2))) {
          return isRowWin(x) || isColWin(y) || isDiagWin();
        }

        return isRowWin(x) || isColWin(y);
      }
    }
  })(board);

  return {
    isWinner() {
      return winner;
    },

    playTurn() {
      // get x and y from user
      let x = prompt("x: ");
      let y = prompt("y: ");

      while (!verifier.isValid(x, y)) {
	x = prompt("x: ");
        y = prompt("y: ");
      }
      
      board.updateBoard(controller.currentTurn().getM(), x, y);

      if (!winner) {
        winner = verifier.isWin(x, y);
        controller.incrementTurn();
      }
    },

    getBoard() {
      return board.getBoard();
    }
  }
}


const gameOne = TicTacToe();

while (!gameOne.isWinner()) {
  gameOne.playTurn();
  console.log(gameOne.getBoard());
}
