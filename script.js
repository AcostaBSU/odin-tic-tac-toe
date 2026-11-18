function buildTicTacToe(game) {
  return {
    addBoardToDOM() {

      function playTurn(event) {
	if (game.isWinner()) return;

        let target = event.target;
	let marker = game.getTurn();

	if (game.playTurn(Number(target.getAttribute("data-x")),
                          Number(target.getAttribute("data-y")))) {
          target.textContent = marker;
	}
      }
      const body = document.querySelector("body");

      const tttContainer = document.createElement("div");
      tttContainer.setAttribute("class", "ttt-container");

      const tttBoard = document.createElement("div");
      tttBoard.setAttribute("class", "ttt-board");

      let j = 0;
      for (let i = 0; i < 9; i++) {
        const tttTile = document.createElement("div");
        tttTile.setAttribute("class", "ttt-tile");
	if (i > 0 && (i % 3) === 0) {
	  j++;
	}
        tttTile.setAttribute("data-x", j.toString());
        tttTile.setAttribute("data-y", (i % 3).toString());
	tttBoard.appendChild(tttTile);
      }

      tttBoard.addEventListener("click", playTurn);
      tttContainer.appendChild(tttBoard);
      body.appendChild(tttContainer);
    }
  }
}

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

      for (const diag of diags) {
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

    playTurn(x, y) {
      if (!verifier.isValid(x, y)) {
        return false;
      }
      
      board.updateBoard(controller.currentTurn().getM(), x, y);

      winner = verifier.isWin(x, y);
      if (!winner) {
        controller.incrementTurn();
      }

      return true;
    },

    getBoard() {
      return board.getBoard();
    },

    getTurn() {
      return controller.currentTurn().getM();
    }
  }
}

const gameOne = TicTacToe();
const tttBoardDom = buildTicTacToe(gameOne);
tttBoardDom.addBoardToDOM();

/*
while (!gameOne.isWinner()) {
  gameOne.playTurn();
  console.log(gameOne.getBoard());
}
*/
